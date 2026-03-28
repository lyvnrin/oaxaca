### Backend

From the `Backend/` directory:
```bash
rm -rf oaxaca.db
python -m scripts.db_init && python -m scripts.seed_all
uvicorn app.main:app --reload```

1. Delete current DB
2. Initialise DB
3. Seed entries to DB
4. Start the API server