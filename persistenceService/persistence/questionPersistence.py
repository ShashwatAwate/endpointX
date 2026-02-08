from ..db import engine
from ..models import Questions
from sqlalchemy.orm import sessionmaker
import uuid
import json

def create_question(payload:json):
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
        Session = sessionmaker(bind=engine)
        title = payload.get("title")
        publicId = payload.get("id")
        description = payload.get("overview")
        api_spec = payload.get("endpoints")
        public_uuid = uuid.UUID(publicId) if publicId else None
        with Session() as session:
            q = Questions(
                title=title,
                description=description,
                public_id=public_uuid,
                api_spec=api_spec
            )

            session.add(q)
            session.commit()
            session.refresh(q)

            return q
    except Exception as e:
        print(f"ERROR: creating question in db failed {str(e)}")
        raise

def delete_question(questionId: int):
    """Deletes the question(duh)"""
    try:
        Session = sessionmaker(bind=engine)
        with Session() as session:
            q = session.get(Questions,questionId)
            if not q:
                return False
            session.delete(q)
            session.commit()
            return True
    except Exception as e:
        print(f"ERROR: deleting question failed {str(e)}")
        raise