package backend

type AlbumBridge struct {
	apiClient *APIClient
}

func NewAlbumBridge(apiClient *APIClient) *AlbumBridge {
	return &AlbumBridge{
		apiClient: apiClient,
	}
}

func (a *AlbumBridge) GetAlbumDetail(albumId string) (string, error) {
	resp, err := a.apiClient.Get(GetAlbumDetailPath(albumId))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (a *AlbumBridge) GetAlbumSongLists(albumId string) (string, error) {
	resp, err := a.apiClient.Get(GetAlbumSongListsPath(albumId))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (a *AlbumBridge) GetAlbumDetailAndSongLists(albumId string) (string, error) {
	resp, err := a.apiClient.Get(GetAlbumDetailAndSongListsPath(albumId))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}