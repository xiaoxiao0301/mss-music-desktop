package backend

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"sync"
	"time"
)

type APIClient struct {
    baseURL     string
    tokenStore  *KeyringTokenStore
    httpClient  *http.Client
    mu          sync.Mutex
}

func NewAPIClient(baseURL string, store *KeyringTokenStore) *APIClient {
    return &APIClient{
        baseURL:    baseURL,
        tokenStore: store,
        httpClient: &http.Client{Timeout: 10 * time.Second},
    }
}

func (c *APIClient) doRequest(method, path string, body any) ([]byte, error) {
    // 1. 读取 token
    token, refresh, err := c.tokenStore.Load()
    if err != nil {
        return nil, errors.New("not logged in")
    }

    // 2. 构造请求
    var reqBody io.Reader
    if body != nil {
        b, _ := json.Marshal(body)
        reqBody = bytes.NewBuffer(b)
    }

    req, _ := http.NewRequest(method, c.baseURL+path, reqBody)
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer "+token)

    // 3. 发起请求
    resp, err := c.httpClient.Do(req)
    if err != nil {
        return nil, err
    }

    // 4. accessToken 过期 → 自动刷新
    if resp.StatusCode == 401 {
        return c.refreshAndRetry(method, path, body, refresh)
    }

    // 5. 正常返回
    return io.ReadAll(resp.Body)
}

func (c *APIClient) refreshAndRetry(method, path string, body any, refreshToken string) ([]byte, error) {
    c.mu.Lock()
    defer c.mu.Unlock()

    // 再次检查 token 是否已刷新（避免并发重复刷新）
    stored, _, _ := c.tokenStore.Load()
    if stored != "" {
        // 已刷新 → 直接重试
        return c.doRequest(method, path, body)
    }

    // 1. 调用 Gin 后端刷新 token
    refreshReq := map[string]string{"refresh_token": refreshToken}
    b, _ := json.Marshal(refreshReq)

    req, _ := http.NewRequest("POST", c.baseURL+"/auth/refresh", bytes.NewBuffer(b))
    req.Header.Set("Content-Type", "application/json")

    resp, err := c.httpClient.Do(req)
    if err != nil {
        return nil, err
    }
    if resp.StatusCode != 200 {
        return nil, errors.New("refresh failed")
    }

    var result struct {
        AccessToken  string `json:"access_token"`
        RefreshToken string `json:"refresh_token"`
    }
    json.NewDecoder(resp.Body).Decode(&result)

    // 2. 保存新 token
    c.tokenStore.Save(result.AccessToken, result.RefreshToken)

    // 3. 重试原请求
    return c.doRequest(method, path, body)
}

func (c *APIClient) Post(path string, body any) ([]byte, error) {
    b, _ := json.Marshal(body)
    req, _ := http.NewRequest("POST", c.baseURL+path, bytes.NewBuffer(b))
    req.Header.Set("Content-Type", "application/json")

    resp, err := c.httpClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    return io.ReadAll(resp.Body)
}
