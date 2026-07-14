from fastapi import APIRouter
from app.api.v1.endpoints import decisions, business, copilot, inventory, reports, graph

api_router = APIRouter()
api_router.include_router(decisions.router, prefix="/decisions", tags=["decisions"])
api_router.include_router(business.router, prefix="/business", tags=["business"])
api_router.include_router(copilot.router, prefix="/copilot", tags=["copilot"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(graph.router, prefix="/graph", tags=["graph"])
