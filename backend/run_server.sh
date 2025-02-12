#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Navigate to backend directory
cd "$(dirname "$0")"

# Run FastAPI server
uvicorn api:app --reload --host 0.0.0.0 --port 8000

# Deactivate virtual environment
deactivate
