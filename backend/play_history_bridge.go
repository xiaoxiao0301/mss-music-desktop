package backend

type PlayHistoryBridge struct {
	api *APIClient
}

func NewPlayHistoryBridge(api *APIClient) *PlayHistoryBridge {
	return &PlayHistoryBridge{api: api}
}

func (b *PlayHistoryBridge) GetPlayHistory(limit, offset int) (string, error) {
	path := GetPlaybackHistoryPath(limit, offset)
	resp, err := b.api.Get(path)
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (b *PlayHistoryBridge) AddPlayHistory(songID string, duration int) (string, error) {
	payload := map[string]any{
		"song_id":  songID,
		"duration": duration,
	}
	resp, err := b.api.PostAuth(GetAddPlaybackHistoryPath(), payload)
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (b *PlayHistoryBridge) ClearPlayHistory() (string, error) {
	resp, err := b.api.DeleteAuth(GetClearPlaybackHistoryPath(), nil)
	if err != nil {
		return "", err
	}
	return string(resp), nil
}
