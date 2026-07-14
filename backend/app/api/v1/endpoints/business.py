from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.core.rate_limiting import rate_limit_check
from app.schemas.business import BusinessProfileCreate

router = APIRouter()

mock_business_db = {
    "company_name": "Acme Catering Services",
    "currency": "INR (₹)",
    "headcount": 12,
    "language": "en"
}

@router.get("/", dependencies=[Depends(rate_limit_check)])
def get_business_profile(current_user: dict = Depends(get_current_user)):
    """
    Fetch active business configuration.
    """
    return mock_business_db

@router.put("/", dependencies=[Depends(rate_limit_check)])
def update_business_profile(
    profile_in: BusinessProfileCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update active business configuration parameters.
    """
    # Restrict to owner or admin
    role = current_user.get("role", "authenticated")
    user_metadata = current_user.get("user_metadata", {})
    user_role = user_metadata.get("role", "employee")
    
    if user_role not in ["admin", "owner"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation restricted to workspace Owners and Admins."
        )

    mock_business_db["company_name"] = profile_in.company_name
    mock_business_db["currency"] = profile_in.currency
    mock_business_db["headcount"] = profile_in.headcount
    mock_business_db["language"] = profile_in.language
    return mock_business_db
