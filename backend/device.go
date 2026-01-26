package backend

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

func GetDeviceID() (string, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", fmt.Errorf("failed to get config dir: %w", err)
	}

	appDir := filepath.Join(configDir, "mss-music-desktop")
	if err := os.MkdirAll(appDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create app dir: %w", err)
	}

	deviceIDFile := filepath.Join(appDir, "device_id")
	
	if data, err := os.ReadFile(deviceIDFile); err == nil {
		id := string(bytes.TrimSpace(data))
		if id != "" {
			return id, nil
		}
	}

	id := uuid.New().String()
	if err := os.WriteFile(deviceIDFile, []byte(id), 0600); err != nil { // 0600 权限更安全
		return "", fmt.Errorf("failed to save device id: %w", err)
	}

	return id, nil
}
