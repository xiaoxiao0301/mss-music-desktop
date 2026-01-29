package backend

import "log"

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

func (r *RankingBridge) GetRankingDetail(topID, page uint) (string, error) {
	log.Println(23, GetRankingDetailPath(topID, page))
	resp, err := r.api.Get(GetRankingDetailPath(topID, page))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}