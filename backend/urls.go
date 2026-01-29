package backend

import "fmt"

const (
	apiBasePath = "/api"

	authPath    = "/auth/request-otp"
	authVerifyPath  = "/auth/verify-otp"
	authRefreshPath = "/auth/refresh"
	authMePath = "/user/me"	

	rankingListPath = "/ranking/list"
	rankingDetailPath = "/ranking/detail"

	artistTypesPath = "/artist/types"
	artistFiltersPath = "/artist/list"
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
