package backend

type MVBridge struct {
	api *APIClient
}

func NewMVBridge(apiClient *APIClient) *MVBridge {
	return &MVBridge{
		api: apiClient,
	}
}

func (mv *MVBridge) GetMVCategories() (string, error) {
	resp, err := mv.api.Get(GetMVCategoriesPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (mv *MVBridge) GetMVListByCategory(area, version, page uint) (string, error) {
	resp, err := mv.api.Get(GetMVListByCategoryPath(area, version, page))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (mv *MVBridge) GetMVDetail(mvid string) (string, error) {
	resp, err := mv.api.Get(GetMVDetailPath(mvid))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}