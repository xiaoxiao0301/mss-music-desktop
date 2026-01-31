package backend

type RadioBridge struct {
	api *APIClient
}


func NewRadioBridge(api *APIClient) *RadioBridge {
	return &RadioBridge{
		api: api,
	}
}


func (rb *RadioBridge) GetRadioCategories() (string, error) {
	resp, err := rb.api.Get(GetRadioCategoriesPath())
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

func (rb *RadioBridge) GetRadioCategorySongList(categoryId uint) (string, error) {
	resp, err := rb.api.Get(GetRadioCategorySongListPath(categoryId))
	if err != nil {
		return "", err
	}
	return string(resp), nil
}