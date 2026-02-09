package queue

import "github.com/streadway/amqp"

func Produce(
	ch *amqp.Channel,
	queueName string,
	exchangeName string,
	body []byte,
) error {
	if err := ch.ExchangeDeclare(
		exchangeName,
		"direct",
		true,
		false,
		false,
		false,
		nil,
	); err != nil {
		return err
	}

	q, err := ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	if err := ch.QueueBind(
		q.Name,
		queueName,
		exchangeName,
		false,
		nil,
	); err != nil {
		return err
	}

	err = ch.Publish(
		"", // default exchange
		queueName,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	if err != nil {
		return err
	}

	return nil
}
