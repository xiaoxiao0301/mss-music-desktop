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
	return fmt.Sprintf("%s%s?top_id=%d&page=%d", apiBasePath, rankingDetailPath, topID, page)
}

