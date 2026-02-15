from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from .routes.main_routes import router

'''
Creates and configures the FastAPI application for the restaurant backend.
- Initialises the FastAPI app with a title
- Includes API routes from the main router so endpoints are available.
- Mounts a static files directory to serve frontend assets like HTML, CSS, JS
- Defines a root endpoint ("/") that redirects users to the frontend index page.
- Returns the configured app instance for running the server
'''

def create_app():
    app = FastAPI(title="Restaurant Backend")

    # API routes
    app.include_router(router)
    app.mount("/static", StaticFiles(directory="app/static"), name="static")

    # add other linked routes here with /page-name
    # redirect / to static/index.html
    @app.get("/")
    def root():
        return RedirectResponse("/static/index.html")

    return app

