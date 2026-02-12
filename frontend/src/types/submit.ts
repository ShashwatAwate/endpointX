type CodeFiles = {
  path: string,
  content: string,
}

type TestResult = {
  numFailedTestSuites: number;
  numFailedTests: number;
  numPassedTestSuites: number;
  numPassedTests: number;
  numTotalTestSuites: number;
  numTotalTests: number;
  success: boolean;
  testResults: Result[]
}

type Result = {
  name: string;
  status: string;
  message: string;
  assertionResults?: AssertionResult[]
}

type AssertionResult = {
  fullName: string;
  status: string;
  duration: number
}

export type SubmitResult = {
  id: string;
  user_id: string;
  question_id: string;
  code_files: CodeFiles[];
  language: string;
  framework: string;
  status: string;
  score?: number;
  test_results: TestResult
}
