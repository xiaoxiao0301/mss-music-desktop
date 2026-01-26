package backend

import (
	"encoding/json"
	"log"
)

type AuthBridge struct {
    tokenStore *KeyringTokenStore
    api *APIClient
}

type LoginResponse struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Data    struct {
        AccessToken  string `json:"access_token"`
        RefreshToken string `json:"refresh_token"`
    } `json:"data"`
}


func NewAuthBridge(api *APIClient, store *KeyringTokenStore) *AuthBridge {
    return &AuthBridge{
        tokenStore: store,
        api: api,
    }
}

// 发送验证码
func (a *AuthBridge) SendOtp(phone string) error {
    _, err := a.api.Post(GetRequestOTPPath(), map[string]string{
        "phone": phone,
    })
    log.Println(err)
    if err != nil {
        return err
    }
    return nil
}

// 登录（手机号 + 验证码）
func (a *AuthBridge) Login(phone string, code string) (error) {
    resp, err := a.api.Post(GetVerifyOTPPath(), map[string]string{
        "phone": phone,
        "code":  code,
    })
    if err != nil {
        return err
    }

    var result LoginResponse
    if err := json.Unmarshal(resp, &result); err != nil {
        return err
    }

    a.tokenStore.Save(result.Data.AccessToken, result.Data.RefreshToken)
    return nil
}

func (a *AuthBridge) Logout() error {
    return a.tokenStore.Clear()
}

func (a *AuthBridge) IsLoggedIn() bool {
    token, refresh, err := a.tokenStore.Load()
    if err != nil {
        return false
    }
    if token == "" || refresh == "" {
        return false
    }
    return true
}
