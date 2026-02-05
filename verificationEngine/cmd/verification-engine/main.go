package main

import (
	"fmt"
	"log"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/engine"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func main() {
	spec, err := models.NewSpec("./sample.json")
	if err != nil {
		log.Fatalln("error making spec: ", err)
	}

	w, err := models.NewWorkspace(spec)
	if err != nil {
		log.Fatalln("error making workspace: ", err)
	}
	defer w.Clean()

	output, err := engine.RunTests(w)
	if err != nil {
		log.Fatalln("error making workspace: ", err)
	}

	fmt.Println(output)
}
