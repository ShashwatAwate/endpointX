package main

import (
	"fmt"
	"time"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/app"
)

func main() {
	start := time.Now()

	w := app.NewWorkerPool(5, 100)
	results := w.Start()

	for res := range results {
		fmt.Println(res.Status)
	}
	fmt.Println("\nDone in: ", time.Since(start))
}
