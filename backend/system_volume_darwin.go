//go:build darwin

package backend

import (
	"fmt"
	"os/exec"
)

func setSystemVolume(level int) error {
	cmd := exec.Command("osascript", "-e", fmt.Sprintf("set volume output volume %d", level))
	return cmd.Run()
}
