//go:build windows

package backend

import (
	"fmt"
	"os/exec"
)

func setSystemVolume(level int) error {
	command := fmt.Sprintf(`$vol = [int]$args[0]; $device = (New-Object -ComObject MMDeviceEnumerator).GetDefaultAudioEndpoint(0,1); $volume = $device.AudioEndpointVolume; $volume.MasterVolumeLevelScalar = $vol / 100`, level)
	cmd := exec.Command("powershell", "-NoProfile", "-Command", command)
	return cmd.Run()
}
