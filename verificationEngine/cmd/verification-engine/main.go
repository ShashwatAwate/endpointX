package main

import (
	"fmt"
	"time"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/app"
)

func main() {
	start := time.Now()
	results := app.Start()

	for res := range results {
		fmt.Println(res.Status)
	}
	fmt.Println("\nDone in: ", time.Since(start))
}
