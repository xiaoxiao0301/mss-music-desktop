package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"sync"

	"github.com/google/uuid"
	"github.com/zalando/go-keyring"
)

const (
    serviceName = "com.mss.music.desktop"
    tokenKey    = "auth_token"
    refreshKey  = "refresh_token"
    deviceIDKey  = "device_id"
    userProfileKeyPrefix = "user_profile_"
)

var (
    deviceIDCache string
    deviceOnce sync.Once
)

type KeyringTokenStore struct{}

type UserProfile struct {
    Avatar string   `json:"avatar"`
    Nickname string `json:"nickname"`
}

func NewKeyringTokenStore() *KeyringTokenStore {
    return &KeyringTokenStore{}
}

func (s *KeyringTokenStore) Save(token, refresh string) error {
    if err := keyring.Set(serviceName, tokenKey, token); err != nil {
        log.Printf("Keyring Set Error (token): %v\n", err)
        return err
    }
    if err := keyring.Set(serviceName, refreshKey, refresh); err != nil {
        log.Printf("Keyring Set Error (refresh): %v\n", err)
        return err
    }
    return nil
}

func (s *KeyringTokenStore) Load() (string, string, error) {
    token, err := keyring.Get(serviceName, tokenKey)
    if err != nil {
        if errors.Is(err, keyring.ErrNotFound) { 
            return "", "", nil 
        } 
        return "", "", err
    }

    refresh, err := keyring.Get(serviceName, refreshKey)
    if err != nil {
        if errors.Is(err, keyring.ErrNotFound) { 
            return "", "", nil 
        } 
        return "", "", err
    }

    return token, refresh, nil
}

func (s *KeyringTokenStore) Clear() error {
    if err := keyring.Delete(serviceName, tokenKey); err != nil { 
        return err 
    } 
    if err := keyring.Delete(serviceName, refreshKey); err != nil { 
        return err 
    } 
    return nil
}

func (s *KeyringTokenStore) GetDeviceID() (string, error) {
    var err error
    deviceOnce.Do(func() {
        var stored string
        stored, err = keyring.Get(serviceName, deviceIDKey)
        if err == nil && stored != "" {
            if _, parseErr := uuid.Parse(stored); parseErr == nil {
                deviceIDCache = stored
                return
            }
        }
        newID := uuid.New().String()
        if setErr := keyring.Set(serviceName, deviceIDKey, newID); setErr != nil {
            err = setErr
            return
        }
        deviceIDCache = newID    
    })

    if err != nil {
        return "", err
    }
    return deviceIDCache, nil
}

func (s *KeyringTokenStore) SaveUserProfile(userID int, profile UserProfile) error {
    data, _ := json.Marshal(profile)
    key := fmt.Sprintf("%s%d", userProfileKeyPrefix, userID)
    if err := keyring.Set(serviceName, key, string(data)); err != nil {
        log.Printf("Keyring Set Error (user profile): %v\n", err)
        return err
    }
    return nil
}

func (s *KeyringTokenStore) LoadUserProfile(userID int) (*UserProfile, error) {
    key := fmt.Sprintf("%s%d", userProfileKeyPrefix, userID)
    data, err := keyring.Get(serviceName, key)
    if err != nil {
        if errors.Is(err, keyring.ErrNotFound) {
            return nil, nil
        }
        return nil, err
    }

    var profile UserProfile
    if err := json.Unmarshal([]byte(data), &profile); err != nil {
        return nil, err
    }
    return &profile, nil
}