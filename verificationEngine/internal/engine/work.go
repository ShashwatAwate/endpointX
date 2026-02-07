package engine

import (
	"fmt"
	"time"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func work(jsonPath string) (*models.Result, error) {
	start := time.Now()
	defer func() {
		fmt.Println(jsonPath, "took ", time.Since(start))
	}()

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

	result, err := RunTests(w)
	if err != nil {
		// gg ho gaya
		return nil, fmt.Errorf("engine error: %w", err)
	}

	return result, nil
}
