package backend

type SongBridge struct {
	apiClient *APIClient
}

func NewSongBridge(apiClient *APIClient) *SongBridge {
	return &SongBridge{
		apiClient: apiClient,
	}
}

func (s *SongBridge) GetSongDetail(songId string) (string, error) {
	resp, err := s.apiClient.Get(GetSongDetailPath(songId))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (s *SongBridge) GetSongPlayURL(songId string) (string, error) {
	resp, err := s.apiClient.Get(GetSongPlayPath(songId))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}	