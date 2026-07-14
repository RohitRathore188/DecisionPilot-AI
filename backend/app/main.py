from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
  title=settings.PROJECT_NAME,
  openapi_url=f"{settings.API_V1_STR}/openapi.json",
  docs_url=f"{settings.API_V1_STR}/docs",
  redoc_url=f"{settings.API_V1_STR}/redoc",
)

# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------
# Root cause of the bug:
#   BaseHTTPMiddleware has a known Starlette issue where HTTP exceptions raised
#   inside route dependencies (e.g. HTTPBearer raising 403 on an OPTIONS
#   preflight that has no Authorization header) are handled by FastAPI's
#   exception handler and returned DIRECTLY — bypassing the middleware's
#   response path entirely. This means CORS headers never get attached to
#   those error responses, and the browser sees "No Access-Control-Allow-Origin".
#
# Fix:
#   Use FastAPI's built-in CORSMiddleware — it is a pure ASGI middleware
#   that intercepts ALL requests (including OPTIONS preflight) at a lower
#   level, before any route or dependency logic runs. It returns the
#   preflight response immediately, so HTTPBearer never sees it.
#   Use `allow_origin_regex` for *.vercel.app wildcard support.
# ---------------------------------------------------------------------------

_explicit_origins = [str(o).rstrip("/") for o in settings.BACKEND_CORS_ORIGINS]

# Matches any *.vercel.app URL (Vercel preview and production deployments)
_VERCEL_REGEX = r"https://[a-zA-Z0-9][a-zA-Z0-9\-]*\.vercel\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=_explicit_origins,
    allow_origin_regex=_VERCEL_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
    max_age=600,
)

# Log allowed origins at startup
print(f"[CORS] Explicit origins: {_explicit_origins}")
print(f"[CORS] Regex pattern: {_VERCEL_REGEX}")

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["health"])
def health_check():
  return {
    "status": "healthy",
    "project": settings.PROJECT_NAME,
    "supabase_configured": settings.has_supabase
  }
