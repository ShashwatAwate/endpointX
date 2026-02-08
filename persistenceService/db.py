import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")
engine = create_engine(DB_URL, pool_pre_ping=True)

metadata = MetaData()
metadata.reflect(bind=engine)

tables = metadata.tables
