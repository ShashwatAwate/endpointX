package main

import (
	"fmt"
	"log"
)

type File struct {
	Path    string `json:"path"`
	Content string `json:"content"`
}

type Spec struct {
	Language      string `json:"language"`
	Runtime       string `json:"runtime"`
	Framework     string `json:"framework"`
	TestFramework string `json:"test_framework"`
	HTTPClient    string `json:"http_client"`
	Entry         string `json:"entry"`
	AppFiles      []File `json:"app_files"`
	TestFiles     []File `json:"test_files"`
}

func main() {
	spec, err := UnmarshalFromFile[Spec]("./sample.json")
	if err != nil {
		log.Fatalln("error parsing json: ", err)
	}

	fmt.Println(spec)
}
