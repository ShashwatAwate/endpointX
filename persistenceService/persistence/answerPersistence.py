from ..models import Answers
import uuid
import json

def createAnswer(payload: json,session):
    """Creating answers"""
    try:
        userId = payload.get("user_id")
        questionId = payload.get("question_id")
        language = payload.get("language")
        framework = payload.get("framework")
        codeFiles = payload.get("app_files")
        testResult = payload.get("jestOutput")
        answerId = uuid.uuid4()

        newAnswer = Answers(
            id = answerId,
            user_id=userId,
            question_id=questionId,
            language = language,
            framework = framework,
            code_files = codeFiles,
            test_results = testResult
        )
        session.add(newAnswer)
        session.flush()
        return newAnswer
        
    except Exception as e:
        print(f"ERROR: creating answer failed {str(e)}")
        raise