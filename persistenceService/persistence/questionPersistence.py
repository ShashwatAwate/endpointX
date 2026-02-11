from ..db import engine
from ..models import Questions
import uuid
import json

def createQuestion(payload:json,session):
    """Creates a row in Questions
    input:
{{
"id": "",
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
    """
    
    try:
        title = payload.get("title")
        id = payload.get("id")
        description = payload.get("overview")
        api_spec = payload.get("endpoints")
        difficulty = payload.get('difficulty')
        id_uuid = uuid.UUID(id) if id else None
        
        q = Questions(
                title=title,
                description=description,
                id=id_uuid,
                api_spec=api_spec,
                difficulty = difficulty
            )

        session.add(q)
        session.flush()
        return q

    except Exception as e:
        print(f"ERROR: creating question in db failed {str(e)}")
        raise

def deleteQuestion(questionId: str,session):
    """Deletes the question(duh)"""
    try:
        print(questionId)

        questionId_uuid = uuid.UUID(questionId)
        q = session.get(Questions,questionId_uuid)
        if not q:
            return False
        session.delete(q)
        session.flush()
        return True
    except Exception as e:

        print(f"ERROR: deleting question failed for question {str(e)}")
        raise