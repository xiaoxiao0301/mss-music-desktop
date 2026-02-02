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

    // 生成随机头像与昵称（仅第一次） 
    avatar := fmt.Sprintf("https://i.pravatar.cc/100?img=%d", rand.Intn(70)) 
    nickname := []string{"小明", "阿杰", "星河旅人", "音乐探索者", "夜行者"}[rand.Intn(5)]

    a.tokenStore.SaveUserProfile(result.Data.User.ID, UserProfile{ Avatar: avatar, Nickname: nickname, })

    return result.Data.User.ID, nil
}

func (a *AuthBridge) Logout() error {
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