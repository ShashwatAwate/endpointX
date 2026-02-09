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
load_dotenv()


def publishToQueue(sampleCode: json = None, unitTests: json = None,problemDesc: json = None):
    """Recieves testcode and sample code, adds two imports and correct paths, and uploads final json to queue"""
    try:
        BASE_DIR = Path(__file__).resolve().parent.parent   # root/
        DATA_DIR = BASE_DIR / "data"

        if not sampleCode:
            with open(DATA_DIR / "sampleCode.json", "r", encoding="utf-8") as f:
                sampleCode = json.load(f)

        if not unitTests:
            with open(DATA_DIR / "unitTestSample.json", "r", encoding="utf-8") as f:
                unitTests = json.load(f)

        if not problemDesc:
            with open(DATA_DIR / "problemDescSample.json", "r", encoding="utf-8") as f:
                problemDesc = json.load(f)

        # adding require prefix to the unit Test code
        prefix = 'const request = require("supertest");\nconst app = require("./src/app");\n\n'
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
        connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
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
        # print("INFO: Generating contract")
        # contract = createContract(description)
        # print("INFO: Generating Test Plan")
        # testPlan = createUnitTestPlan(contract)
        # print("INFO:Generating Unit Tests and SampleCode")
        # with ThreadPoolExecutor(max_workers=2) as executor:
        #     fut_tests = executor.submit(createUnitTestCode,testPlan,contract)
        #     fut_sample = executor.submit(createSampleCode,contract)
        #
        #     unitTests = fut_tests.result()
        #     sampleCode = fut_sample.result()
        # print("INFO: Unit Tests")
        # print(unitTests)
        # print("INFO: Sample Code")
        # print(sampleCode)
        publishToQueue(problemDesc=description)
    except Exception as e:
        print(f"ERROR: in main {str(e)}")
