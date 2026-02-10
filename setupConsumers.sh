#!/bin/bash

cd persistenceService
bash setup.sh
cd ..

source ./persistenceService/venv/bin/activate

echo "persistence setup complete"
