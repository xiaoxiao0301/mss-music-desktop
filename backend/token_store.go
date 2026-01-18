package backend

import (
	"github.com/zalando/go-keyring"
)

const (
    serviceName = "mss-music-desktop"
    tokenKey    = "auth_token"
    refreshKey  = "refresh_token"
)

type KeyringTokenStore struct{}

func NewKeyringTokenStore() *KeyringTokenStore {
    return &KeyringTokenStore{}
}

func (s *KeyringTokenStore) Save(token, refresh string) error {
    if err := keyring.Set(serviceName, tokenKey, token); err != nil {
        return err
    }
    if err := keyring.Set(serviceName, refreshKey, refresh); err != nil {
        return err
    }
    return nil
}

func (s *KeyringTokenStore) Load() (string, string, error) {
    token, err := keyring.Get(serviceName, tokenKey)
    if err != nil {
        return "", "", err
    }

    refresh, err := keyring.Get(serviceName, refreshKey)
    if err != nil {
        return "", "", err
    }

    return token, refresh, nil
}

func (s *KeyringTokenStore) Clear() error {
    keyring.Delete(serviceName, tokenKey)
    keyring.Delete(serviceName, refreshKey)
    return nil
}
