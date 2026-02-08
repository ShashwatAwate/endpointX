import pprint
from dotenv import load_dotenv
from .utils import res_to_json,call_model
import uuid
load_dotenv()



def createProblemDescription(blueprint):
    """Creates a problem description"""
    try:
        #pprint.pprint(f"INFO:{blueprint}",indent=4)

        prompt = f"""You are designing a backend API coding challenge.
Your task:
- Define a complete, unambiguous problem statement
- Explicitly list the endpoints the user must implement
- Describe expected behavior and error cases
- Do NOT include implementation hints
- Do NOT include code
- Do NOT include test details
- Do NOT make overview or behaviour text too long, keep it maximum 40 words for overview and 20 words for behaviour.
- ONLY follow the given blueprint to generate questions appropriately.
- Problem must be solvable by REST APIs
- MAKE SURE that path and methods ARE NOT IDENTICAL for more than one endpoint
- KEEP invariants short
- FOLLOW the format in the example for each endpoint, DO NOT COPY THE EXAMPLE, ONLY REFER AS CONTEXT
---BLUEPRINT START---
{blueprint}
---BLUEPRINT END---

---ENDPOINT EXAMPLE---
 {{
      "title": "create_user",
      "overview":"Creates a new user account",
      "method": "POST",
      "path": "/users",
      "request": {{
        "email": {{ "type": "string", "required": true }}
      }},
      "responses": {{
        "201": "User created",
        "400": "Invalid request",
        "409": "Email already exists"
      }},
      "invariants": [
        "Email must be unique"
      ]
 }}
 ---ENDPOINT EXAMPLE END---

Output JSON with the following structure:
```json
{{
"title": "",
"overview": "",
"endpoints":[
{{
"title":"",
"overview":"",
"method":"",
"path": ""
"behaviour": "",
"responses":{{
}},
"invariants":[]
}},
],
"notes":[]
}}
```
"""
        response = call_model(prompt,useCase="problem")
        json_res = res_to_json(response.text)
        json_res["id"] = str(uuid.uuid4())
        return json_res
    except Exception as e:
        print(f"ERROR: During generation of problem description {str(e)}")
        raise

if __name__ == "__main__":
    res = createProblemDescription()
    pprint.pprint(res,indent=4)