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

func (s *SongBridge) GetSongLyrics(songId string) (string, error) {
	resp, err := s.apiClient.Get(GetSongLyricsPath(songId))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (s *SongBridge) GetSongDetailAndLyricsAndPlayURL(songId string) (string, error) {
	resp, err := s.apiClient.Get(GetSongDetailAndLyricsAndPlayURLPath(songId))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}