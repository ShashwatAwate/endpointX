// Package engine
package engine

import (
	"os/exec"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func RunTests(w *models.Workspace) (*models.Result, error) {
	cmd := exec.Command("npm", "run", "test")
	cmd.Dir = w.Path

	output, err := cmd.CombinedOutput()

	result := &models.Result{
		Output:   string(output),
		Status:   models.TestPassed,
		ExitCode: 0,
	}

	if err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			result.Status = models.TestFailed
			result.ExitCode = exitErr.ExitCode()
			return result, nil
		}
		return nil, err
	}

	return result, nil
}
