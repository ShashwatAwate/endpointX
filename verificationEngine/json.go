package main

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
