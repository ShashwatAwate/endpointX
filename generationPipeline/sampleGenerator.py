import os
from dotenv import load_dotenv
import json
import pprint
from .utils import res_to_json,write_to_json,call_model
load_dotenv()


def createSampleCode(contract: json = None):
    """Create a sample code for the given problem statement"""
    try:
        if not contract:
            with open("./data/contract.json", "r") as f:
                contract = json.load(f)
            
        prompt = f"""
Generate a sample Express implementation for the following API contract.

Rules:
- Follow the contract EXACTLY (paths, methods, query params, request body, response body, status codes)
- Implement ONLY the endpoints in the contract (do NOT add extra endpoints)
- Handle ALL error cases mentioned in the contract
- Do NOT reference tests or testing tools
- Use ONLY JavaScript (CommonJS)
- Use ONLY Express (no other libraries)
- Keep the code simple and readable
- Store data in-memory (arrays/objects) unless the contract requires persistence
- Return JSON responses using res.status(...).json(...)
- Return error responses using the exact status codes and error formats defined in the contract
- Put everything in a single file named `app.js`
- Export the Express app using: module.exports = app
- Do NOT call app.listen()

Implementation requirements:
- Start the file with:
  const express = require('express');
  const app = express();
  app.use(express.json());

---CONTRACT---
{contract}
---CONTRACT END---

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