package engine

import (
	"fmt"
	"sync"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func Worker(jobs <-chan string, result chan<- *models.Result, wg *sync.WaitGroup) {
	defer wg.Done()

	for s := range jobs {
		res, err := work(s)
		if err != nil {
			fmt.Println("error doing job: ", err)
			continue
		}

		result <- res
	}
}
