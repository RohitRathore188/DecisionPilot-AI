import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

reusable_oauth2 = HTTPBearer()

def get_current_user(
  credentials: HTTPAuthorizationCredentials = Depends(reusable_oauth2)
) -> dict:
  """
  Decodes and validates the Supabase JWT bearer token using the shared JWT Secret.
  Returns user claims from payload if valid, otherwise raises HTTP 401.
  """
  token = credentials.credentials
  
  # Defensive fallback for local development if JWT secret is missing
  if not settings.SUPABASE_JWT_SECRET:
    return {
      "sub": "mock-user-id-f81d-47ae",
      "email": "dev-user@decisionpilot.ai",
      "role": "authenticated"
    }

  try:
    payload = jwt.decode(
      token,
      settings.SUPABASE_JWT_SECRET,
      algorithms=["HS256"],
      audience="authenticated"
    )
    return payload
  except jwt.ExpiredSignatureError:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Token has expired",
      headers={"WWW-Authenticate": "Bearer"},
    )
  except jwt.InvalidTokenError:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid authentication token",
      headers={"WWW-Authenticate": "Bearer"},
    )
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail=f"Authentication failed: {str(e)}",
      headers={"WWW-Authenticate": "Bearer"},
    )
