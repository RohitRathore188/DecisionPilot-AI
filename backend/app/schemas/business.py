from pydantic import BaseModel, Field

class BusinessProfileCreate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=150)
    currency: str = Field("INR (₹)")
    headcount: int = Field(default=1, ge=1)
    language: str = Field("en")
