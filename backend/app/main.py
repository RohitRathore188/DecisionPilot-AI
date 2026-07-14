from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.core.config import settings
from app.api.v1.api import api_router
import re

app = FastAPI(
  title=settings.PROJECT_NAME,
  openapi_url=f"{settings.API_V1_STR}/openapi.json",
  docs_url=f"{settings.API_V1_STR}/docs",
  redoc_url=f"{settings.API_V1_STR}/redoc",
)

# ---------------------------------------------------------------------------
# Dynamic CORS Middleware
# ---------------------------------------------------------------------------
# This custom middleware checks the Origin header against configured origins
# AND dynamically allows any *.vercel.app preview deployment URL.
# This ensures CORS never breaks for any Vercel preview/production deployment.
# ---------------------------------------------------------------------------

# Pattern to match any Vercel deployment preview URL
VERCEL_ORIGIN_PATTERN = re.compile(r"^https://.*\.vercel\.app$")

class DynamicCORSMiddleware(BaseHTTPMiddleware):
    """
    Middleware that dynamically checks the Origin header.
    Allows:
      1. Any origin in settings.BACKEND_CORS_ORIGINS (exact match)
      2. Any *.vercel.app subdomain (for Vercel preview deployments)
    """
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "")

        # Check if origin is allowed
        is_allowed = (
            origin in [str(o).rstrip("/") for o in settings.BACKEND_CORS_ORIGINS]
            or VERCEL_ORIGIN_PATTERN.match(origin)
        )

        # Handle preflight OPTIONS request
        if request.method == "OPTIONS" and is_allowed:
            response = Response(status_code=200)
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Max-Age"] = "600"
            return response

        response = await call_next(request)

        if is_allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "*"

        return response

# Register custom dynamic CORS middleware
app.add_middleware(DynamicCORSMiddleware)

# Also keep the standard CORS middleware as a fallback for explicit origins
app.add_middleware(
  CORSMiddleware,
  allow_origins=[str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Log allowed origins at startup for debugging
print(f"[CORS] Allowed origins: {settings.BACKEND_CORS_ORIGINS}")
print(f"[CORS] Dynamic pattern: *.vercel.app")

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["health"])
def health_check():
  return {
    "status": "healthy",
    "project": settings.PROJECT_NAME,
    "supabase_configured": settings.has_supabase
  }
