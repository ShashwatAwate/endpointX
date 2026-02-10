#!/bin/bash

cd verificationEngine/
npm i
go build ./cmd/verification-engine/

echo "service built"
