package backend

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
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
    ID int `json:"ID"` 
    Phone string `json:"Phone"` 
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

    // 检查用户是否已有个人资料，仅第一次登录时生成随机头像与昵称
    existingProfile, _ := a.tokenStore.LoadUserProfile(result.Data.User.ID)
    var avatar, nickname string
    
    if existingProfile == nil {
        // 首次登录，生成随机头像与昵称
        avatar = fmt.Sprintf("https://i.pravatar.cc/100?img=%d", rand.Intn(70)) 
        nickname = []string{"小明", "阿杰", "星河旅人", "音乐探索者", "夜行者"}[rand.Intn(5)]
    } else {
        // 使用已有的个人资料
        avatar = existingProfile.Avatar
        nickname = existingProfile.Nickname
    }

    a.tokenStore.SaveUserProfile(result.Data.User.ID, UserProfile{ Avatar: avatar, Nickname: nickname, })

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