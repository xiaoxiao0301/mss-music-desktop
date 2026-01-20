package main

import (
	"context"
	"embed"
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
		panic("Failed to load config: " + err.Error())
	}
	authBridge := backend.NewAuthBridge(cfg)

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
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
