package backend

import (
	"errors"
	"io"
	"net"
	"net/http"
	"net/url"
	"sync"
	"time"
)

var ErrInvalidAudioURL = errors.New("invalid audio url")

type AudioProxy struct {
	once sync.Once
	addr string
	err  error
}

func NewAudioProxy() *AudioProxy {
	return &AudioProxy{}
}

func (p *AudioProxy) ProxyURL(sourceURL string) (string, error) {
	if err := p.start(); err != nil {
		return "", err
	}
	return p.addr + "/audio/proxy?url=" + url.QueryEscape(sourceURL), nil
}

func (p *AudioProxy) handleProxy(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	rawURL := r.URL.Query().Get("url")
	if rawURL == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	parsed, err := url.Parse(rawURL)
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	req, err := http.NewRequestWithContext(r.Context(), r.Method, rawURL, nil)
	if err != nil {
		w.WriteHeader(http.StatusBadGateway)
		return
	}

	if rangeHeader := r.Header.Get("Range"); rangeHeader != "" {
		req.Header.Set("Range", rangeHeader)
	}
	req.Header.Set("User-Agent", "Mozilla/5.0")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		w.WriteHeader(http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Range")
	w.Header().Set("Access-Control-Expose-Headers", "Content-Length, Content-Range")
	for key, values := range resp.Header {
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}

	w.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(w, resp.Body)
}

func (p *AudioProxy) start() error {
	p.once.Do(func() {
		ln, err := net.Listen("tcp", "127.0.0.1:0")
		if err != nil {
			p.err = err
			return
		}

		p.addr = "http://" + ln.Addr().String()
		mux := http.NewServeMux()
		mux.HandleFunc("/audio/proxy", p.handleProxy)
		server := &http.Server{
			Handler:      mux,
			ReadTimeout:  15 * time.Second,
			WriteTimeout: 0,
		}

		go func() {
			_ = server.Serve(ln)
		}()
	})
	return p.err
}
