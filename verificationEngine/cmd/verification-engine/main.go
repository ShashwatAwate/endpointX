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
	if err := w.Init(); err != nil {
		log.Fatalln("error initializing the workspace: ", err)
	}
	defer w.Clean()

	result, err := engine.RunTests(w)
	if err != nil {
		// gg ho gaya
		log.Fatalln("engine error: ", err)
	}

	if result.Status == models.TestPassed {
		fmt.Print("TEST PASSED!!!\n\n")
	} else {
		fmt.Print("test failed :(\n\n")
	}

	fmt.Println(result.Output)
}
