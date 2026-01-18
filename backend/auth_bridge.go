package backend

import (
	"encoding/json"
	"fmt"
	"mss-music-desktop/config"
)

type AuthBridge struct {
    tokenStore *KeyringTokenStore
    api *APIClient
}

type LoginResponse struct {
    Token        string `json:"token"`
    RefreshToken string `json:"refresh_token"`
}

func NewAuthBridge(cfg *config.Config) *AuthBridge {
    store := NewKeyringTokenStore()
    fullURL := fmt.Sprintf("%s:%d", cfg.Server.BaseURL, cfg.Server.BasePort)
    api := NewAPIClient(fullURL, store)

    return &AuthBridge{
        tokenStore: store,
        api: api,
    }
}

// 发送验证码
func (a *AuthBridge) SendOtp(phone string) error {
    _, err := a.api.Post("/auth/request-otp", map[string]string{
        "phone": phone,
    })
    if err != nil {
        return err
    }
    return nil
}

// 登录（手机号 + 验证码）
func (a *AuthBridge) Login(phone string, code string) (error) {
    resp, err := a.api.Post("/auth/verify-otp", map[string]string{
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
    a.tokenStore.Save(result.Token, result.RefreshToken)
    return nil
}

func (a *AuthBridge) GetTokens() (*LoginResponse, error) {
    token, refreshToken, err := a.tokenStore.Load()
    if err != nil {
        return nil, err
    }
    return &LoginResponse{
        Token:        token,
        RefreshToken: refreshToken,
    }, nil
}

func (a *AuthBridge) Logout() error {
    return a.tokenStore.Clear()
}
