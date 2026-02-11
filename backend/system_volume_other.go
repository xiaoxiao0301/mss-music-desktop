//go:build !darwin && !linux && !windows

package backend

import "fmt"

func setSystemVolume(level int) error {
	return fmt.Errorf("system volume not supported on this platform")
}
