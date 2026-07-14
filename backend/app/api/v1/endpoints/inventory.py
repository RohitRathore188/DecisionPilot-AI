from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.core.rate_limiting import rate_limit_check

router = APIRouter()

mock_inventory_db = [
  {
    "id": "i1",
    "name": "Refined Flour (Sacks)",
    "category": "Raw Materials",
    "stockLevel": 28,
    "quantity": 45,
    "unit": "bags",
    "expiryDays": 45,
    "restockRecommended": True,
    "predictedUsage": 120,
    "bestSupplier": "FreshFoods Wholesalers (₹850/bag)"
  },
  {
    "id": "i2",
    "name": "Compostable Meal Trays",
    "category": "Packaging",
    "stockLevel": 14,
    "quantity": 250,
    "unit": "units",
    "expiryDays": 360,
    "restockRecommended": True,
    "predictedUsage": 1500,
    "bestSupplier": "Acme EcoPack (₹12/unit)"
  },
  {
    "id": "i3",
    "name": "Cold-Pressed Canola Oil",
    "category": "Raw Materials",
    "stockLevel": 82,
    "quantity": 90,
    "unit": "liters",
    "expiryDays": 12,
    "restockRecommended": False,
    "predictedUsage": 60,
    "bestSupplier": "FreshFoods Wholesalers (₹190/L)"
  }
]

@router.get("/", dependencies=[Depends(rate_limit_check)])
def get_inventory(current_user: dict = Depends(get_current_user)):
    """
    List stock levels and expiry days.
    """
    return mock_inventory_db

@router.post("/{item_id}/restock", dependencies=[Depends(rate_limit_check)])
def restock_item(item_id: str, current_user: dict = Depends(get_current_user)):
    """
    Refill inventory stocks back to full limits.
    """
    for item in mock_inventory_db:
        if item["id"] == item_id:
            item["stockLevel"] = 100
            item["quantity"] += item["predictedUsage"]
            item["restockRecommended"] = False
            return item
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Item with id {item_id} not found."
    )
