package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/app"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/models"
	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/queue"
	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalln("error loading dotenv: ", err)
	}

	w := app.NewWorkerPool(15, 100)
	q, err := queue.New(os.Getenv("RABBIT_MQ_URL"))
	if err != nil {
		log.Fatalln("error creating queue: ", err)
	}

	results := w.Start()

	err = queue.Consume(
		q.Ch,
		os.Getenv("VERIFICATION_QUEUE_NAME"),
		os.Getenv("VERIFICATION_EXCHANGE"),
		func(msg amqp.Delivery) error {
			w.Jobs() <- msg.Body
			return nil
		},
	)
	if err != nil {
		log.Fatalln("error creating queue: ", err)
	}

	for res := range results {
		fmt.Println(res.Status)

		if res.Status == models.TestFailed {
			fmt.Println("-----------------------------------------------------")
			log.Println(res.RawOutput)
			fmt.Println("-----------------------------------------------------")
		}

		payload, err := json.Marshal(res)
		if err != nil {
			log.Println("failed to marshal json: ", err)
			continue
		}

		err = queue.Produce(q.Ch, os.Getenv("RES_QUEUE"), os.Getenv("RES_EXCHANGE"), payload)
		if err != nil {
			log.Println("failed to publish results: ", err)
		}
	}
}
