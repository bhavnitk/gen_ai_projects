#!/bin/bash
# This script runs the FastAPI application

# Activate the virtual environment if it exists
if [ -d "env_api" ]; then
    source env_api/bin/activate
fi

# Run the application with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

