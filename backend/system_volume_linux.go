//go:build linux

package backend

import (
	"fmt"
	"os/exec"
)

func setSystemVolume(level int) error {
	if _, err := exec.LookPath("pactl"); err == nil {
		cmd := exec.Command("pactl", "set-sink-volume", "@DEFAULT_SINK@", fmt.Sprintf("%d%%", level))
		return cmd.Run()
	}
	if _, err := exec.LookPath("amixer"); err == nil {
		cmd := exec.Command("amixer", "-D", "pulse", "sset", "Master", fmt.Sprintf("%d%%", level))
		return cmd.Run()
	}
	return fmt.Errorf("no supported volume control tool found")
}
