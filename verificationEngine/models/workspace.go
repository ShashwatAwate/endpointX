package models

import (
	"fmt"
	"os"
	"os/exec"
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
		_ = os.RemoveAll(dir)
		return nil, err
	}

	// write test files
	if err := writeFiles(spec.TestFiles, dir); err != nil {
		_ = os.RemoveAll(dir)
		return nil, err
	}

	packageJSON, err := os.ReadFile("package.json")
	if err != nil {
		fmt.Println("ugga")
		_ = os.RemoveAll(dir)
		return nil, err
	}

	if err := os.WriteFile(filepath.Join(dir, "package.json"), packageJSON, 0o644); err != nil {
		fmt.Println("bugga")
		_ = os.RemoveAll(dir)
		return nil, err
	}

	cmd := exec.Command("bash", "-c", "npm i")
	cmd.Dir = dir

	_, err = cmd.CombinedOutput()
	if err != nil {
		_ = os.RemoveAll(dir)
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
