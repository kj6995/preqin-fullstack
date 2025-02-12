#!/bin/bash

# Activate virtual environment (adjust path if needed)
source venv/bin/activate

# Navigate to backend directory
cd "$(dirname "$0")"

# Run the import script
python import_data.py

# Deactivate virtual environment
deactivate
