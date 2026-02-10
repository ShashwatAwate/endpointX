import json
from dotenv import load_dotenv
import os
import pprint
from .utils import res_to_json,write_to_json,call_model
load_dotenv()


def createUnitTestPlan(contract:json = None):
    """Create a unit test plan"""
    try:
        if not contract:
            with open("./data/contract.json", "r") as f:
                contract = json.load(f)
            
        prompt = f"""
Generate a sample test plan for the following API contract.

Rules:
- Follow the contract exactly
- Do NOT reference tests
- Do NOT add endpoints
- FOLLOW the format given in the example, DO NOT COPY, just REFER AS CONTEXT.
- ONLY OUTPUT IN VALID JSON
- COVER ONLY THE ESSENTIAL TEST CASES, HAVE A MAXIMUM OF 6 TESTS.
- ONLY cover errors in API logic, NOT STRICT TESTS.
- DO NOT ADD ANY EMOJIS.
- ONLY add SIMPLE LINENT TESTS, that just confirm API Logic.
- Be LINENT on TYPE CHECKS, do NOT be TOO STRICT.

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
        response = call_model(prompt,useCase="testPlan")
        response_json = res_to_json(response.text)
        return response_json
    except Exception as e: 
        print(f"ERROR: during creating test plan: {str(e)}")
        raise

def createUnitTestCode(test_plan:json,contract:json=None):
    """Create the testing code for the unit tests"""
    try:
        if isinstance(contract, str):
            contract = json.loads(contract)

        if isinstance(test_plan, str):
            test_plan = json.loads(test_plan)

        if not contract:
                with open("./data/contract.json", "r") as f:
                    contract = json.load(f)
        prompt=f"""
Generate ONLY unit tests  AND Sample code that passes on these tests for the following API contract.

Test Generation Rules:
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
- Assume app and request already exist in the test runtime
- Follow the contract EXACTLY
- Follow the test plan EXACTLY
- DO NOT ADD COMMENTS IN YOUR CODE
- DO NOT ADD ANY EMOJIS

Sample Code Generation Rules:
- Follow the contract EXACTLY
- Generate sample so that ALL UNIT TESTS PASS
- Implement ONLY the endpoints in the contract
- Handle ALL error cases explicitly
- Do NOT reference tests or testing tools
- Use ONLY JavaScript (CommonJS)
- Use ONLY Express (no other libraries)
- Keep the code simple and readable
- Store data in-memory unless persistence is required
- Return JSON responses using res.status(...).json(...)
- Use exact status codes and error formats from the contract
- Put everything in a single file named app.js
- Export the Express app using: module.exports = app
- Do NOT call app.listen()
- Implementation requirements:
  Start the file with:
const express = require('express');
const app = express();
app.use(express.json());

---CONTRACT---
{contract}
---CONTRACT END---

---TEST PLAN---
{test_plan}
---TEST PLAN END---

Return output STRICTLY in this JSON format and NOTHING ELSE:
```json
{{
  "unit_tests":{{
  "language": "javascript",
  "test_framework": "jest",
  "http_client": "supertest",
  "files": [
    {{
      "path": "items.test.js",
      "content": "<code>"
    }}
  ]
  }},
  "sample_code":{{
  "language": "javascript",
  "framework": "express",
  "files": [
    {{
      "path": "app.js",
      "content": "<code>"
    }}
  ]
  }}

}}
```
"""
        response = call_model(prompt,useCase="unitTest")
        response_json = res_to_json(response.text)
        id = contract.get('question_id')
        response_json['question_id'] = id
        path = "./data/unitTestSample.json"
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
