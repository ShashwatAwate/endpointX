// Package utils
package utils

import (
	"encoding/json"
	"log"
	"os"
)

func UnmarshalFromFile[T any](path string) (T, error) {
	var t T
	file, err := os.Open(path)
	if err != nil {
		return t, err
	}

	defer func() {
		if err := file.Close(); err != nil {
			log.Fatal("error closing file")
		}
	}()

	err = json.NewDecoder(file).Decode(&t)
	return t, err
}

func UnmarshalFromBytes[T any](data []byte) (T, error) {
	var t T
	err := json.Unmarshal(data, &t)
	return t, err
}
