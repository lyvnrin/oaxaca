from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routes.main_routes import router

def create_app():
    app = FastAPI(title="Restaurant Backend")

    app.mount("/", StaticFiles(directory="app/static", html=True), name="static")

    # API routes
    app.include_router(router)

    return app