// Package app
package app

import (
	"fmt"
	"sync"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/engine"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func Start() <-chan *models.Result {
	seeds := []string{
		"./seeds/sample_1.json",
		"./seeds/sample_2.json",
		"./seeds/sample_3.json",
		"./seeds/sample_4.json",
		"./seeds/sample_5.json",
	}

	jobs := make(chan string, 100)
	results := make(chan *models.Result, 100)

	var wg sync.WaitGroup
	workerCount := 5

	wg.Add(workerCount)
	for i := range workerCount {
		fmt.Printf("worker %d working\n", i+1)
		go engine.Worker(jobs, results, &wg)
	}

	go func() {
		for _, seed := range seeds {
			jobs <- seed
		}
		close(jobs)
	}()

	go func() {
		wg.Wait()
		close(results)
	}()

	return results
}
