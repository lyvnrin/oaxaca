@echo off
set SCRIPT_DIR=%~dp0

echo Resetting database...
cd /d "%SCRIPT_DIR%Backend"
del /f oaxaca.db
python -m scripts.db_init
python -m scripts.seed_all

echo Starting frontend...
cd /d "%SCRIPT_DIR%Frontend"
start cmd /k "npm run dev"

echo Starting backend...
cd /d "%SCRIPT_DIR%Backend"
start cmd /k "uvicorn app.main:app --reload"

echo Both servers running. Close the opened windows to stop.
pause