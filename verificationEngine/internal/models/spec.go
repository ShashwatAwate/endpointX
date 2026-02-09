// Package models
package models

import (
	"fmt"

	"github.com/ShashwatAwate/endpointX/verificationEngine/internal/utils"
	"github.com/google/uuid"
)

type File struct {
	Path    string `json:"path"`
	Content string `json:"content"`
}

type Spec struct {
	ID                 string `json:"-"`
	UserID             string `json:"user_id"`
	QuestionID         string `json:"question_id"`
	IsProblemGenerated int    `json:"is_problem_generated"`
	Language           string `json:"language"`
	Runtime            string `json:"runtime"`
	Framework          string `json:"framework"`
	TestFramework      string `json:"test_framework"`
	HTTPClient         string `json:"http_client"`
	Entry              string `json:"entry"`
	AppFiles           []File `json:"app_files"`
	TestFiles          []File `json:"test_files"`
}

// NewSpec - this will return a new spec
func NewSpec(json []byte) (*Spec, error) {
	id := uuid.NewString()

	spec, err := utils.UnmarshalFromBytes[Spec](json)
	if err != nil {
		return nil, err
	}

	spec.ID = id

	if err = spec.validate(); err != nil {
		return nil, err
	}

	return &spec, nil
}

// validate - basic validation check before returning the struct
// will add stuff to this later
// if i remember
func (s *Spec) validate() error {
	if s.Language != "javascript" {
		return fmt.Errorf("invalid language: %v", s.Language)
	}

	if s.Entry == "" {
		s.Entry = "src/app.js"
	}

	if s.UserID == "" && s.IsProblemGenerated!=1 {
		// TODO: fix this
		s.IsProblemGenerated=1
	}

	if s.IsProblemGenerated != 1 {
		s.IsProblemGenerated = 0
		s.UserID = "NoID"
	}

	if len(s.AppFiles) == 0 {
		return fmt.Errorf("insufficent app files given with len: %v", s.AppFiles)
	}

	if len(s.TestFiles) == 0 {
		return fmt.Errorf("insufficent test files given with len: %v", s.AppFiles)
	}

	return nil
}
