"""WhatsApp webhook routes."""

from fastapi import APIRouter, Request, HTTPException
from app.config import get_settings
from app.services.whatsapp_bot import process_message
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])


@router.get("/webhook")
async def verify_webhook(mode: str = "", token: str = "", challenge: str = ""):
    """WhatsApp webhook verification (GET request from Meta)."""
    settings = get_settings()
    hub_mode = mode
    hub_token = token
    hub_challenge = challenge

    if hub_mode == "subscribe" and hub_token == settings.WHATSAPP_VERIFY_TOKEN:
        return int(hub_challenge)

    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/webhook")
async def receive_webhook(request: Request):
    """Receive incoming WhatsApp messages."""
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    # Process WhatsApp Cloud API payload
    try:
        entry = body.get("entry", [])
        for e in entry:
            changes = e.get("changes", [])
            for change in changes:
                value = change.get("value", {})
                messages = value.get("messages", [])

                for msg in messages:
                    phone = msg.get("from", "")
                    msg_type = msg.get("type", "")

                    if msg_type == "text":
                        text = msg.get("text", {}).get("body", "")
                        if text and phone:
                            response = await process_message(phone, text)
                            # In production, send response via WhatsApp API
                            # await send_whatsapp_message(phone, response)
                            logger.info(f"WhatsApp: {phone} -> {text[:50]}... | Response: {response[:50]}...")

    except Exception as e:
        logger.error(f"WhatsApp webhook error: {e}")

    # Always return 200 to acknowledge receipt
    return {"status": "ok"}
