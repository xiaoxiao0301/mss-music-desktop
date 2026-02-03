package main

import (
	"context"
	"embed"
	"fmt"
	"log"
	"mss-music-desktop/backend"
	"mss-music-desktop/config"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Println("Failed to load config:", err)
		return
	}
	// use KeyChain instead of file storage
	// deviceId, err := backend.GetDeviceID()
	// if err != nil {
	// 	panic("Failed to get device ID: " + err.Error())
	// }
	
	tokenStore := backend.NewKeyringTokenStore()
	deviceID, err := tokenStore.GetDeviceID()
	if err != nil {
		log.Println("Failed to load deviceID:", err)
		return
	}
	baseURL := fmt.Sprintf("%s:%d", cfg.Server.BaseURL, cfg.Server.BasePort)
	log.Println("Base URL:", baseURL)
	apiClient := backend.NewAPIClient(baseURL, tokenStore, deviceID, "desktop")
	authBridge := backend.NewAuthBridge(apiClient, tokenStore)
	rankingBridge := backend.NewRankingBridge(apiClient)
	artistBridge := backend.NewArtistBridge(apiClient)
	playlistBridge := backend.NewPlaylistBridge(apiClient)
	radioBridge := backend.NewRadioBridge(apiClient)
	mvBridge := backend.NewMVBridge(apiClient)
	recommendBridge := backend.NewRecommendBridge(apiClient)
	albumBridge := backend.NewAlbumBridge(apiClient)
	songBridge := backend.NewSongBridge(apiClient)

	// Create application with options
	err = wails.Run(&options.App{
		Title:     "沐音",
		Width:     1439,
		Height:    860,
		// Frameless: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		OnShutdown: func(ctx context.Context) {
			authBridge.Logout()
		},
		Bind: []interface{}{
			app,
			authBridge,
			rankingBridge,
			artistBridge,
			playlistBridge,
			radioBridge,
			mvBridge,
			recommendBridge,
			albumBridge,
			songBridge,
		},
		Debug: options.Debug{
			OpenInspectorOnStartup: true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
