from ..models import Answers
import uuid
import json
from sqlalchemy import select

def createAnswer(payload: json,session):
    """Creating answers"""
    try:
        userId = payload.get("user_id")
        questionId = payload.get("question_id")
        language = payload.get("language")
        framework = payload.get("framework")
        codeFiles = payload.get("app_files")
        testResult = payload.get("jestOutput")

        # Find existing answer (because user_id + question_id is unique)
        stmt = select(Answers).where(
            Answers.user_id == userId,
            Answers.question_id == questionId
        )
        existing = session.execute(stmt).scalar_one_or_none()

        if existing:
            # Update existing row
            existing.language = language
            existing.framework = framework
            existing.code_files = codeFiles
            existing.test_results = testResult

            session.flush()
            return existing

        # Else create new
        answerId = uuid.uuid4()
        newAnswer = Answers(
            id=answerId,
            user_id=userId,
            question_id=questionId,
            language=language,
            framework=framework,
            code_files=codeFiles,
            test_results=testResult
        )
        session.add(newAnswer)
        session.flush()
        return newAnswer

    except Exception as e:
        print(f"ERROR: creating answer failed {str(e)}")
        raise
