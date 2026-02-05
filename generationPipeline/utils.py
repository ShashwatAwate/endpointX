import re
import json

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