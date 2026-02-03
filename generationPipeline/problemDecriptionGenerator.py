import os
from google import genai
import pprint
from dotenv import load_dotenv
from .problemBlueprint import createProblemBlueprint
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
model = os.getenv("GEMINI_MODEL_NAME")


def createProblemDescription():
    """Creates a problem description"""
    try:
        blueprint = createProblemBlueprint()
        pprint.pprint(f"INFO:{blueprint}",indent=4)

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
---BLUEPRINT START---
{blueprint}
---BLUEPRINT END---

Output JSON with the following structure:
```json
{{
"title": "",
"overview": "",
"endpoints":[
{{
"method":"",
"path": ""
"behaviour": ""
}},
],
"notes":[
]
}}
```
"""

        response = client.models.generate_content(
        model = model,
        contents = prompt
        )
        return response
    except Exception as e:
        print(f"ERROR: During generation of problem description {str(e)}")

if __name__ == "__main__":
    res = createProblemDescription()
    print(res.text)