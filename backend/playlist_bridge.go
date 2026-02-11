package backend

type PlaylistBridge struct {
	api *APIClient
}

func NewPlaylistBridge(api *APIClient) *PlaylistBridge {
	return &PlaylistBridge{api: api}
}

func (p *PlaylistBridge) GetPlaylistTypes() (string, error) {
	resp, err := p.api.Get(GetSystemPlaylistCategoriesPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) GetPlaylistCategoriesList(categoryId, page uint) (string, error) {
	resp, err := p.api.Get(GetSystemPlaylistCategoriesListPath(categoryId, page))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) GetPlaylistCategoriesListDetail(disstid string) (string, error) {
	resp, err := p.api.Get(GetSystemPlaylistCategoriesListDetailPath(disstid))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) GetUserPlaylists() (string, error) {
	resp, err := p.api.Get(GetUserPlaylistsPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) CreateUserPlaylist(name, description, coverURL string) (string, error) {
	payload := map[string]any{
		"name":        name,
		"description": description,
		"cover_url":   coverURL,
	}
	resp, err := p.api.PostAuth(GetUserPlaylistsPath(), payload)
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) UpdateUserPlaylist(playlistID uint, payload map[string]any) (string, error) {
	resp, err := p.api.PatchAuth(GetUserPlaylistDetailPath(playlistID), payload)
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) DeleteUserPlaylist(playlistID uint) error {
	_, err := p.api.Delete(GetUserPlaylistDetailPath(playlistID), nil)
	return err
}

func (p *PlaylistBridge) GetUserPlaylistDetail(playlistID uint) (string, error) {
	resp, err := p.api.Get(GetUserPlaylistDetailPath(playlistID))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) AddSongToUserPlaylist(playlistID uint, payload map[string]any) (string, error) {
	resp, err := p.api.PostAuth(GetUserPlaylistSongPath(playlistID), payload)
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) RemoveSongFromUserPlaylist(playlistID uint, songMid string) (string, error) {
	payload := map[string]any{"song_mid": songMid}
	resp, err := p.api.Delete(GetUserPlaylistSongPath(playlistID), payload)
	if err != nil {
		return "", err
	}
	return string(resp), nil
}