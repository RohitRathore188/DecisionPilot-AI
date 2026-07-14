from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Union

class DecisionVariableSchema(BaseModel):
  id: str
  name: str
  key: str
  type: str  # "currency", "percentage", "number", "boolean"
  value: Union[float, int, bool]
  min: Optional[float] = None
  max: Optional[float] = None
  description: Optional[str] = None

class DecisionOptionSchema(BaseModel):
  id: str
  name: str
  description: str
  modifications: Dict[str, Union[float, int]]

class MetricsSchema(BaseModel):
  revenue: List[float]
  cost: List[float]
  profit: List[float]
  roi: float

class OutcomeSchema(BaseModel):
  optionId: str
  optionName: str
  metrics: MetricsSchema
  explainableAI: Optional[Dict[str, Union[str, List[str]]]] = None

class SensitivityAnalysisSchema(BaseModel):
  variableKey: str
  impactLevel: str  # "high", "medium", "low"
  description: str

class SimulationResultSchema(BaseModel):
  decisionId: str
  simulatedAt: str
  confidenceScore: float
  outcomes: List[OutcomeSchema]
  sensitivityAnalysis: List[SensitivityAnalysisSchema]

class DecisionCreateSchema(BaseModel):
  title: str = Field(..., min_length=1, max_length=100)
  description: Optional[str] = None
  variables: List[DecisionVariableSchema] = []
  options: List[DecisionOptionSchema] = []

class DecisionResponseSchema(BaseModel):
  id: str
  title: str
  description: Optional[str] = None
  createdAt: str
  status: str  # "draft", "running", "completed", "failed"
  variables: List[DecisionVariableSchema] = []
  options: List[DecisionOptionSchema] = []
  results: Optional[SimulationResultSchema] = None
