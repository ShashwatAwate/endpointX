import re
import json
import os
from dotenv import load_dotenv
from google import genai
from enum import Enum

class UseCase(str, Enum):
    PROBLEM = "problem"
    TEST_PLAN = "testPlan"
    UNIT_TEST = "unitTest"
    SAMPLE_CODE = "sampleCode"

load_dotenv()

def res_to_json(res_content: str):
    try:
        pattern = r"```json(.*?)```"
        matches = re.findall(pattern, res_content, re.DOTALL)
        if matches:
            json_str = matches[0].strip()
        else:
            # fallback: assume whole response is JSON
            json_str = res_content.strip()

        json_content = json.loads(json_str) 
        return json_content
    except Exception as e:
        print(f"json parse error: {str(e)}")
        raise

def dict_to_json(content: dict):
    try:
        json_obj = json.dumps(content,indent=4)
        return json_obj
    except Exception as e:
        print(f"dict to json conversion error: {str(e)}")
        raise

def write_to_json(content:dict, path:str):
    try:
        with open(path,"w",encoding="utf-8") as f:
            json.dump(content,f,indent=2,ensure_ascii=False)
        print(f"INFO: Written to json successfully {path}")
    except Exception as e:
        print("Wrting to json file failed")
        raise

def call_model(prompt:str,useCase:UseCase):
    try:
        useCaseMapping = {
        UseCase.PROBLEM: "PROBLEM_GEN_API_KEY",
        UseCase.TEST_PLAN: "TEST_PLAN_GEN_API_KEY",
        UseCase.UNIT_TEST: "UNIT_TEST_GEN_API_KEY",
        UseCase.SAMPLE_CODE: "SAMPLE_CODE_GEN_API_KEY"
        }
        keyStr = useCaseMapping.get(useCase)
        model = os.getenv("MODEL_NAME")
        client = genai.Client(api_key=os.getenv(keyStr))
        response = client.models.generate_content(
            model = model,
            contents = prompt
        )
        return response

    except Exception as e:
        print(f"ERROR: during model generation: {str(e)}")
        raise