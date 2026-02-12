package backend

type SearchBridge struct {
	api *APIClient
}

func NewSearchBridge(apiClient *APIClient) *SearchBridge {
	return &SearchBridge{api: apiClient}
}

func (s *SearchBridge) Search(keyword string, searchType, page, size int) (string, error) {
	resp, err := s.api.Get(GetSearchPath(keyword, searchType, page, size))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (s *SearchBridge) HotKey() (string, error) {
	resp, err := s.api.Get(GetSearchHotKeyPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}
