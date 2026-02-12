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

func (p *PlaylistBridge) GetUserPlaylistsWithSongLists() (string, error) {
	resp, err := p.api.Get(GetUserPlaylistsPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) DeleteUserPlaylist(payload map[string]any) (string, error) {
	resp, err := p.api.DeleteAuth(GetUserPlaylistsPath(), payload)
	return string(resp), err
}


func (p *PlaylistBridge) AddSongToUserPlaylist(payload map[string]any) (string, error) {
	resp, err := p.api.PostAuth(GetUserPlaylistSongPath(), payload)
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (p *PlaylistBridge) RemoveSongFromUserPlaylist(payload map[string]any) (string, error) {
	resp, err := p.api.DeleteAuth(GetUserPlaylistSongPath(), payload)
	if err != nil {
		return "", err
	}
	return string(resp), nil
}