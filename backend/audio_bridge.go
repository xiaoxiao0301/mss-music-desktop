package backend

import "net/url"

type AudioBridge struct {
	proxy *AudioProxy
}

func NewAudioBridge() *AudioBridge {
	return &AudioBridge{proxy: NewAudioProxy()}
}

func (b *AudioBridge) GetAudioProxyURL(sourceURL string) (string, error) {
	if sourceURL == "" {
		return "", ErrInvalidAudioURL
	}
	parsed, err := url.Parse(sourceURL)
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") {
		return "", ErrInvalidAudioURL
	}
	return b.proxy.ProxyURL(sourceURL)
}
