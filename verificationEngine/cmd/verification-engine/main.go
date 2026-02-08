package main

import (
	"fmt"
	"log"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/app"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/queue"
	"github.com/streadway/amqp"
)

func main() {
	w := app.NewWorkerPool(15, 100)
	q, err := queue.New("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalln("error creating queue: ", err)
	}

	results := w.Start()

	err = queue.Consume(
		q.Ch,
		"VERIFICATION_Q",
		func(msg amqp.Delivery) error {
			w.Jobs() <- msg.Body
			return nil
		},
	)
	if err != nil {
		log.Fatalln("error creating queue: ", err)
	}
	passedCnt := 0

	for res := range results {
		if res.Status == "passed" {
			passedCnt += 1
			fmt.Println(passedCnt)
		}
	}
}
