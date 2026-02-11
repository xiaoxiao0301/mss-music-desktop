package backend

import "fmt"

type SystemBridge struct {}

func NewSystemBridge() *SystemBridge {
	return &SystemBridge{}
}

func (s *SystemBridge) SetSystemVolume(level int) error {
	if level < 1 || level > 100 {
		return fmt.Errorf("volume out of range: %d", level)
	}
	return setSystemVolume(level)
}
