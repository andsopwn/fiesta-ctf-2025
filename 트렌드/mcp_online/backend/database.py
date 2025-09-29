from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os
from dotenv import load_dotenv

load_dotenv()

# SQLAlchemy 설정
DATABASE_URL = f"mysql+pymysql://{os.getenv('DB_USER', 'financialuser')}:{os.getenv('DB_PASSWORD', 'financialpass')}@{os.getenv('DB_HOST', 'mysql')}:{os.getenv('DB_PORT', '3306')}/{os.getenv('DB_NAME', 'financial_library')}?charset=utf8mb4"

engine = create_engine(
    DATABASE_URL, 
    connect_args={
        "charset": "utf8mb4",
        "autocommit": False,
        "connect_timeout": 60,
        "read_timeout": 60,
        "write_timeout": 60,
    },
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # This will test connections before use
    pool_recycle=3600,   # Recycle connections every hour
    echo=False
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
