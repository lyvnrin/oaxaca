from app import create_app

app = create_app()

'''
Entry point for the FastAPI backend.

- Imports the create_app() function which sets up:
  - API routes
  - Static file serving
  - Root redirect to the frontend index page

- `app` is the FastAPI instance that will run the server.

How to run locally so the HTML frontend loads:
1. Make sure you're in the project directory
2. Install dependencies if you haven't already:
  pip install -r requirements.txt
3. Run the FastAPI server with Uvicorn:
  uvicorn run:app --reload
    - `run` is the name of this Python file
    - `--reload` makes the server auto-reload on code changes
4. Open your browser and go to:
   http://127.0.0.1:8000/ - This will redirect to /static/index.html where your frontend HTML page is

Notes:
- Any changes to API routes or static files require restarting the server (or rely on --reload)
- You can test filters, menu items, and other functionality via the frontend page
'''