from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List
from app.core.security import get_current_user
from app.core.rate_limiting import rate_limit_check
from app.models.decision import (
  DecisionCreateSchema,
  DecisionResponseSchema,
  SimulationResultSchema
)
from app.services.simulation import SimulationEngine
from app.services.gemini import GeminiService
from datetime import datetime

router = APIRouter()

mock_decisions_db = []

@router.get("/", response_model=List[DecisionResponseSchema], dependencies=[Depends(rate_limit_check)])
def get_decisions(current_user: dict = Depends(get_current_user)):
  """
  List all simulated options for current workspace session.
  """
  return mock_decisions_db

@router.post("/", response_model=DecisionResponseSchema, status_code=status.HTTP_201_CREATED, dependencies=[Depends(rate_limit_check)])
def create_decision(
  decision_in: DecisionCreateSchema,
  current_user: dict = Depends(get_current_user)
):
  """
  Configure raw parameters and variables.
  """
  new_id = f"dec-{len(mock_decisions_db) + 1}"
  new_decision = {
    "id": new_id,
    "title": decision_in.title,
    "description": decision_in.description or "",
    "createdAt": datetime.utcnow().isoformat() + "Z",
    "status": "draft",
    "variables": [v.dict() for v in decision_in.variables],
    "options": [o.dict() for o in decision_in.options],
    "results": None
  }
  mock_decisions_db.append(new_decision)
  return new_decision

@router.get("/{decision_id}", response_model=DecisionResponseSchema, dependencies=[Depends(rate_limit_check)])
def get_decision(decision_id: str, current_user: dict = Depends(get_current_user)):
  """
  Fetch single decision details.
  """
  for decision in mock_decisions_db:
    if decision["id"] == decision_id:
      return decision
  raise HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail=f"Decision with id {decision_id} not found."
  )

@router.post("/{decision_id}/simulate", response_model=SimulationResultSchema, dependencies=[Depends(rate_limit_check)])
async def run_simulation(decision_id: str, current_user: dict = Depends(get_current_user)):
  """
  Execute Monte Carlo simulation and query Gemini explaining factors and risks.
  """
  decision_found = None
  for decision in mock_decisions_db:
    if decision["id"] == decision_id:
      decision_found = decision
      break

  if not decision_found:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=f"Decision with id {decision_id} not found."
    )

  # Run standard Monte Carlo normal distribution simulations using NumPy
  sim_results = SimulationEngine.run_monte_carlo(
    variables=decision_found["variables"],
    options=decision_found["options"]
  )

  # Attach Explainable AI consulting text to each option outcomes
  outcomes_with_ai = []
  for outcome in sim_results["outcomes"]:
    option_id = outcome["optionId"]
    option_name = outcome["optionName"]
    roi = outcome["metrics"]["roi"]

    # Generate consulting advice
    ai_report = await GeminiService.generate_consultant_report(
      title=decision_found["title"],
      option_name=option_name,
      roi=roi
    )

    outcomes_with_ai.append({
      "optionId": option_id,
      "optionName": option_name,
      "metrics": {
        "revenue": outcome["metrics"]["revenue"],
        "cost": outcome["metrics"]["cost"],
        "profit": outcome["metrics"]["profit"],
        "roi": float(roi)
      },
      # Store consultant review metadata
      "explainableAI": ai_report
    })

  result = {
    "decisionId": decision_id,
    "simulatedAt": datetime.utcnow().isoformat() + "Z",
    "confidenceScore": sim_results["confidenceScore"],
    "outcomes": outcomes_with_ai,
    "sensitivityAnalysis": sim_results["sensitivityAnalysis"]
  }

  # Update workspace status
  decision_found["status"] = "completed"
  decision_found["results"] = result

  return result
