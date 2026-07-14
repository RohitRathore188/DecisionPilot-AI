from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger("uvicorn.error")

supabase_client: Client = None

if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    try:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.info("Supabase client initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {str(e)}")
else:
    logger.warning("Supabase credentials missing. Running in local mock configuration.")
