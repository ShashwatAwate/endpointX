// Package engine
package engine

import (
	"fmt"
	"os/exec"
	"path/filepath"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/utils"
)

func RunTests(w *models.Workspace) (*models.Result, error) {
	cmd := exec.Command("npm", "run", "test")
	cmd.Dir = w.Path

	output, err := cmd.CombinedOutput()
	outputPath := filepath.Join(w.Path, "output.json")

	result := &models.Result{
		UserID:             w.Spec.UserID,
		QuestionID:         w.Spec.QuestionID,
		IsProblemGenerated: w.Spec.IsProblemGenerated,
		RawOutput:          string(output),
		AppFiles:           w.Spec.AppFiles,
		Status:             models.TestPassed,
		ExitCode:           0,
		Jest:               nil,
	}

	if err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			result.Status = models.TestFailed
			result.ExitCode = exitErr.ExitCode()
		} else {
			return nil, err
		}
	}

	jest, err := utils.UnmarshalFromFile[models.JestOutput](outputPath)
	if err != nil {
		fmt.Println("could not parse json: ", err)
		return nil, err
	}

	result.Jest = &jest

	return result, nil
}
