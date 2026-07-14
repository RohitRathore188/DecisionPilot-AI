from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class DecisionVariableSchema(BaseModel):
    id: str
    name: str
    key: str
    type: str
    value: float

class DecisionOptionSchema(BaseModel):
    id: str
    name: str
    description: str
    modifications: Dict[str, float]

class DecisionCreateSchema(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    description: str = Field(..., min_length=5, max_length=1000)
    variables: List[DecisionVariableSchema]
    options: List[DecisionOptionSchema]

class SimulationRunSchema(BaseModel):
    variables: List[DecisionVariableSchema]
    options: List[DecisionOptionSchema]
