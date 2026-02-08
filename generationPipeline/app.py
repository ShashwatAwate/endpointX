from .problemBlueprint import createProblemBlueprint
from .problemDecriptionGenerator import createProblemDescription
from .contractGenerator import createContract
from .testGenerator import createUnitTestCode, createUnitTestPlan
from .sampleGenerator import createSampleCode

import json
import os
import pika
from concurrent.futures import ThreadPoolExecutor


def publishToQueue(sampleCode: json = None, unitTests: json = None):
    """Recieves testcode and sample code, adds two imports and correct paths, and uploads final json to queue"""
    try:
        if not sampleCode:
            with open("./data/sampleCode.json", "r") as f:
                sampleCode = json.load(f)

        if not unitTests:
            with open("./data/unitTestSample.json", "r") as f:
                unitTests = json.load(f)

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
        message["language"] = sampleCode.get("language", unitTests.get("language"))
        message["framework"] = sampleCode.get("framework")
        message["test_framework"] = unitTests.get("test_framework")
        message["http_client"] = unitTests.get("http_client")
        message["entry"] = "src/app.js"
        message["isProblemGeneration"] = 1
        message["app_files"] = []
        message["test_files"] = []

        for file in sampleCode.get("files"):
            app_file = {"path": file.get("path"), "content": file.get("content")}
            message["app_files"].append(app_file)

        for file in unitTests.get("files"):
            test_file = {"path": file.get("path"), "content": file.get("content")}
            message["test_files"].append(test_file)

        connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
        channel = connection.channel()
        body = json.dumps(message).encode("utf-8")
        channel.queue_declare(queue="VERIFICATION_Q")
        channel.basic_publish(exchange="", routing_key="VERIFICATION_Q", body=body)
        print("INFO: Message published")

    except Exception as e:
        print(f"ERROR: Publishing to queue failed {str(e)}")
        raise


if __name__ == "__main__":
    try:
        # print("INFO: Generating blueprint")
        # blueprint = createProblemBlueprint()
        # print("INFO: Generating problem description")
        # description = createProblemDescription(blueprint=blueprint)
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
        for i in range(100):
            publishToQueue()
    except Exception as e:
        print(f"ERROR: in main {str(e)}")
