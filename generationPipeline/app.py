from .problemBlueprintGenerator import createProblemBlueprint
from .problemDecriptionGenerator import createProblemDescription
from .contractGenerator import createContract
from .testGenerator import createUnitTestCode, createUnitTestPlan
from .sampleGenerator import createSampleCode

import json
import os
from pathlib import Path
import pika
from concurrent.futures import ThreadPoolExecutor,as_completed
from dotenv import load_dotenv
import uuid
import re
import time
load_dotenv()


def publishToQueue(sampleCode: json, unitTests: json ,problemDesc: json ):
    """Recieves testcode and sample code, adds two imports and correct paths, and uploads final json to queue"""
    try:
        prefix = 'const request = require("supertest");\nconst app = require("./src/app");\n\n'
        suffix = '\n\n module.exports = app; \n'

        for file in unitTests.get("files"):
            content = file.get("content")
            content = prefix + content
            file["content"] = content
            # NOTE: Also add path prefix
        sampleCodePrefix = "src/"
        for file in sampleCode.get("files"):
            path = file.get("path")
            newPath = os.path.join(sampleCodePrefix, path)
            file["path"] = newPath
            content = file.get('content',"")
            if content== "":
                raise Exception("Sample Code content not found")
            if not re.search(r"module\.exports\s*=\s*app",content):
                app_content = app_content.rstrip() + suffix
                app_file["content"] = app_content

        message = {}
        message['question_id'] = problemDesc.get('id')
        message["language"] = sampleCode.get("language", unitTests.get("language"))
        message["framework"] = sampleCode.get("framework")
        message["test_framework"] = unitTests.get("test_framework")
        message["http_client"] = unitTests.get("http_client")
        message["entry"] = "src/app.js"
        message["is_problem_generation"] = 1
        message["app_files"] = []
        message["test_files"] = []

        for file in sampleCode.get("files"):
            app_file = {"path": file.get("path"), "content": file.get("content")}
            message["app_files"].append(app_file)

        for file in unitTests.get("files"):
            test_file = {"path": file.get("path"), "content": file.get("content")}
            message["test_files"].append(test_file)

        
        generationBody = {}
        generationBody['job_id'] = str(uuid.uuid4())
        generationBody['problem_description'] = problemDesc
        generationBody['unit_tests'] = unitTests

        #RabbitMQ 
        connection = pika.BlockingConnection(pika.URLParameters(os.getenv("RABBITMQ_CONNECTION")))
        exchangeName = os.getenv("EXCHANGE")
        verificationQName = os.getenv("VERIFICATION_QUEUE_NAME")
        problemQName = os.getenv("PROBLEM_GEN_QUEUE_NAME")

        channel = connection.channel()

        verificationBody = json.dumps(message).encode("utf-8")
        generationBody = json.dumps(generationBody).encode("utf-8")

        channel.exchange_declare(exchange=exchangeName,exchange_type="direct",durable=True)

        channel.queue_declare(queue=verificationQName,durable=True)
        channel.queue_declare(queue=problemQName,durable=True)

        channel.basic_publish(exchange=exchangeName, routing_key=verificationQName, body=verificationBody)
        channel.basic_publish(exchange=exchangeName,routing_key=problemQName,body = generationBody)

        print("INFO: Messages published")

    except Exception as e:
        print(f"ERROR: Publishing to queue failed {str(e)}")
        raise

def pipeline(job_id: int):
    """Full generation pipeline"""
    print(f"INFO {job_id}: Generating blueprint")
    blueprint = createProblemBlueprint()
    print(f"INFO {job_id}: Generating problem description")
    description = createProblemDescription(blueprint=blueprint,job_id=job_id)
    print(f"INFO {job_id}: Generating contract")
    contract = createContract(description)
    print(f"INFO {job_id} : Generating Test Plan")
    testPlan = createUnitTestPlan(contract=contract,job_id=job_id)
    print(f"INFO {job_id} :Generating Unit Tests and Sample Code")
    testAndCodeData = createUnitTestCode(test_plan=testPlan,contract=contract,job_id=job_id)
    unitTests = testAndCodeData.get('unit_tests')
    sampleCode = testAndCodeData.get('sample_code')
    publishToQueue(sampleCode=sampleCode,unitTests=unitTests,problemDesc=description)
    print(f"INFO {job_id}: Messages Published")
def runBatch(numQuestions=1,maxWorkers=4):
    """Running a batch of questions"""
    try:
        with ThreadPoolExecutor(max_workers=maxWorkers) as executor:
            futures = []

            for job_id in range(numQuestions):
                futures.append(executor.submit(pipeline,job_id))
            
            for f in as_completed(futures):
                f.result()
    except Exception as e:
        print(f"INFO: running batch failed {str(e)}")
        raise

if __name__ == "__main__":
    try:
       numGenerated = 0 
       while numGenerated <=20:
            print("INFO: Starting batch....")
            runBatch()
            print("INFO: Generation complete, sleeping for 1.30 min")
            time.sleep(90)
            numGenerated += 5
           
    except Exception as e:
        print(f"ERROR: in main {str(e)}")
