package backend

import (
	"fmt"
	"net/url"
)

const (
	apiBasePath = "/api"

	recommendBannersPath = "/recommend/banners"
	recommendDailyPaht 	= "/recommend/daily"
	recommendNewSongPath = "/recommend/newsong"
	recommendNewAlbumPath = "/recommend/newalbum"
	recommendPlaylistOfficialPath = "/recommend/official/playlist" 
	recommendAllPath = "/recommend/all"

	authPath    = "/auth/request-otp"
	authVerifyPath  = "/auth/verify-otp"
	authRefreshPath = "/auth/refresh"
	authMePath = "/user/me"
	authLogoutPath = "/user/logout"

	rankingListPath = "/ranking/list"
	rankingDetailPath = "/ranking/detail"

	artistTypesPath = "/artist/types"
	artistFiltersPath = "/artist/list"
	artistDetailPath = "/artist/detail"
	artistAlbumsPath = "/artist/albums"
	artistMvsPath = "/artist/mvs"

	systemPlaylistCategoriesPath = "/playlist/types"
	systemPlaylistCategoriesListPath = "/playlist/category/list"
	systemPlaylistCategoriesListDetailPath = "/playlist/category/detail"

	userPlaylistPath = "/playlist/user/list"
	userPlaylistSongPath = "/playlist/user/song"

	radioCategoriesPath = "/radio/categories"
	radioCategoryListPath = "/radio/detail"

	mvCategoriesPath = "/mv/categories"
	mvCategoriesListPath = "/mv/categories/list"
	mvDetailPath = "/mv/detail"

	albumDetailPath = "/album/detail"
	albumSongListsPath = "/album/songs"
	albumDetailAndSongListsPath = "/album/detail-songs"

	songDetailPath = "/song/detail"
	songPlayPath  = "/song/play"
	songLyricsPath = "/song/lyrics"
	songDetailAndLyricsAndPlayURLPath = "/song/detail-lyrics-playurl"
	playbackHistoryPath = "/recent/history"

	searchPath = "/search"
	searchHotKeyPath = "/search/hotkey"

	favoritePath = "/favorites"
)

func GetRequestOTPPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, authPath)
}

func GetVerifyOTPPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, authVerifyPath)
}

func GetAuthRefreshPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, authRefreshPath)
}

func GetAuthMePath() string {
	return fmt.Sprintf("%s%s", apiBasePath, authMePath)
}

func GetAuthLogoutPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, authLogoutPath)
}

func GetRankingListPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, rankingListPath)
}

func GetRankingDetailPath(topID, page uint) string {
	return fmt.Sprintf("%s%s?top_id=%d&page=%d", apiBasePath, rankingDetailPath, topID, page)
}

func GetArtistTypesPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, artistTypesPath)
}

func GetArtistFiltersPath(page, area, genre, sex, index int) string {
	return fmt.Sprintf("%s%s?area=%d&genre=%d&index=%d&sex=%d&page=%d", apiBasePath, artistFiltersPath, area, genre, index, sex, page)
}

func GetArtistDetailPath(artistID string, page uint) string {
	return fmt.Sprintf("%s%s?artist_id=%s&page=%d", apiBasePath, artistDetailPath, artistID, page)
}

func GetArtistAlbumsPath(artistID string, page uint) string {
	return fmt.Sprintf("%s%s?artist_id=%s&page=%d&size=30", apiBasePath, artistAlbumsPath, artistID, page)
}

func GetArtistMvsPath(artistID string, page uint) string {
	return fmt.Sprintf("%s%s?artist_id=%s&page=%d&size=20", apiBasePath, artistMvsPath, artistID, page)
}

func GetSystemPlaylistCategoriesPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, systemPlaylistCategoriesPath)
}

func GetSystemPlaylistCategoriesListPath(categoryId, page uint) string {
	return fmt.Sprintf("%s%s?category_id=%d&page=%d", apiBasePath, systemPlaylistCategoriesListPath, categoryId, page)
}

func GetSystemPlaylistCategoriesListDetailPath(disstid string) string {
	return fmt.Sprintf("%s%s?disstid=%s", apiBasePath, systemPlaylistCategoriesListDetailPath, disstid)
}

func GetUserPlaylistsPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, userPlaylistPath)
}

func GetUserPlaylistSongPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, userPlaylistSongPath)
}

func GetRadioCategoriesPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, radioCategoriesPath)
}

func GetRadioCategorySongListPath(categoryId uint) string {
	return fmt.Sprintf("%s%s?category_id=%d", apiBasePath, radioCategoryListPath, categoryId)
}

func GetMVCategoriesPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, mvCategoriesPath)
}

func GetMVListByCategoryPath(area, version, page uint) string {
	return fmt.Sprintf("%s%s?area=%d&version=%d&page=%d", apiBasePath, mvCategoriesListPath, area, version, page)
}

func GetMVDetailPath(mvid string) string {
	return fmt.Sprintf("%s%s?mvid=%s", apiBasePath, mvDetailPath, mvid)
}

func GetRecommendBannersPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, recommendBannersPath)
}

func GetRecommendDailyPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, recommendDailyPaht)
}

func GetRecommendNewSongPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, recommendNewSongPath)
}

func GetRecommendNewAlbumPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, recommendNewAlbumPath)
}

func GetRecommendPlaylistOfficialPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, recommendPlaylistOfficialPath)
}

func GetAlbumDetailPath(albumID string) string {
	return fmt.Sprintf("%s%s?album_id=%s", apiBasePath, albumDetailPath, albumID)
}

func GetAlbumSongListsPath(albumID string) string {
	return fmt.Sprintf("%s%s?album_id=%s", apiBasePath, albumSongListsPath, albumID)
}

func GetSongDetailPath(songID string) string {
	return fmt.Sprintf("%s%s?song_id=%s", apiBasePath, songDetailPath, songID)
}

func GetSongPlayPath(songID string) string {
	return fmt.Sprintf("%s%s?song_id=%s", apiBasePath, songPlayPath, songID)
}

func GetSongLyricsPath(songID string) string {
	return fmt.Sprintf("%s%s?song_id=%s", apiBasePath, songLyricsPath, songID)
}

func GetSongDetailAndLyricsAndPlayURLPath(songID string) string {
	return fmt.Sprintf("%s%s?song_id=%s", apiBasePath, songDetailAndLyricsAndPlayURLPath, songID)
}

func GetPlaybackHistoryPath(limit, offset int) string {
	return fmt.Sprintf("%s%s?limit=%d&offset=%d", apiBasePath, playbackHistoryPath, limit, offset)
}

func GetAddPlaybackHistoryPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, playbackHistoryPath)
}

func GetClearPlaybackHistoryPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, playbackHistoryPath)
}

func GetAlbumDetailAndSongListsPath(albumID string) string {
	return fmt.Sprintf("%s%s?album_id=%s", apiBasePath, albumDetailAndSongListsPath, albumID)
}

func GetRecommendAllPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, recommendAllPath)
}

func GetAddFavoritePath() string {
	return fmt.Sprintf("%s%s", apiBasePath, favoritePath)
}

func GetRemoveFavoritePath() string {
	return fmt.Sprintf("%s%s", apiBasePath, favoritePath)
}

func GetFavoritesPath(targetType string) string {
	return fmt.Sprintf("%s%s?target_type=%s", apiBasePath, favoritePath, targetType)
}

func GetSearchPath(keyword string, searchType, page, size int) string {
	escaped := url.QueryEscape(keyword)
	return fmt.Sprintf("%s%s?keyword=%s&type=%d&page=%d&size=%d", apiBasePath, searchPath, escaped, searchType, page, size)
}

func GetSearchHotKeyPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, searchHotKeyPath)
}