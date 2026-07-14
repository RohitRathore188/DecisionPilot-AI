from fastapi import Request, HTTPException, status
import time
from typing import Dict

class RateLimiter:
    def __init__(self, requests_limit: int = 100, window_seconds: int = 60):
        self.limit = requests_limit
        self.window = window_seconds
        self.clients: Dict[str, list] = {}

    def check_limit(self, client_ip: str) -> bool:
        now = time.time()
        if client_ip not in self.clients:
            self.clients[client_ip] = []
        
        # Keep only timestamps within active window
        self.clients[client_ip] = [t for t in self.clients[client_ip] if now - t < self.window]
        
        if len(self.clients[client_ip]) >= self.limit:
            return True
        
        self.clients[client_ip].append(now)
        return False

limiter = RateLimiter()

def rate_limit_check(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    if limiter.check_limit(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Maximum 100 requests per minute."
        )
