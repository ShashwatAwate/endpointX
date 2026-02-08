package queue

import "github.com/streadway/amqp"

func Consume(
	ch *amqp.Channel,
	queueName string,
	handler func(amqp.Delivery) error,
) error {
	_, err := ch.QueueDeclare(
		queueName,
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	msgs, err := ch.Consume(
		queueName,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	go func() {
		for msg := range msgs {
			if err := handler(msg); err != nil {
				continue
			}
			_ = msg.Ack(false)
		}
	}()

	return nil
}
