package backend

const (
	apiBasePath = "/api"

	authPath    = "/auth/request-otp"
	aerifyPath  = "/auth/verify-otp"
	authRefreshPath = "/auth/refresh"

	rankingListPath = "/ranking/list"
)

func GetRequestOTPPath() string {
	return apiBasePath + authPath
}

func GetVerifyOTPPath() string {
	return apiBasePath + aerifyPath
}

func GetAuthRefreshPath() string {
	return apiBasePath + authRefreshPath
}

func GetRankingListPath() string {
	return apiBasePath + rankingListPath
}
