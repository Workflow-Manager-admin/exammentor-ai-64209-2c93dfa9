#!/bin/bash
cd /home/kavia/workspace/code-generation/exammentor-ai-64209-2c93dfa9/exammentor_ai_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

