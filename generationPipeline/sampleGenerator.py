import os
from dotenv import load_dotenv
import json
import pprint
from .utils import res_to_json,write_to_json,call_model
load_dotenv()


def createSampleCode(tests_plan:json,contract: json ):
    """Create a sample code for the given problem statement"""
    try:
      
            
        prompt = f"""
Generate a sample Express implementation for the following API contract.

Rules:
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

STRICT VALIDATION RULES (MANDATORY):
- Any query or body field described as an integer MUST be validated as a STRICT integer
- Floats (e.g. "1.5", "10.0"), numeric strings with decimals, NaN, null, undefined, zero, and negative values MUST be rejected
- Validation MUST occur BEFORE conversion
- parseInt, parseFloat, or implicit Number coercion WITHOUT validation is NOT allowed
- Use explicit checks (e.g. regex or Number.isInteger after safe parsing)

Implementation requirements:
  Start the file with:
const express = require('express');
const app = express();
app.use(express.json());

---CONTRACT---
{contract}
---CONTRACT END---

---UNIT TESTS PLAN---
{tests_plan}
---UNIT TESTS PLAN END---

Return output STRICTLY in this JSON format:
```json
{{
  "language": "javascript",
  "framework": "express",
  "files": [
    {{
      "path": "app.js",
      "content": "<code>"
    }}
  ]
}}
```
"""
        response = call_model(prompt=prompt,useCase="sampleCode")
        response_json = res_to_json(response.text)
        id = contract.get('question_id')
        response_json['question_id'] = id
        path = "./data/sampleCode.json"
        write_to_json(response_json,path)
        return response_json
    except Exception as e:
        print(f"ERROR: during sample code generation: {str(e)}")
        raise

if __name__ == "__main__":
    print("INFO: Generating sample code")
    res = createSampleCode()
    pprint.pprint(res,indent=4)