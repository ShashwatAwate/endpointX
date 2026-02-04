package main

import (
	"fmt"
	"log"

	"github.com/ShashwatAwate/endpointX/verificationEngine/models"
)

func main() {
	spec, err := models.NewSpec("./sample.json")
	if err != nil {
		log.Fatalln("error making spec: ", err)
	}
	fmt.Println(spec)

	w, err := models.NewWorkspace(spec)
	if err != nil {
		log.Fatalln("error making workspace: ", err)
	}
	defer w.Clean()
	fmt.Println(w.Path)
}
