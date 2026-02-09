package backend

type ArtistBridge struct {
	api *APIClient
}

func NewArtistBridge(api *APIClient) *ArtistBridge {
	return &ArtistBridge{api: api}
}

func (a *ArtistBridge) GetArtistTypes() (string, error) {
	resp, err := a.api.Get(GetArtistTypesPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (a *ArtistBridge) GetArtistListByFilters(page, area, genre, sex, index int) (string, error) {
	resp, err := a.api.Get(GetArtistFiltersPath(page, area, genre, sex, index))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (a *ArtistBridge) GetArtistDetail(artistID string, page uint) (string, error) {
	resp, err := a.api.Get(GetArtistDetailPath(artistID, page))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (a *ArtistBridge) GetArtistAlbums(artistID string, page uint) (string, error) {
	resp, err := a.api.Get(GetArtistAlbumsPath(artistID, page))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (a *ArtistBridge) GetArtistMvs(artistID string, page uint) (string, error) {
	resp, err := a.api.Get(GetArtistMvsPath(artistID, page))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}