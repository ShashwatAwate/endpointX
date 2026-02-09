import pika
from ..persistence.questionPersistence import create_question
from dotenv import load_dotenv
import os

load_dotenv()

def main():
    try:
        connectionUrl = os.getenv("RABBITMQ_CONNECTION")
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=connectionUrl))
        channel = connection.channel()

        queueName = os.getenv("PROBLEM_GENERATION_QUEUE")
        exchangeName = os.getenv("EXCHANGE")
        channel.exchange_declare(exchange=exchangeName, exchange_type="direct", durable=True)
        channel.queue_declare(queue=queueName, durable=True)
        channel.queue_bind(exchange=exchangeName,queue=queueName,routing_key=queueName)

        def callback(ch,method,properties,body):
            create_question(body)
            channel.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_consume(queue=queueName,on_message_callback=callback)
        channel.start_consuming()
    except Exception as e:
        print(f"ERROR: Consuming from problem description queue failed: {str(e)}")
        raise