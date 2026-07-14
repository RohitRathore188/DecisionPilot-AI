import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

reusable_oauth2 = HTTPBearer()

def get_current_user(
  credentials: HTTPAuthorizationCredentials = Depends(reusable_oauth2)
) -> dict:
  """
  Decodes and validates the Supabase JWT bearer token using the shared JWT Secret or JWKS endpoint.
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
    # 1. Inspect headers to check the signing algorithm
    header = jwt.get_unverified_header(token)
    algorithm = header.get("alg", "HS256")
    
    # 2. Extract issuer to fetch JWKS dynamically if asymmetric signature is used
    unverified_payload = jwt.decode(token, options={"verify_signature": False})
    issuer = unverified_payload.get("iss")

    if algorithm in ["RS256", "ES256"] and issuer:
      # Asymmetric signature verification using JWKS (JSON Web Key Set)
      jwks_url = f"{issuer.rstrip('/')}/.well-known/jwks.json"
      headers = {"apikey": settings.SUPABASE_KEY} if settings.SUPABASE_KEY else {}
      jwks_client = PyJWKClient(jwks_url, headers=headers)
      signing_key = jwks_client.get_signing_key_from_jwt(token)
      payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=[algorithm],
        audience="authenticated"
      )
    else:
      # Symmetric signature verification using shared secret
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
