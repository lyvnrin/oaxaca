from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.main_routes import router as main_router
from .routes.order_routes import router as order_router

def create_app():
    app = FastAPI(title="Restaurant Backend")

    app.add_middleware( CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(main_router)
    app.include_router(order_router)

    return app