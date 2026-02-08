// Package app
package app

import (
	"fmt"
	"sync"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/engine"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

type WorkerPool struct {
	workerCount int
	jobs        chan string
	results     chan *models.Result
	wg          sync.WaitGroup
}

func NewWorkerPool(workerCount int, buffSize int) *WorkerPool {
	return &WorkerPool{
		workerCount: workerCount,
		jobs:        make(chan string, buffSize),
		results:     make(chan *models.Result, buffSize),
	}
}

func (w *WorkerPool) Start() <-chan *models.Result {
	seeds := []string{}

	for i := 1; i <= 9; i++ {
		seeds = append(seeds, fmt.Sprintf("./seeds/sample_%d.json", i))
	}
	w.wg.Add(w.workerCount)
	for i := range w.workerCount {
		go engine.Worker(w.jobs, w.results, &w.wg, i+1)
	}

	go func() {
		for _, seed := range seeds {
			w.jobs <- seed
		}
		close(w.jobs)
	}()

	go func() {
		w.wg.Wait()
		close(w.results)
	}()

	return w.results
}
