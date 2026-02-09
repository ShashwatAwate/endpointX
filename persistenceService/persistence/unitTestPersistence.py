from ..models import Answers,UnitTests
from ..db import engine
from sqlalchemy.orm import sessionmaker
import uuid 
import json
from pydantic import BaseModel,Field

class File(BaseModel):
    path : str
    content: str

class UnitTest(BaseModel):
    question_id: str
    language: str
    test_framework : str
    http_client: str
    files: list[File]

def createUnitTest(payload: json):
    """Create answer row(duh)"""
    try:
        validated = UnitTest.model_validate(payload)
        data = validated.model_dump()
        Session = sessionmaker(bind=engine) 
        with Session() as session:
            newUnitTest = Answers(
                language = data.get("language"),
                test_framework = data.get("test_framework"),
                http_client = data.get("http_client"),
                test_files = data.get("files")
            )

            session.add(newUnitTest)
            session.commit()
            session.refresh(newUnitTest)

    except Exception as e:
        print(f"ERROR: creating unitTest failed {str(e)}")
        raise

def deleteUnitTest(testId: int):
    """Deletes unit test"""
    try:
        Session = sessionmaker(bind=engine)
        with Session() as session:
            ut = session.get(UnitTests,testId)
            if not ut:
                return False
            session.delete(ut)
            session.commit()
            return True
    except Exception as e:
        print(f"ERROR: deleting unit test failed: {str(e)}")
        raise