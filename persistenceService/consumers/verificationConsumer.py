import pika
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import json
from ..db import engine
from ..persistence.questionPersistence import deleteQuestion
from ..persistence.answerPersistence import createAnswer

load_dotenv()

def consumeVerification():
    """Consumes from verification queue and does processing"""

    try:
        connection = pika.BlockingConnection(pika.URLParameters(os.getenv("RABBITMQ_CONNECTION")))
        channel = connection.channel()

        queueName = os.getenv("RES_QUEUE")
        exchangeName = os.getenv("RES_EXCHANGE")
        channel.exchange_declare(exchange=exchangeName,exchange_type='direct',durable=True)
        channel.queue_declare(queue=queueName,durable=True)
        channel.queue_bind(exchange=exchangeName,queue=queueName,routing_key=queueName)

        def callback(ch,method,properties,body):
            data = json.loads(body.decode("utf-8"))
            resultStatus :str = data.get("status")
            resultStatus = resultStatus.lower()
            
            if data.get('isProblemGenerated')==1:
                if resultStatus=="failed":
                    Session = sessionmaker(bind=engine)
                    questionId = data.get("question_id")        
                    print(f"INFO: got question_id: {questionId}")

                    with Session() as session:
                        res = deleteQuestion(questionId=questionId,session=session)
                        session.commit()
                        session.close()
                        print(f"INFO: deleted question and unit test for question id: {questionId}")
                else:
                    print(f"INFO: test passed, already in database")

            else:
                Session = sessionmaker(bind=engine)
                with Session() as session:
                    answer = createAnswer(payload=data,session=session)
                    session.commit()
                    print(f"INFO: inserted answer in DB {answer.id}")
                    session.close()
                    
            ch.basic_ack(delivery_tag=method.delivery_tag)
        
        channel.basic_consume(queue=queueName,on_message_callback=callback)
        channel.start_consuming()

    except Exception as e:
        print(f"ERROR: consuming from Verification failed: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        consumeVerification()
    except Exception as e:
        print(f"ERROR: Verification consumption failed {str(e)}")