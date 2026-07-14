import asyncio
import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.core.security import get_current_user
from app.core.rate_limiting import rate_limit_check

router = APIRouter()

@router.get("/chat", dependencies=[Depends(rate_limit_check)])
def chat_stream(prompt: str, current_user: dict = Depends(get_current_user)):
    """
    Streams word-by-word business advice mimicking LLM token streaming.
    """
    async def event_generator():
        response_text = (
            "Analyzing active workspace parameters. Based on your current opex limits and Q3 projections, "
            "we suggest increasing your Raw Flour stock buffer by 25%. FreshFoods Wholesalers is still "
            "retaining a 96% reliability score, but switching to OrganicFoods Supply will save you 5.2% "
            "on opex if you can tolerate a 3-day delivery window extension."
        )
        words = response_text.split(" ")
        for word in words:
            yield f"{word} "
            await asyncio.sleep(0.06)

    return StreamingResponse(event_generator(), media_type="text/plain")
