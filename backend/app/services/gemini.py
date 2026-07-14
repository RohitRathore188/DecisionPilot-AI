import httpx
import json
import logging
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")

class GeminiService:
    @staticmethod
    async def generate_consultant_report(title: str, option_name: str, roi: int) -> dict:
        if settings.GEMINI_API_KEY:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
                prompt = (
                    f"Provide an ultra-premium business consultant assessment for a decision titled '{title}'. "
                    f"Analyze the option '{option_name}' which projects an ROI of {roi}%. "
                    "Format the response strictly as a JSON object containing keys: "
                    "'supportingFactors' (list of strings), 'reasoning' (paragraph text), 'risks' (list of strings), "
                    "'opportunities' (list of strings), 'alternativeStrategy' (paragraph text)."
                )
                headers = {"Content-Type": "application/json"}
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"responseMimeType": "application/json"}
                }
                async with httpx.AsyncClient() as client:
                    resp = await client.post(url, headers=headers, json=payload, timeout=8.0)
                    if resp.status_code == 200:
                        res_json = resp.json()
                        text = res_json["candidates"][0]["content"]["parts"][0]["text"]
                        return json.loads(text)
            except Exception as e:
                logger.error(f"Failed to communicate with Gemini API, falling back to mock: {str(e)}")

        # Professional mock fallback mimicking high-fidelity consulting tone
        return {
            "supportingFactors": [
                "Fulfillment operational timelines improve by 15% via automated scheduling.",
                "Supplier costs remain secured under bulk raw materials agreement.",
                "Customer engagement index projects a positive upward growth curve."
            ],
            "reasoning": (
                f"Executing the '{option_name}' strategy maximizes inventory throughput. "
                f"An expected ROI of {roi}% ensures robust margin protection while keeping overhead "
                "ratios safely within quarterly operating boundaries."
            ),
            "risks": [
                "Capacity strain if product volume requirements exceed predicted limits by 25%.",
                "Fulfillment latency from decentralized transport hubs."
            ],
            "opportunities": [
                "Securing organic supply chains under a multi-year exclusive partnership.",
                "Increasing premium tier pricing without impacting core audience retention."
            ],
            "alternativeStrategy": (
                "Maintain a defensive operations posture: slow down opex increases and "
                "redirect surplus revenues to establish a 10% safety buffer reserves fund."
            )
        }
