from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from calls.routes import router as router_calls
from core.config import settings
from db.utils import create_db_and_tables
from incidents.routes import router as router_incidents


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck():
    return {"status": "ok"}

app.include_router(
    router_incidents,
    prefix="/incidents",
    tags=["Incidents"],
)

app.include_router(
    router_calls,
    prefix="/calls",
    tags=["Calls"],
)
