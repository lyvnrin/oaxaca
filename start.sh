#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting frontend..."
cd "$SCRIPT_DIR/Frontend"
npm run dev &
FRONTEND_PID=$!

echo "Starting backend..."
cd "$SCRIPT_DIR/Backend"
uvicorn app.main:app --reload &
BACKEND_PID=$!

trap "kill $FRONTEND_PID $BACKEND_PID" EXIT
wait