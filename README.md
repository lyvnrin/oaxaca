# Team Project

This repository has been created to store your Team Project.

You may edit it as you like, but please do not remove the default topics or the project members list. These need to stay as currently defined in order for your lecturer to be able to find and mark your work.

## Running the Project

Everything runs from a single command — no need to manage multiple terminals.

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