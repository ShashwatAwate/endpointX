package utils

import (
	"io"
	"os"
	"path/filepath"
)

func CopyDir(src, dst string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}

		// figure out where this file/dir should go
		relativePath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}

		targetPath := filepath.Join(dst, relativePath)

		// if it's a directory, just create it
		if info.IsDir() {
			return os.MkdirAll(targetPath, info.Mode())
		}

		// otherwise, copy the file
		return copyFile(path, targetPath, info.Mode())
	})
}

func copyFile(src, dst string, perm os.FileMode) (err error) {
	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer func() {
		if closeErr := srcFile.Close(); err == nil {
			err = closeErr
		}
	}()

	dstFile, err := os.OpenFile(dst, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, perm)
	if err != nil {
		return err
	}
	defer func() {
		if closeErr := dstFile.Close(); err == nil {
			err = closeErr
		}
	}()

	_, err = io.Copy(dstFile, srcFile)
	return err
}
