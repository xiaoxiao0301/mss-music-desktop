package backend

import "fmt"

const (
	apiBasePath = "/api"

	recommendBannersPath = "/recommend/banners"
	recommendDailyPaht 	= "/recommend/daily"
	recommendNewSongPath = "/recommend/newsong"
	recommendNewAlbumPath = "/recommend/newalbum"
	recommendPlaylistOfficialPath = "/recommend/official/playlist" 

	authPath    = "/auth/request-otp"
	authVerifyPath  = "/auth/verify-otp"
	authRefreshPath = "/auth/refresh"
	authMePath = "/user/me"	

	rankingListPath = "/ranking/list"
	rankingDetailPath = "/ranking/detail"

	artistTypesPath = "/artist/types"
	artistFiltersPath = "/artist/list"
	artistDetailPath = "/artist/detail"

	systemPlaylistCategoriesPath = "/playlist/types"
	systemPlaylistCategoriesListPath = "/playlist/category/list"
	systemPlaylistCategoriesListDetailPath = "/playlist/category/detail"

	radioCategoriesPath = "/radio/categories"
	radioCategoryListPath = "/radio/detail"

	mvCategoriesPath = "/mv/categories"
	mvCategoriesListPath = "/mv/categories/list"
	mvDetailPath = "/mv/detail"

	albumDetailPath = "/album/detail"
	albumSongListsPath = "/album/songs"

	songDetailPath = "/song/detail"
	songPlayPath  = "/song/play"
	songLyricsPath = "/song/lyrics"
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

func GetRankingListPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, rankingListPath)
}

func GetRankingDetailPath(topID, page uint) string {
	return fmt.Sprintf("%s%s?top_id=%d&page=%d&period=%s", apiBasePath, rankingDetailPath, topID, page)
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

func GetSystemPlaylistCategoriesPath() string {
	return fmt.Sprintf("%s%s", apiBasePath, systemPlaylistCategoriesPath)
}

func GetSystemPlaylistCategoriesListPath(categoryId, page uint) string {
	return fmt.Sprintf("%s%s?category_id=%d&page=%d", apiBasePath, systemPlaylistCategoriesListPath, categoryId, page)
}

func GetSystemPlaylistCategoriesListDetailPath(disstid string) string {
	return fmt.Sprintf("%s%s?disstid=%s", apiBasePath, systemPlaylistCategoriesListDetailPath, disstid)
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