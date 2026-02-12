package backend

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
)

const requestTimeout = 10 * time.Second

type APIClient struct {
    baseURL     string
    tokenStore  *KeyringTokenStore
    httpClient  *http.Client
    mu          sync.Mutex
    
    deviceID  string
    platform  string

}

type CommonParams struct {
    Platform string `json:"platform"`
    DeviceID string `json:"device_id"`
}

type RequestOptions struct {
    WithToken  bool
}


type RefreshTokenResponse struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Data    struct {
        AccessToken  string `json:"access_token"`
        RefreshToken string `json:"refresh_token"`
    } `json:"data"`
}

func NewAPIClient(baseURL string, store *KeyringTokenStore, devicedID, platform string) *APIClient {
    return &APIClient{
        baseURL:    baseURL,
        tokenStore: store,
        httpClient: &http.Client{Timeout: 10 * time.Second},
        deviceID:   devicedID,
        platform:   platform,
    }
}

func (c *APIClient) doRequest(method, path string, body any, opt RequestOptions) ([]byte, error) {
    log.Println("---- doRequest ----") 
    log.Println("method:", method) 
    log.Println("path:", path) 
    log.Println("body:", body) 
    log.Println("opt:", opt)
    var token, refresh string
    var err error
    if opt.WithToken {
        // 1. 读取 token
        token, refresh, err = c.tokenStore.Load()
        if err != nil || token == "" {
            return nil, errors.New("not logged in")
        }
    }

    // 2. 构造请求
    var reqBody io.Reader
    if body != nil {
        b, _ := json.Marshal(body)
        reqBody = bytes.NewBuffer(b)
    }
    log.Println("url:" + c.baseURL + path)
    req, _ := http.NewRequest(method, c.baseURL+path, reqBody)
    req.Header.Set("Content-Type", "application/json")
    if opt.WithToken {
        req.Header.Set("Authorization", "Bearer "+token)
    }

    // 3. 发起请求
    resp, err := c.httpClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    data, _ := io.ReadAll(resp.Body)

    // 4. accessToken 过期 → 自动刷新
    if resp.StatusCode == 401 {
        return c.refreshAndRetry(method, path, body, token, refresh, opt)
    }

    if resp.StatusCode < 200 || resp.StatusCode >= 300 {
        return nil, fmt.Errorf("http %d %s", resp.StatusCode, string(data))
    }
    // 5. 正常返回
    return data, nil
}

func (c *APIClient) refreshAndRetry(method, path string, body any, oldToken, refreshToken string, opt RequestOptions) ([]byte, error) {
    c.mu.Lock()
    defer c.mu.Unlock()

    // 再次检查 token 是否已被其他 goroutine 刷新
    current, _, _ := c.tokenStore.Load()
    if current != oldToken {
        return c.doRequest(method, path, body, opt)
    }

    // 1. 调用 Gin 后端刷新 token
    refreshReq := map[string]string{"refresh_token": refreshToken}
    b, _ := json.Marshal(refreshReq)

    req, _ := http.NewRequest("POST", c.baseURL+ GetAuthRefreshPath(), bytes.NewBuffer(b))
    req.Header.Set("Content-Type", "application/json")

    resp, err := c.httpClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != 200 {
        return nil, errors.New("refresh failed")
    }

    var result RefreshTokenResponse
    json.NewDecoder(resp.Body).Decode(&result)

    // 2. 保存新 token
    c.tokenStore.Save(result.Data.AccessToken, result.Data.RefreshToken)

    // 3. 重试原请求
    return c.doRequest(method, path, body, opt)
}

func (c *APIClient) Get(path string) ([]byte, error) {
    sep := "?"
    if strings.Contains(path, "?") {
        sep = "&"
    }
    url := path + sep + "device_id=" + c.deviceID + "&platform=" + c.platform
    return c.doRequest("GET", url, nil, RequestOptions{WithToken: true})
}

func (c *APIClient) PostAuth(path string, body any) ([]byte, error) {
    merged := map[string]any{
        "device_id": c.deviceID,
        "platform":  c.platform,
    }
    if body != nil { 
        b, _ := json.Marshal(body) 
        json.Unmarshal(b, &merged) 
    }
    return c.doRequest("POST", path, merged, RequestOptions{WithToken: true})
}


func (c *APIClient) Post(path string, body any) ([]byte, error) {
    merged := map[string]any{
        "device_id": c.deviceID,
        "platform":  c.platform,
    }
    if body != nil { 
        b, _ := json.Marshal(body) 
        json.Unmarshal(b, &merged) 
    }
    return c.doRequest("POST", path, merged, RequestOptions{WithToken: false})
}

func (c *APIClient) PatchAuth(path string, body any) ([]byte, error) {
    merged := map[string]any{
        "device_id": c.deviceID,
        "platform":  c.platform,
    }
    if body != nil { 
        b, _ := json.Marshal(body) 
        json.Unmarshal(b, &merged) 
    }
    return c.doRequest("PATCH", path, merged, RequestOptions{WithToken: true})
}

func (c *APIClient) DeleteAuth(path string, body any) ([]byte, error) {
    merged := map[string]any{
        "device_id": c.deviceID,
        "platform":  c.platform,
    }
    if body != nil { 
        b, _ := json.Marshal(body) 
        json.Unmarshal(b, &merged) 
    }
    return c.doRequest("DELETE", path, merged, RequestOptions{WithToken: true})
}
