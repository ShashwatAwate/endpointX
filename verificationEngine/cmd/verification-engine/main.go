package main

import (
	"fmt"
	"time"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/app"
)

func main() {
	start := time.Now()
	results := app.Start()

	fmt.Println("\nDone in: ", time.Since(start))
	fmt.Println("number of results: ", len(results))

	for _, result := range results {
		fmt.Println(result.Status)
	}
}
