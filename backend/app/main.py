from fastapi import FastAPI
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
# Single, authoritative CORS handler.
# Allows:
#   1. Any origin in settings.BACKEND_CORS_ORIGINS (exact match)
#   2. Any *.vercel.app subdomain (Vercel preview + production deployments)
#
# NOTE: Do NOT add a second CORSMiddleware — Starlette runs middlewares in
# reverse registration order, so a second one would execute FIRST and reject
# preflight requests before this handler ever sees them.
# ---------------------------------------------------------------------------

# Matches any Vercel deployment URL (preview or production)
VERCEL_ORIGIN_PATTERN = re.compile(r"^https://[a-zA-Z0-9-]+(?:-[a-zA-Z0-9]+)*\.vercel\.app$")

_CORS_HEADERS = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Origin, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "600",
}

class DynamicCORSMiddleware(BaseHTTPMiddleware):
    """
    Middleware that dynamically checks the Origin header and injects
    Access-Control-* headers for allowed origins.
    """
    def _is_origin_allowed(self, origin: str) -> bool:
        if not origin:
            return False
        explicit_origins = [str(o).rstrip("/") for o in settings.BACKEND_CORS_ORIGINS]
        return origin in explicit_origins or bool(VERCEL_ORIGIN_PATTERN.match(origin))

    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "")
        allowed = self._is_origin_allowed(origin)

        # Short-circuit preflight (OPTIONS) immediately
        if request.method == "OPTIONS":
            if allowed:
                response = Response(status_code=200)
                response.headers["Access-Control-Allow-Origin"] = origin
                for k, v in _CORS_HEADERS.items():
                    response.headers[k] = v
                return response
            # Return 204 without CORS headers for disallowed origins
            return Response(status_code=204)

        response = await call_next(request)

        if allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            for k, v in _CORS_HEADERS.items():
                response.headers[k] = v

        return response

# Register as the sole CORS middleware
app.add_middleware(DynamicCORSMiddleware)

# Log allowed origins at startup for debugging
print(f"[CORS] Explicit allowed origins: {settings.BACKEND_CORS_ORIGINS}")
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
