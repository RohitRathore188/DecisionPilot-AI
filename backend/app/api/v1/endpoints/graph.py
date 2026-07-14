from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.core.rate_limiting import rate_limit_check

router = APIRouter()

class Position(BaseModel):
    x: float
    y: float

class GraphNode(BaseModel):
    id: str
    type: str # RESTAURANT, SUPPLIER, INVENTORY, MENU ITEM, ORDERS, CUSTOMERS, REVENUE
    label: str
    icon: str
    status: str
    details: str
    position: Position

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# Mock data conforming to the CHRONOS graph hierarchy in the screenshot
MOCK_NODES = [
    # Row 1: Suppliers
    {
        "id": "s1",
        "type": "SUPPLIER",
        "label": "Sysco Logistics",
        "icon": "Truck",
        "status": "Partner",
        "details": "Major supplier for wholesale items, raw grains, and dry-store ingredients. Performance rating: 96% reliability.",
        "position": {"x": 200, "y": 50}
    },
    {
        "id": "s2",
        "type": "SUPPLIER",
        "label": "GreenValley Farms",
        "icon": "Truck",
        "status": "Preferred",
        "details": "Premium local organic farm supplying fresh produce, organic vegetables, and herbs. 100% organic certification.",
        "position": {"x": 450, "y": 50}
    },
    # Row 2: Inventory items
    {
        "id": "i1",
        "type": "INVENTORY",
        "label": "Fresh Produce",
        "icon": "Package",
        "status": "Optimal",
        "details": "Short shelf-life fresh vegetables and greens stored in cold counters. Stock level: 85% of max capacity.",
        "position": {"x": 250, "y": 200}
    },
    {
        "id": "i2",
        "type": "INVENTORY",
        "label": "Prime Cold Storage",
        "icon": "Package",
        "status": "Low Stock",
        "details": "Main freezer container housing prime cut meats, dairy, and cold-chain items. Stock level: 22% of capacity.",
        "position": {"x": 500, "y": 200}
    },
    # Row 3: Menu Items
    {
        "id": "m1",
        "type": "MENU ITEM",
        "label": "Dry-Aged Ribeye",
        "icon": "Utensils",
        "status": "High Margin",
        "details": "Signature dry-aged ribeye steak platter. Price: ₹1,850. Gross margin: 72%. High priority demand.",
        "position": {"x": 220, "y": 350}
    },
    {
        "id": "m2",
        "type": "MENU ITEM",
        "label": "Organic Harvest Salad",
        "icon": "Utensils",
        "status": "Popular",
        "details": "Seasonal fresh organic greens tossed with vinaigrette. Price: ₹620. Gross margin: 68%.",
        "position": {"x": 470, "y": 350}
    },
    # Row 4: Orders & Customers
    {
        "id": "o1",
        "type": "ORDERS",
        "label": "Dinner Rush Transactions",
        "icon": "ShoppingCart",
        "status": "Processing",
        "details": "Fulfillment transactions generated during 6:00 PM - 9:30 PM peak dining hours.",
        "position": {"x": 250, "y": 500}
    },
    {
        "id": "c1",
        "type": "CUSTOMERS",
        "label": "Repeat Residents",
        "icon": "Users",
        "status": "Loyal",
        "details": "Local downtown neighborhood customer segment with a returning visit rate of 3.4x monthly.",
        "position": {"x": 550, "y": 500}
    },
    # Row 5: Restaurants
    {
        "id": "r1",
        "type": "RESTAURANT",
        "label": "Bistro Downtown",
        "icon": "Building",
        "status": "Active",
        "details": "Our primary metropolitan restaurant hub situated in the central business district.",
        "position": {"x": 400, "y": 650}
    },
    # Row 6: Revenue
    {
        "id": "rev1",
        "type": "REVENUE",
        "label": "Direct Register Rev",
        "icon": "DollarSign",
        "status": "Settled",
        "details": "Direct checkout register revenue, swept and processed into the main operations account daily.",
        "position": {"x": 400, "y": 800}
    }
]

MOCK_EDGES = [
    {"id": "e1", "source": "s1", "target": "i1", "label": "Organic Clean Delivery"},
    {"id": "e2", "source": "s2", "target": "i1", "label": "Organic Clean Delivery"},
    {"id": "e3", "source": "s2", "target": "i2", "label": "Cold-chain Logistics"},
    {"id": "e4", "source": "i1", "target": "m1", "label": "Important Box"},
    {"id": "e5", "source": "i1", "target": "m2", "label": "Important Box"},
    {"id": "e6", "source": "i2", "target": "m2", "label": "Storage Pull"},
    {"id": "e7", "source": "m1", "target": "o1", "label": "Sales Volume"},
    {"id": "e8", "source": "m2", "target": "o1", "label": "Sales Volume"},
    {"id": "e9", "source": "c1", "target": "o1", "label": "Demand Node"},
    {"id": "e10", "source": "o1", "target": "r1", "label": "Fulfillment"},
    {"id": "e11", "source": "r1", "target": "rev1", "label": "Cash Settlement"}
]

@router.get("/", response_model=GraphResponse, dependencies=[Depends(rate_limit_check)])
def get_graph_data(current_user: dict = Depends(get_current_user)):
    """
    Fetch the nodes and edges for the business knowledge graph.
    """
    return {
        "nodes": MOCK_NODES,
        "edges": MOCK_EDGES
    }
