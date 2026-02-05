package main

import (
	"os/exec"
	"runtime"

	"github.com/ShashwatAwate/endpointX/verificationEngine/models"
)

func RunTests(w *models.Workspace) (string, error) {
	var shell string
	if runtime.GOOS == "windows" {
		shell = "cmd"
	} else {
		shell = "bash"
	}

	cmd := exec.Command(shell, "-c", "npm run test")
	cmd.Dir = w.Path

	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", err
	}

	return string(output), nil
}
