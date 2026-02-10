from .problemBlueprintGenerator import createProblemBlueprint
from .problemDecriptionGenerator import createProblemDescription
from .contractGenerator import createContract
from .testGenerator import createUnitTestCode, createUnitTestPlan
from .sampleGenerator import createSampleCode

import json
import os
from pathlib import Path
import pika
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import uuid
import re
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


if __name__ == "__main__":
    try:
        print("INFO: Generating blueprint")
        blueprint = createProblemBlueprint()
        print("INFO: Generating problem description")
        description = createProblemDescription(blueprint=blueprint)
        print("INFO: Generating contract")
        contract = createContract(description)
        print("INFO: Generating Test Plan")
        testPlan = createUnitTestPlan(contract)
        print("INFO:Generating Unit Tests and Sample Code")
        testAndCodeData = createUnitTestCode(test_plan=testPlan,contract=contract)
        unitTests = testAndCodeData.get('unit_tests')
        sampleCode = testAndCodeData.get('sample_code')
        publishToQueue(sampleCode=sampleCode,unitTests=unitTests,problemDesc=description)
    except Exception as e:
        print(f"ERROR: in main {str(e)}")
