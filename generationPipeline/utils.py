import re
import json
import os
from dotenv import load_dotenv
from google import genai
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

def call_model(prompt:str,useCase:str):
    try:
        useCaseMapping = {
            "problem":"PROBLEM_GEN_API_KEY",
            "testPlan": "TEST_PLAN_GEN_API_KEY",
            "unitTest": "UNIT_TEST_GEN_API_KEY",
            "sampleCode": "SAMPLE_CODE_GEN_API_KEY"
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