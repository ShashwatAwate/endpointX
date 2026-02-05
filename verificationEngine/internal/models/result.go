package models

const (
	TestPassed string = "passed"
	TestFailed string = "failed"
)

type Result struct {
	Status   string
	Output   string
	ExitCode int
}
