#!/bin/bash
# Helper script to run the Video Prompt Generator CLI with virtual environment

cd "$(dirname "$0")"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing dependencies..."
    pip install anthropic openai
else
    source venv/bin/activate
fi

# Run the launcher
python video_prompt_launcher.py

# Deactivate when done
deactivate

