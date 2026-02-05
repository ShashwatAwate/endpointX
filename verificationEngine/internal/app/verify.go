// Package app
package app

import (
	"fmt"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/engine"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func Verify() error {
	spec, err := models.NewSpec("./sample.json")
	if err != nil {
		return fmt.Errorf("error making spec: %w", err)
	}

	w, err := models.NewWorkspace(spec)
	if err != nil {
		return fmt.Errorf("error making workspace: %w", err)
	}
	if err := w.Init(); err != nil {
		return fmt.Errorf("error initializing the workspace: %w", err)
	}
	defer w.Clean()

	result, err := engine.RunTests(w)
	if err != nil {
		// gg ho gaya
		return fmt.Errorf("engine error: %w", err)
	}

	if result.Status == models.TestPassed {
		fmt.Print("TEST PASSED!!!\n\n")
	} else {
		fmt.Print("test failed :(\n\n")
	}

	fmt.Println(result.Output)

	return nil
}
