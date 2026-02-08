// Package app
package app

import (
	"sync"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/engine"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

type WorkerPool struct {
	workerCount int
	jobs        chan []byte
	results     chan *models.Result
	wg          sync.WaitGroup
}

func NewWorkerPool(workerCount int, buffSize int) *WorkerPool {
	return &WorkerPool{
		workerCount: workerCount,
		jobs:        make(chan []byte, buffSize),
		results:     make(chan *models.Result, buffSize),
	}
}

func (w *WorkerPool) Start() <-chan *models.Result {
	w.wg.Add(w.workerCount)

	for i := range w.workerCount {
		go engine.Worker(w.jobs, w.results, &w.wg, i+1)
	}

	go func() {
		w.wg.Wait()
		close(w.results)
	}()

	return w.results
}

func (w *WorkerPool) Jobs() chan<- []byte {
	return w.jobs
}

func (w *WorkerPool) Close() {
	close(w.jobs)
}
