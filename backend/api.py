from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Optional
from pydantic import BaseModel
from database import get_db, Investor, Commitment

app = FastAPI()

# Pydantic models for API responses
class InvestorResponse(BaseModel):
    id: int
    name: str
    investorType: str
    dateAdded: str
    country: str
    totalCommitment: float

class PaginationResponse(BaseModel):
    currentPage: int
    totalPages: int

class InvestorsResponse(BaseModel):
    investors: List[InvestorResponse]
    pagination: PaginationResponse

class CommitmentResponse(BaseModel):
    id: int
    assetClass: str
    currency: str
    amount: float

class AssetClassSummary(BaseModel):
    assetClass: str
    totalAmount: float

class InvestorCommitmentsResponse(BaseModel):
    id: int
    name: str
    commitments: List[CommitmentResponse]
    assetClassSummary: List[AssetClassSummary]
    totalCommitment: float
    pagination: PaginationResponse

@app.get("/api/investors", response_model=InvestorsResponse)
def get_investors(
    page: int = 1, 
    page_size: int = 10, 
    db: Session = Depends(get_db)
):
    # Calculate total investors and total pages
    total_investors = db.query(Investor).count()
    total_pages = (total_investors + page_size - 1) // page_size

    # Validate page number
    if page < 1 or page > total_pages:
        raise HTTPException(status_code=400, detail="Invalid page number")

    # Fetch investors with their total commitment
    investors_query = db.query(
        Investor, 
        func.sum(Commitment.amount).label('total_commitment')
    ).join(Commitment, Investor.id == Commitment.investor_id, isouter=True) \
     .group_by(Investor.id) \
     .order_by(Investor.id) \
     .offset((page - 1) * page_size) \
     .limit(page_size)

    investors_data = []
    for investor, total_commitment in investors_query:
        investors_data.append(InvestorResponse(
            id=investor.id,
            name=investor.name,
            investorType=investor.type,
            dateAdded=investor.commitments[0].date_added.strftime('%Y-%m-%d') if investor.commitments else None,
            country=investor.country,
            totalCommitment=total_commitment or 0
        ))

    return InvestorsResponse(
        investors=investors_data,
        pagination=PaginationResponse(
            currentPage=page,
            totalPages=total_pages,
        )
    )

@app.get("/api/investors/{investor_id}/commitments", response_model=InvestorCommitmentsResponse)
def get_investor_commitments(
    investor_id: int, 
    page: int = 1, 
    page_size: int = 10, 
    filterByAssetClass: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    # Fetch investor
    investor = db.query(Investor).filter(Investor.id == investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")

    # Base query for commitments
    commitments_query = db.query(Commitment).filter(Commitment.investor_id == investor_id)

    # Apply asset class filter if provided
    if filterByAssetClass:
        commitments_query = commitments_query.filter(Commitment.asset_class == filterByAssetClass)

    # Calculate total commitments before pagination
    total_commitments = commitments_query.count()
    total_pages = (total_commitments + page_size - 1) // page_size

    # Apply pagination
    commitments = commitments_query \
        .order_by(Commitment.id) \
        .offset((page - 1) * page_size) \
        .limit(page_size) \
        .all()

    # Recalculate asset class summary and total commitment without filtering
    original_commitments_query = db.query(Commitment).filter(Commitment.investor_id == investor_id)
    
    # Calculate total commitment
    total_commitment = original_commitments_query.with_entities(func.sum(Commitment.amount)).scalar() or 0

    # Generate asset class summary
    asset_class_summary = original_commitments_query \
        .with_entities(
            Commitment.asset_class, 
            func.sum(Commitment.amount).label('total_amount')
        ) \
        .group_by(Commitment.asset_class) \
        .all()

    return InvestorCommitmentsResponse(
        id=investor.id,
        name=investor.name,
        commitments=[
            CommitmentResponse(
                id=commitment.id,
                assetClass=commitment.asset_class,
                currency=commitment.currency,
                amount=commitment.amount
            ) for commitment in commitments
        ],
        assetClassSummary=[
            AssetClassSummary(
                assetClass=summary[0],
                totalAmount=summary[1]
            ) for summary in asset_class_summary
        ],
        totalCommitment=total_commitment,
        pagination=PaginationResponse(
            currentPage=page,
            totalPages=total_pages,
        )
    )

# Optional: Add CORS middleware if needed
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
