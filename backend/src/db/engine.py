from core.config import settings
from sqlmodel import Session, create_engine, text

database_url = "postgresql+psycopg://postgres:>SD>BYp/S]2:vNex@34.62.221.183:5432/fastaid_db"
engine = create_engine(database_url)