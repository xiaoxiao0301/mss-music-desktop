package backend

type RankingBridge struct {
	api *APIClient
}

func NewRankingBridge(api *APIClient) *RankingBridge {
	return &RankingBridge{api: api}
}


func (r *RankingBridge) GetRankingLists() (string, error) {
	resp, err := r.api.Get(GetRankingListPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}