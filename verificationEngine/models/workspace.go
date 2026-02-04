package models

import (
	"os"
	"path/filepath"
)

type Workspace struct {
	Path string
}

// NewWorkspace - creates directory, writes the app files and the test files
// and returns the new workspace
func NewWorkspace(spec *Spec) (*Workspace, error) {
	dir, err := os.MkdirTemp("", "verify-"+spec.ID)
	if err != nil {
		return nil, err
	}

	// write app files
	if err := writeFiles(spec.AppFiles, dir); err != nil {
		return nil, err
	}

	if err := writeFiles(spec.TestFiles, dir); err != nil {
		return nil, err
	}

	return &Workspace{Path: dir}, nil
}

// Clean - cleanup function
func (w *Workspace) Clean() {
	_ = os.RemoveAll(w.Path)
}

func writeFiles(files []File, dir string) error {
	for _, file := range files {

		full := filepath.Join(dir, file.Path)

		if err := os.MkdirAll(filepath.Dir(full), 0o755); err != nil {
			return err
		}
		if err := os.WriteFile(full, []byte(file.Content), 0o644); err != nil {
			return err
		}
	}

	return nil
}
