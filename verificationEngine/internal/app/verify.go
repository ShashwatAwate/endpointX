// Package app
package app

import (
	"fmt"
	"sync"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/engine"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func Start() <-chan *models.Result {
	seeds := []string{}

	for i := 1; i <= 9; i++ {
		seeds = append(seeds, fmt.Sprintf("./seeds/sample_%d.json", i))
	}

	jobs := make(chan string, 100)
	results := make(chan *models.Result, 100)

	var wg sync.WaitGroup
	workerCount := 5

	wg.Add(workerCount)
	for i := range workerCount {
		go engine.Worker(jobs, results, &wg, i+1)
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
