package backend

import (
	"encoding/json"
)

type FavoriteBridge struct {
	apiClient *APIClient
}

func NewFavoriteBridge(apiClient *APIClient) *FavoriteBridge {
	return &FavoriteBridge{
		apiClient: apiClient,
	}
}

type FavoriteRequest struct {
	TargetID   string `json:"target_id"`
	TargetType string `json:"target_type"`
}

// AddFavorite 添加收藏
func (f *FavoriteBridge) AddFavorite(targetID, targetType string) error {
	req := FavoriteRequest{
		TargetID:   targetID,
		TargetType: targetType,
	}
	_, err := f.apiClient.PostWithOptions(GetAddFavoritePath(), req, RequestOptions{WithToken: true})
	return err
}

// RemoveFavorite 取消收藏
func (f *FavoriteBridge) RemoveFavorite(targetID, targetType string) error {
	req := FavoriteRequest{
		TargetID:   targetID,
		TargetType: targetType,
	}
	_, err := f.apiClient.Delete(GetRemoveFavoritePath(), req, RequestOptions{WithToken: true})
	return err
}

// GetFavorites 获取收藏列表
func (f *FavoriteBridge) GetFavorites(targetType string) (string, error) {
	resp, err := f.apiClient.GetWithOptions(GetFavoritesPath(targetType), RequestOptions{WithToken: true})
	if err != nil {
		return "", err
	}
	return string(resp), nil
}

// GetFavoriteSongs 获取收藏的歌曲列表
func (f *FavoriteBridge) GetFavoriteSongs() ([]string, error) {
	resp, err := f.GetFavorites("song")
	if err != nil {
		return nil, err
	}
	
	var result struct {
		Code    int      `json:"code"`
		Message string   `json:"message"`
		Data    []string `json:"data"`
	}
	
	if err := json.Unmarshal([]byte(resp), &result); err != nil {
		return nil, err
	}
	
	return result.Data, nil
}

// GetFavoriteAlbums 获取收藏的专辑列表
func (f *FavoriteBridge) GetFavoriteAlbums() ([]string, error) {
	resp, err := f.GetFavorites("album")
	if err != nil {
		return nil, err
	}
	
	var result struct {
		Code    int      `json:"code"`
		Message string   `json:"message"`
		Data    []string `json:"data"`
	}
	
	if err := json.Unmarshal([]byte(resp), &result); err != nil {
		return nil, err
	}
	
	return result.Data, nil
}

// GetFavoritePlaylists 获取收藏的歌单列表
func (f *FavoriteBridge) GetFavoritePlaylists() ([]string, error) {
	resp, err := f.GetFavorites("playlist")
	if err != nil {
		return nil, err
	}
	
	var result struct {
		Code    int      `json:"code"`
		Message string   `json:"message"`
		Data    []string `json:"data"`
	}
	
	if err := json.Unmarshal([]byte(resp), &result); err != nil {
		return nil, err
	}
	
	return result.Data, nil
}

// GetFavoriteArtists 获取收藏的歌手列表
func (f *FavoriteBridge) GetFavoriteArtists() ([]string, error) {
	resp, err := f.GetFavorites("singer")
	if err != nil {
		return nil, err
	}
	
	var result struct {
		Code    int      `json:"code"`
		Message string   `json:"message"`
		Data    []string `json:"data"`
	}
	
	if err := json.Unmarshal([]byte(resp), &result); err != nil {
		return nil, err
	}
	
	return result.Data, nil
}
