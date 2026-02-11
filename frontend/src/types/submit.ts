type AssertionResult = {
  status: "passed" | "failed";
  fullName: string;
  duration: number;
};

type TestSuite = {
  status: "passed" | "failed";
  message: string;
  assertionResults: AssertionResult[];
};

export type BackendResult = {
  status: string;
  language: string;
  framework: string;
  submitted_at: string;
  test_results: {
    success: boolean;
    testResults: TestSuite[];
    numTotalTests: number;
    numFailedTests: number;
    numPassedTests: number;
  };
};
