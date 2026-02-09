from ..models import UnitTests
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

def createUnitTest(payload: dict,session):
    try:
        validated = UnitTest.model_validate(payload)
        data = validated.model_dump()

        question_uuid = uuid.UUID(validated.question_id)

        newUnitTest = UnitTests(
            id=uuid.uuid4(),
            question_id=question_uuid,
            language=data.get("language"),
            test_framework=data.get("test_framework"),
            http_client=data.get("http_client"),
            test_files=data.get("files")   # JSONB column
        )
        session.add(newUnitTest)
        session.flush()
        return newUnitTest

    except Exception as e:
        print(f"ERROR: creating unitTest failed {str(e)}")
        raise

def deleteUnitTest(testId: str,session):
    """Deletes unit test"""
    try:
        testId_uuid = uuid.UUID(testId)
        ut = session.get(UnitTests,testId_uuid)
        if not ut:
            return False
        session.delete(ut)
        session.commit()
        return True
    except Exception as e:
        print(f"ERROR: deleting unit test failed: {str(e)}")
        raise