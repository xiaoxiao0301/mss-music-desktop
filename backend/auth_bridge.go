package backend

import (
    "encoding/json"
    "log"
)

type AuthBridge struct {
    tokenStore *KeyringTokenStore
    api *APIClient
}

type AuthMeResponse struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Data   struct  {
        ID    int    `json:"id"`
        Phone string `json:"phone"`
    } `json:"data"`
} 

type UserDTO struct {
    ID        int    `json:"ID"`
    Phone     string `json:"Phone"`
    Avatar    string `json:"avatar"`
    Nickname  string `json:"nickname"`
    CreatedAt string `json:"CreatedAt"`
    UpdatedAt string `json:"UpdatedAt"`
}

type LoginResponse struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Data    struct {
        AccessToken  string `json:"access_token"`
        RefreshToken string `json:"refresh_token"`
        User       UserDTO      `json:"user"`
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
func (a *AuthBridge) Login(phone string, code string) (int, error) {
    resp, err := a.api.Post(GetVerifyOTPPath(), map[string]string{
        "phone": phone,
        "code":  code,
    })
    if err != nil {
        return 0,err
    }

    var result LoginResponse
    if err := json.Unmarshal(resp, &result); err != nil {
        return 0, err
    }

    a.tokenStore.Save(result.Data.AccessToken, result.Data.RefreshToken)

    // 使用服务端返回的用户资料（如为空则保留本地已有的资料）
    existingProfile, _ := a.tokenStore.LoadUserProfile(result.Data.User.ID)
    avatar := result.Data.User.Avatar
    nickname := result.Data.User.Nickname
    if avatar == "" && existingProfile != nil {
        avatar = existingProfile.Avatar
    }
    if nickname == "" && existingProfile != nil {
        nickname = existingProfile.Nickname
    }

    a.tokenStore.SaveUserProfile(result.Data.User.ID, UserProfile{Avatar: avatar, Nickname: nickname})

    return result.Data.User.ID, nil
}

func (a *AuthBridge) Logout() error {
    // 先获取 refreshToken
    _, refreshToken, err := a.tokenStore.Load()
    if err != nil {
        log.Printf("Failed to load tokens: %v", err)
        return err
    }

    // 调用后端 logout API 清理服务器端 token
    if refreshToken != "" {
        _, apiErr := a.api.PostAuth(GetAuthLogoutPath(), map[string]string{
            "refresh_token": refreshToken,
        })
        if apiErr != nil {
            log.Printf("Failed to call logout API: %v", apiErr)
            // 继续执行，即使服务器端清理失败，也要清除本地 token
        }
    }

    // 清除本地 token
    return a.tokenStore.Clear()
}

func (a *AuthBridge) IsLoggedIn() bool {
    var status bool
    resp, err := a.api.Get(GetAuthMePath())
    if err != nil {
        status = false
    }
    var result AuthMeResponse
    if err := json.Unmarshal(resp, &result); err != nil {
        status = false
    }
    log.Println(result)
    if result.Data.ID > 0 { 
        status = true
    }
    return  status
}

func (a *AuthBridge) GetUserProfile(userID int) (*UserProfile, error) {
    return a.tokenStore.LoadUserProfile(userID)
}