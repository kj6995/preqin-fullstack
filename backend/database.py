import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base, sessionmaker
from datetime import datetime

# Ensure the database directory exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, 'data')
os.makedirs(DATABASE_DIR, exist_ok=True)

# Create SQLite database path
DATABASE_PATH = os.path.join(DATABASE_DIR, 'preqin_database.sqlite')

# Create SQLAlchemy engine
engine = create_engine(f'sqlite:///{DATABASE_PATH}', echo=True)

# Create a base class for declarative models
Base = declarative_base()

# Create a session factory
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

class Investor(Base):
    __tablename__ = 'investors'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    country = Column(String)
    
    # Relationship to commitments
    commitments = relationship("Commitment", back_populates="investor")

class Commitment(Base):
    __tablename__ = 'commitments'
    
    id = Column(Integer, primary_key=True, index=True)
    investor_id = Column(Integer, ForeignKey('investors.id'))
    asset_class = Column(String)
    amount = Column(Float)
    currency = Column(String)
    date_added = Column(DateTime)
    last_updated = Column(DateTime)
    
    # Relationship back to investor
    investor = relationship("Investor", back_populates="commitments")

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the database when this module is imported
init_db()
