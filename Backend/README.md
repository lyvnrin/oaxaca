### Backend

From the `Backend/` directory:
```bash
rm -rf oaxaca.db # 1. Delete current DB
python -m scripts.db_init # 2. Initialise DB
python -m scripts.seed_all # 3. Seed entries to DB
uvicorn app.main:app --reload # 4. Start the API server