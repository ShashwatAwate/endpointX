-- Core entities for endpointX

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stored questions / challenges
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(50),
  api_spec JSONB,
  entry_point VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unit tests generated for a question
CREATE TABLE IF NOT EXISTS unit_tests (
  id UUID PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  language VARCHAR(50),
  test_framework VARCHAR(50),
  http_client VARCHAR(50),
  test_files JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User answers / submissions
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  code_files JSONB NOT NULL,
  language VARCHAR(50),
  framework VARCHAR(50),
  status VARCHAR(50) DEFAULT 'submitted',
  score FLOAT,
  test_results JSONB,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_user_id ON answers(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_unit_tests_question_id ON unit_tests(question_id);
