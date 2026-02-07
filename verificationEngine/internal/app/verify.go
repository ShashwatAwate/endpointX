// Package app
package app

import (
	"fmt"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/engine"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func Start() []*models.Result {
	seeds := []string{
		"./seeds/sample_1.json",
		"./seeds/sample_2.json",
		"./seeds/sample_3.json",
		"./seeds/sample_4.json",
		"./seeds/sample_5.json",
	}

	results := []*models.Result{}

	for i, seed := range seeds {
		result, err := Verify(seed)
		fmt.Println("done verifying seed: ", i+1)
		if err != nil {
			fmt.Println("error verifying seed: ", i+1)
			fmt.Println("error: ", err)
		}
		results = append(results, result)
	}

	return results
}

func Verify(jsonPath string) (*models.Result, error) {
	spec, err := models.NewSpec(jsonPath)
	if err != nil {
		return nil, fmt.Errorf("error making spec: %w", err)
	}

	w, err := models.NewWorkspace(spec)
	if err != nil {
		return nil, fmt.Errorf("error making workspace: %w", err)
	}
	if err := w.Init(); err != nil {
		return nil, fmt.Errorf("error initializing the workspace: %w", err)
	}
	defer w.Clean()

	result, err := engine.RunTests(w)
	if err != nil {
		// gg ho gaya
		return nil, fmt.Errorf("engine error: %w", err)
	}

	if result.Status == models.TestPassed {
		fmt.Print("TEST PASSED!!!\n")
	} else {
		fmt.Print("test failed :(\n")
	}

	return result, nil
}
