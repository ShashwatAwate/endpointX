package engine

import (
	"fmt"
	"sync"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
)

func Worker(jobs <-chan []byte, result chan<- *models.Result, wg *sync.WaitGroup, id int) {
	defer wg.Done()

	for s := range jobs {
		fmt.Printf("worker %d is working", id)

		res, err := work(s)
		if err != nil {
			fmt.Println("error doing job: ", err)
			continue
		}

		result <- res
	}
}
