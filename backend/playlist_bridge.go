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