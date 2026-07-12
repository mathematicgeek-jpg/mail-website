"""
WhatsApp Bot service — conversation state machine and lead capture.
Designed for WhatsApp Business Cloud API webhooks.
"""

from datetime import datetime, timezone
from typing import Dict, Any, Optional
from app.database import get_db
from app.services.question_generator import generate_questions
from uuid import uuid4


# Conversation states
STATES = {
    "START": "start",
    "AWAITING_NAME": "awaiting_name",
    "AWAITING_CLASS": "awaiting_class",
    "AWAITING_INTEREST": "awaiting_interest",
    "CHALLENGE_SENT": "challenge_sent",
    "DEMO_OFFERED": "demo_offered",
    "COMPLETED": "completed",
}


# Bot messages
MESSAGES = {
    "welcome": (
        "🎓 Welcome to *Mathematics Geek*!\n\n"
        "I'm your math assistant. I can help you with:\n"
        "1️⃣ Book a FREE demo class\n"
        "2️⃣ Try a quick math challenge 🧠\n"
        "3️⃣ Learn about our courses\n\n"
        "Reply with 1, 2, or 3 to get started!"
    ),
    "ask_name": "Great choice! Let's get you started. 😊\n\nWhat's your name?",
    "ask_class": "Nice to meet you, {name}! 👋\n\nWhich class are you in? (e.g., Class 8, Class 10)",
    "ask_interest": (
        "Thanks! Which subject interests you most?\n\n"
        "1️⃣ Vedic Mathematics\n"
        "2️⃣ Board Exam Prep (CBSE/ICSE/IB)\n"
        "3️⃣ Mental Math & Speed Calculation\n"
        "4️⃣ Olympiad Preparation\n\n"
        "Reply with 1-4"
    ),
    "demo_offer": (
        "🎉 Awesome, {name}! We'd love to help you excel in math!\n\n"
        "📅 *FREE Demo Class Available*\n"
        "Our expert teacher Aarti Agarwal will personally guide you.\n\n"
        "📞 Call/WhatsApp: +91 9639351708\n"
        "🌐 Book online: mathematicsgeek.com\n\n"
        "We'll reach out to you shortly! 🙏"
    ),
    "challenge_intro": (
        "🧠 *Quick Math Challenge!*\n\n"
        "Let's test your speed! Here's a problem:\n\n"
        "❓ *{question}*\n\n"
        "Reply with your answer!"
    ),
    "challenge_correct": (
        "✅ *Correct!* 🎉 You got it!\n\n"
        "{explanation}\n\n"
        "Want to learn more tricks like this?\n"
        "📱 Try our free math games: mathematicsgeek.com/games\n"
        "📅 Or book a FREE demo: Reply DEMO"
    ),
    "challenge_wrong": (
        "❌ Not quite! The answer is *{answer}*.\n\n"
        "{explanation}\n\n"
        "Want to master these techniques?\n"
        "📱 Try our free math games: mathematicsgeek.com/games\n"
        "📅 Or book a FREE demo: Reply DEMO"
    ),
    "courses_info": (
        "📚 *Our Programs:*\n\n"
        "🔹 *Foundation (Class 6-8)*\n"
        "  Strong basics + Vedic Math\n\n"
        "🔹 *Board Prep (Class 9-10)*\n"
        "  CBSE/ICSE/IB targeted preparation\n\n"
        "🔹 *Advanced (Class 11-12)*\n"
        "  Calculus, Algebra, Competitive exams\n\n"
        "🔹 *Vedic Mathematics*\n"
        "  Speed calculation mastery\n\n"
        "💡 All programs include personalized attention!\n\n"
        "Reply DEMO to book a free class!"
    ),
}


async def get_or_create_conversation(phone: str) -> Dict[str, Any]:
    """Get existing conversation or create new one."""
    db = get_db()
    conv = await db.whatsapp_conversations.find_one({"phone": phone}, {"_id": 0})

    if not conv:
        conv = {
            "id": str(uuid4()),
            "phone": phone,
            "state": STATES["START"],
            "context": {},
            "messages": [],
            "lead_id": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.whatsapp_conversations.insert_one(conv)

    return conv


async def process_message(phone: str, message: str) -> str:
    """Process incoming WhatsApp message and return response."""
    db = get_db()
    conv = await get_or_create_conversation(phone)
    state = conv.get("state", STATES["START"])
    context = conv.get("context", {})
    msg = message.strip().lower()

    response = ""
    new_state = state

    if state == STATES["START"]:
        if msg in ["1", "demo", "book"]:
            response = MESSAGES["ask_name"]
            new_state = STATES["AWAITING_NAME"]
        elif msg in ["2", "challenge", "quiz"]:
            questions = generate_questions(topic="mental_math", difficulty=2, count=1)
            if questions:
                q = questions[0]
                context["challenge_question"] = q
                response = MESSAGES["challenge_intro"].format(question=q["text"])
                new_state = STATES["CHALLENGE_SENT"]
            else:
                response = "Let's try a quick one: What is 17 × 13? Reply with your answer!"
                context["challenge_question"] = {"correct_answer": "221", "explanation": "17 × 13 = 221"}
                new_state = STATES["CHALLENGE_SENT"]
        elif msg in ["3", "courses", "info"]:
            response = MESSAGES["courses_info"]
        else:
            response = MESSAGES["welcome"]

    elif state == STATES["AWAITING_NAME"]:
        context["name"] = message.strip().title()
        response = MESSAGES["ask_class"].format(name=context["name"])
        new_state = STATES["AWAITING_CLASS"]

    elif state == STATES["AWAITING_CLASS"]:
        context["class"] = message.strip()
        response = MESSAGES["ask_interest"]
        new_state = STATES["AWAITING_INTEREST"]

    elif state == STATES["AWAITING_INTEREST"]:
        interests = {"1": "Vedic Mathematics", "2": "Board Exam Prep", "3": "Mental Math", "4": "Olympiad Prep"}
        context["interest"] = interests.get(msg, message.strip())

        # Create lead
        lead = {
            "id": str(uuid4()),
            "name": context.get("name", "WhatsApp Lead"),
            "phone": phone,
            "student_class": context.get("class", ""),
            "board": "",
            "preferred_mode": "",
            "message": f"Interest: {context.get('interest', '')}",
            "source": "whatsapp",
            "status": "pending",
            "whatsapp_engaged": True,
            "tags": ["whatsapp", context.get("interest", "").lower().replace(" ", "_")],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

        try:
            await db.leads.insert_one(lead)
            context["lead_id"] = lead["id"]
        except Exception:
            # Phone number might already exist as a lead
            await db.leads.update_one(
                {"phone": phone},
                {"$set": {"whatsapp_engaged": True, "updated_at": datetime.now(timezone.utc).isoformat()}},
            )

        response = MESSAGES["demo_offer"].format(name=context.get("name", ""))
        new_state = STATES["COMPLETED"]

    elif state == STATES["CHALLENGE_SENT"]:
        q = context.get("challenge_question", {})
        correct = str(q.get("correct_answer", ""))

        if msg == correct.lower():
            response = MESSAGES["challenge_correct"].format(explanation=q.get("explanation", ""))
        else:
            response = MESSAGES["challenge_wrong"].format(answer=correct, explanation=q.get("explanation", ""))

        new_state = STATES["DEMO_OFFERED"]

    elif state in [STATES["DEMO_OFFERED"], STATES["COMPLETED"]]:
        if msg in ["demo", "book", "yes", "1"]:
            response = MESSAGES["ask_name"]
            new_state = STATES["AWAITING_NAME"]
            context = {}  # Reset context for new flow
        else:
            response = MESSAGES["welcome"]
            new_state = STATES["START"]
            context = {}

    # Update conversation
    messages_log = conv.get("messages", [])
    messages_log.append({"role": "user", "content": message, "timestamp": datetime.now(timezone.utc).isoformat()})
    messages_log.append({"role": "bot", "content": response, "timestamp": datetime.now(timezone.utc).isoformat()})

    await db.whatsapp_conversations.update_one(
        {"phone": phone},
        {
            "$set": {
                "state": new_state,
                "context": context,
                "messages": messages_log,
                "lead_id": context.get("lead_id"),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )

    return response
