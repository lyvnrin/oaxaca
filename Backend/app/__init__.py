from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.main_routes import router

def create_app():
    app = FastAPI(title="Restaurant Backend")

    app.add_middleware( CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

    app.include_router(router)

    return app