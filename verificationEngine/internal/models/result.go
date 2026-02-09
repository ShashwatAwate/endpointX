package models

const (
	TestPassed string = "passed"
	TestFailed string = "failed"
)

type Result struct {
	UserID             string      `json:"user_id"`
	QuestionID         string      `json:"question_id"`
	IsProblemGenerated int         `json:"isProblemGenerated"`
	Status             string      `json:"status"`
	RawOutput          string      `json:"rawOutput"`
	AppFiles           []File      `json:"app_files"`
	Language           string      `json:"language"`
	Framework          string      `json:"framework"`
	Jest               *JestOutput `json:"jestOutput"`
	ExitCode           int         `json:"exitCode"`
}

type AssertionResult struct {
	FullName string `json:"fullName"`
	Status   string `json:"status"`
	Duration int64  `json:"duration"`
}

type TestResult struct {
	Name             string            `json:"name"`
	Status           string            `json:"status"`
	Message          string            `json:"message"`
	AssertionResults []AssertionResult `json:"assertionResults"`
}

type JestOutput struct {
	Success         bool         `json:"success"`
	NumFailedTests  int          `json:"numFailedTests"`
	NumPassedTests  int          `json:"numPassedTests"`
	NumTotalTests   int          `json:"numTotalTests"`
	NumFailedSuites int          `json:"numFailedTestSuites"`
	NumPassedSuites int          `json:"numPassedTestSuites"`
	NumTotalSuites  int          `json:"numTotalTestSuites"`
	TestResults     []TestResult `json:"testResults"`
}
