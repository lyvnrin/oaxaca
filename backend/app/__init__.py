from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from .routes.main_routes import router

def create_app():
    app = FastAPI(title="Restaurant Backend")

    # API routes
    app.include_router(router)

    app.mount("/static", StaticFiles(directory="app/static"), name="static")

    # redirect / to static/index.html
    @app.get("/")
    def root():
        return RedirectResponse("/static/index.html")

    return app