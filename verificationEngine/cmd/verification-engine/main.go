package main

import (
	"log"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/app"
)

func main() {
	if err := app.Verify(); err != nil {
		log.Fatalln(err)
	}
}
