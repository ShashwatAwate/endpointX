from google import genai
import json
from dotenv import load_dotenv
import os
import pprint
from .utils import res_to_json,write_to_json
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
model = os.getenv("GEMINI_MODEL_NAME")



def createUnitTestPlan(contract:json = None):
    """Create a unit test plan"""
    try:
        if not contract:
            with open("/home/shash/mnt/ssd1/projects/sinhagadHack/contract.json", "r") as f:
                contract = json.load(f)
            
        prompt = f"""
Generate a sample implementation plan for the following API contract.

Rules:
- Follow the contract exactly
- Handle all error cases
- Do NOT reference tests
- Do NOT add endpoints
- FOLLOW the format given in the example, DO NOT COPY, just REFER AS CONTEXT.
- ONLY OUTPUT IN VALID JSON

---EXAMPLE---
{{
  "create_user": {{
    "positive": [
      "Returns 201 when a valid email is provided"
    ],
    "negative": [
      "Returns 400 when email is missing",
      "Returns 409 when email already exists"
    ]
  }},
  "get_user": {{
    "positive": [
      "Returns 200 for an existing user ID"
    ],
    "negative": [
      "Returns 404 for a non-existent user ID"
    ]
  }}
}}
---EXAMPLE END---

---CONTRACT START---
{contract}
---CONTRACT END---

FOLLOW THE FOLLOWING OUTPUT FORMAT:
```json
{{
"<endpoint-title>":{{
"positive":[],
"negative":[]
}}
}}
```
"""
        response = client.models.generate_content(
            model = model,
            contents = prompt
        )
        response_json = res_to_json(response.text)
        return response_json
    except Exception as e: 
        print(f"ERROR: during creating test plan: {str(e)}")
        raise

def createUnitTestCode(test_plan:json,contract:json=None):
    """Create the testing code for the unit tests"""
    try:
        if not contract:
            with open("/home/shash/mnt/ssd1/projects/sinhagadHack/contract.json", "r") as f:
                contract = json.load(f)
        prompt=f"""
Generate ONLY unit tests for the following API contract.

Hard Rules:
- DO NOT generate any implementation code (NO app.js, NO server code)
- DO NOT generate any endpoints
- DO NOT generate any helper modules
- Output ONLY a single Jest test file
- Use ONLY JavaScript
- Use ONLY jest
- Use ONLY supertest
- Do NOT include any imports or require statements
- Do NOT reference any directory names or file locations inside the code
- DO NOT generate comments, only code
- KEEP CODE SHORT AND SIMPLE
- Assume `app` and `request` already exist in the test runtime
- Follow the contract exactly
- Follow the test plan exactly
- Handle all error cases in the tests

---CONTRACT---
{contract}
---CONTRACT END---

---TEST PLAN---
{test_plan}
---TEST PLAN END---

Return output STRICTLY in this JSON format:
```json
{{
  "language": "javascript",
  "test_framework": "jest",
  "http_client": "supertest",
  "files": [
    {{
      "path": "items.test.js",
      "content": "<code>"
    }}
  ]
}}

```
"""
        response = client.models.generate_content(
            model = model,
            contents = prompt
        )
        response_json = res_to_json(response.text)
        path = "./unitTestSample.json"
        write_to_json(response_json,path)
        return response_json
    except Exception as e:
        print(f"ERROR: during generating unit test codes: {str(e)}")
        raise
if __name__ == "__main__":
    print("INFO: creating plan")
    res = createUnitTestPlan()
    print("INFO: creating test code")
    unitTests = createUnitTestCode(test_plan=res)
    pprint.pprint(unitTests,indent=4)
