## Oaxaca Restaurant Management System

A full-stack restaurant management system built as a team project. This repository is a personal portfolio mirror of the original GitLab project, which was cloned separately.

## Tech Stack
- **Frontend:** React
- **Backend:** Python, FastAPI
- **Database:** SQLite

## Contributors

This project was developed collaboratively. Some contributors are visible in the  commit history, cloned and migrated from the original GitLab repository.

## Running the Project

Everything runs from a single command, so there's no need in managing multiple terminals.

### First time / reset database

**Mac/Linux:**
```bash
chmod +x reset.sh start.sh
./reset.sh
```

**Windows:**
```
reset.bat
```

This will delete and reinitialise the database, seed it with default data, and start both the frontend and backend automatically.

### Subsequent runs (keep existing data)

**Mac/Linux:**
```bash
./start.sh
```

**Windows:**
```
start.bat
```

### Once running

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

> **Mac/Linux:** Press `Ctrl+C` in the terminal to stop both servers.

> **Windows:** Close the frontend and backend windows that opened.

## Staff Login

**Involving**: Kitchen Staff, Manager, Waiter

Staff accounts are pre-seeded into the database on first run. Login credentials for all staff members can be found in `Backend/data/staff.csv`.
Staff are already logged in by default when the application starts, so no manual login step is required during a demo or first use.

## Documentation

Pre-generated docs are in `Frontend/docs/` and `Backend/docs/`. To regenerate:

**Frontend (JSDoc):**
```bash
cd Frontend
npm install -g jsdoc
jsdoc src/ -r -d docs/
```

**Backend (pdoc):**
```bash
cd Backend
pip install pdoc
pdoc app/ -o docs/
```

Open `Frontend/docs/index.html` or `Backend/docs/index.html` in a browser to view.
