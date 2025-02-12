# Investor Commitments Dashboard - Product Requirements Document (PRD)

## Overview

The Investor Commitments Dashboard consists of two main pages designed to manage and display investor information and their commitments across different asset classes.

## Technology Stack

### Frontend
- Framework: Next.js (React-based)
- Styling: Tailwind CSS
- UI Components: ShadCN UI + Lucide Icons

### Backend
- Framework: FastAPI (Python)
- Database: SQLite

## Functional Requirements

### 1. Investor List Page

#### Features
- Table display with columns:
  - ID (Unique Investor ID)
  - Investor Name (Clickable, navigates to details page)
  - Investor Type
  - Date Added
  - Country
  - Total Commitment
- Search functionality by investor name
- Asset Class filtering
- Pagination

#### API Contract
```json
GET /api/investors

{
  "investors": [
    {
      "id": 1001,
      "name": "Investor A",
      "investorType": "Hedge Fund",
      "dateAdded": "2024-01-10",
      "country": "USA",
      "totalCommitment": 500000000
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalInvestors": 50
  }
}
```

### 2. Investor Details Page

#### Features
- Asset class listing with total commitments
- Commitment filtering by asset class
- Commitments table with columns:
  - ID
  - Asset Class
  - Currency
  - Commitment Amount
- Total commitment summary across asset classes

#### API Contract
```json
GET /api/investors/{id}/commitments

{
  "id": 1001,
  "name": "Investor A",
  "commitments": [
    {
      "id": 30001,
      "assetClass": "Hedge Funds",
      "currency": "GBP",
      "amount": 200000000
    }
  ],
  "assetClassSummary": [
    {
      "assetClass": "Hedge Funds",
      "totalAmount": 1100000000
    }
  ],
  "totalCommitment": 2400000000
}
```

## Implementation Guide

### Frontend Development (Next.js)

#### Step 1: Project Setup
```bash
npx create-next-app@latest investor-dashboard
cd investor-dashboard
npm install tailwindcss @shadcn/ui lucide-react axios react-router-dom
npx tailwindcss init -p
```

#### Step 2: Component Creation
- InvestorTable.tsx
- InvestorDetails.tsx
- AssetClassFilter.tsx

#### Step 3: Page Implementation
- pages/index.tsx (Investor List)
- pages/investors/[id].tsx (Investor Details)

#### Step 4: API Integration
- Implement Axios for data fetching
- Add search and filter functionality

#### Step 5: UI Enhancement
- Integrate ShadCN UI components
- Add Lucide Icons

### Backend Development (FastAPI)

#### Step 1: Project Setup
```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlite3 pydantic sqlalchemy
```

#### Step 2: Database Models
```python
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

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

```

#### Step 3: API Implementation
```python
from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/investors")
def get_investors(db: Session = Depends(get_db)):
    investors = db.query(models.Investor).all()
    return {"investors": investors}

@app.get("/api/investors/{id}/commitments")
def get_investor_commitments(id: int, db: Session = Depends(get_db)):
    commitments = db.query(models.Commitment).filter(
        models.Commitment.investor_id == id
    ).all()
    return {"commitments": commitments}
```

#### Step 4: Server Deployment
```bash
uvicorn main:app --reload
```

## Project Structure
```
frontend
├── README.md
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (Investor List Page)
│   └── [id].tsx (Investor Details Page)
├── components
│   ├── InvestorTable.tsx
│   ├── InvestorDetails.tsx
│   ├── AssetClassFilter.tsx
├── lib
│   ├── api.ts (Handles API requests)
│   ├── utils.ts
├── components.json
├── eslint.config.mjs
├── instructions
│   └── prd.md
├── lib
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── tailwind.config.ts
└── tsconfig.json

backend
├── main.py
├── models.py
├── database.py
├── requirements.txt
├── venv
```

