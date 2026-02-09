package backend

type RecommendBridge struct {
	apiClinet *APIClient
}

func NewRecommendBridge(apiClient *APIClient) *RecommendBridge {
	return &RecommendBridge{
		apiClinet: apiClient,
	}
}

func (rb *RecommendBridge) GetRecommendBanners() (string, error) {
	resp, err := rb.apiClinet.Get(GetRecommendBannersPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (rb *RecommendBridge) GetDailyRecommendations() (string, error) {
	resp, err := rb.apiClinet.Get(GetRecommendDailyPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (rb *RecommendBridge) GetNewSongRecommendations() (string, error) {
	resp, err := rb.apiClinet.Get(GetRecommendNewSongPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (rb *RecommendBridge) GetNewAlbumRecommendations() (string, error) {
	resp, err := rb.apiClinet.Get(GetRecommendNewAlbumPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (rb *RecommendBridge) GetOfficialPlaylistRecommendations() (string, error) {
	resp, err := rb.apiClinet.Get(GetRecommendPlaylistOfficialPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (rb *RecommendBridge) GetAllRecommendations() (string, error) {
	resp, err := rb.apiClinet.Get(GetRecommendAllPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}