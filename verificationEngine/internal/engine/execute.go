// Package engine
package engine

import (
	"os/exec"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func RunTests(w *models.Workspace) (string, error) {
	cmd := exec.Command("npm", "run", "test")
	cmd.Dir = w.Path

	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", err
	}

	return string(output), nil
}
