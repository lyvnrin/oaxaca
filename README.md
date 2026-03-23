# Team Project

This repository has been created to store your Team Project.

You may edit it as you like, but please do not remove the default topics or the project members list. These need to stay as currently defined in order for your lecturer to be able to find and mark your work.

## Running the Project
### Backend

From the `Backend/` directory:
```bash
rm -rf oaxaca.db # 1. Delete current DB
python -m scripts.db_init # 2. Initialise DB
python -m scripts.seed_all # 3. Seed entries to DB
uvicorn app.main:app --reload # 4. Start the API server
```

The API will be available at `http://localhost:8000`.

### Frontend
From the `Frontend/` directory:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or whichever port Vite assigns).