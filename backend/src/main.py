from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.utils import create_db_and_tables  
from incidents.routes import router as router_incidents
from calls.routes import router as router_calls
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

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