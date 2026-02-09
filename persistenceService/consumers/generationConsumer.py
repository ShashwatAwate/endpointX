import pika
from ..persistence.questionPersistence import createQuestion
from ..persistence.unitTestPersistence import createUnitTest
from sqlalchemy.orm import sessionmaker
from ..db import engine
from dotenv import load_dotenv
import os
import json

load_dotenv()

def main():
    try:
        connectionUrl = os.getenv("RABBITMQ_CONNECTION")
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=connectionUrl))
        channel = connection.channel()

        queueName = os.getenv("PROBLEM_GEN_QUEUE_NAME")
        exchangeName = os.getenv("EXCHANGE")
        channel.exchange_declare(exchange=exchangeName, exchange_type="direct", durable=True)
        channel.queue_declare(queue=queueName, durable=True)
        channel.queue_bind(exchange=exchangeName,queue=queueName,routing_key=queueName)
        

        def callback(ch,method,properties,body):
            data = json.loads(body.decode("utf-8"))
            problemDesc = data.get("problem_description")
            unitTests = data.get("unit_tests")
            Session = sessionmaker(bind=engine)
            with Session() as session:
                # 1) Create question first
                ques = createQuestion(payload=problemDesc,session=session)

                # 2) Inject question_id into unit test payload
                unitTests["question_id"] = str(ques.id)

                # 3) Create unit test now
                ut = createUnitTest(payload=unitTests,session=session)

                session.commit()

                print(f"INFO: Pushed question: {ques.id}")
                print(f"INFO: Pushed Unit Test : {ut.id}")

                session.close()
            ch.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_consume(queue=queueName,on_message_callback=callback)
        channel.start_consuming()
    except Exception as e:
        print(f"ERROR: Consuming from problem description queue failed: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"ERROR: generation consumer failed: {str(e)}")