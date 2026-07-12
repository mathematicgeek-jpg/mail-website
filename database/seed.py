"""
Database seeding script.
Seeds default game templates, approved testimonials, and 5 detailed blog posts into MongoDB.
"""

import asyncio
import os
import random
from uuid import uuid4
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load env from parent or local directory
load_dotenv()
load_dotenv("../backend/.env")

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "mathematics_geek")

print(f"Connecting to MongoDB at: {MONGO_URL}...")
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


# 1. TESTIMONIALS SEED DATA
TESTIMONIALS = [
    {
        "id": str(uuid4()),
        "name": "Rohan Malhotra (Parent of Shrey)",
        "student_class": "Class 10",
        "board": "ICSE",
        "rating": 5,
        "testimonial": "Aarti Ma'am completely transformed Shrey's attitude towards math. He went from struggling to secure passing marks to scoring a brilliant 94% in his ICSE board exams. Her focus on conceptual clarity and speed tricks works like magic.",
        "improvement": "52% to 94% score improvement",
        "approved": True,
        "created_at": (datetime.now(timezone.utc) - timedelta(days=12)).isoformat(),
    },
    {
        "id": str(uuid4()),
        "name": "Meera Sen (Parent of Ananya)",
        "student_class": "Class 12",
        "board": "CBSE",
        "rating": 5,
        "testimonial": "The G.R.A.F methodology is highly structured and effective. Ananya enjoyed the live sessions and learned Vedic math shortcuts that saved her a lot of time in her MCQ sections. Highly recommend Aarti Ma'am!",
        "improvement": "68% to 96% score improvement",
        "approved": True,
        "created_at": (datetime.now(timezone.utc) - timedelta(days=8)).isoformat(),
    },
    {
        "id": str(uuid4()),
        "name": "Devanshu Saxena",
        "student_class": "Class 10",
        "board": "CBSE",
        "rating": 5,
        "testimonial": "I used to get very anxious during math exams and make silly calculation mistakes. The mental math shortcuts and weekly diagnostic tests helped me build speed and double-check my answers quickly. Scored 98/100!",
        "improvement": "98/100 in board exam",
        "approved": True,
        "created_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat(),
    },
]


# 2. BLOG POSTS SEED DATA
BLOG_POSTS = [
    {
        "id": str(uuid4()),
        "title": "Complete Guide to Vedic Mathematics: 15 Powerful Techniques for Lightning-Fast Calculations",
        "slug": "vedic-mathematics-complete-guide-techniques",
        "category": "Vedic Mathematics",
        "tags": ["vedic math", "mental math", "calculation techniques", "exam preparation"],
        "excerpt": "Master 15 powerful Vedic Mathematics techniques that enable you to solve complex problems 10x faster. This comprehensive guide covers basic multiplication tricks to advanced shortcuts.",
        "read_time": 15,
        "featured_image": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80",
        "status": "published",
        "views": 184,
        "meta_title": "Complete Vedic Mathematics Guide: 15 Techniques for Fast Calculations",
        "meta_description": "Learn 15 powerful Vedic Math techniques for lightning-fast calculations. Comprehensive guide with examples, practice problems, and expert tips.",
        "meta_keywords": ["vedic mathematics", "fast calculation", "mental math tricks", "vedic math techniques"],
        "content": """
# Complete Guide to Vedic Mathematics: 15 Powerful Techniques for Lightning-Fast Calculations

Vedic Mathematics is an ancient Indian system of calculation that enables students to solve mathematical problems with remarkable speed and accuracy. In this comprehensive guide, you'll master 15 powerful techniques that can transform your mathematical abilities.

## What is Vedic Mathematics?

Vedic Mathematics is based on 16 Sutras (aphorisms) discovered by Bharati Krishna Tirthaji in the early 20th century. These techniques are not just shortcuts but represent a coherent system of mental calculation that improves problem-solving skills and mathematical confidence.

### Benefits of Vedic Mathematics:
- **10-15x faster calculations** compared to conventional methods
- **Improved mental agility** and concentration
- **Better exam performance** in competitive tests
- **Enhanced confidence** in mathematics
- **Reduced calculation errors**

## Technique 1: Vertically and Crosswise (Urdhva-Tiryagbhyam)

This is the crown jewel of Vedic Mathematics, used for multiplication of any two numbers.

**Example: 23 × 14**

Step 1: Multiply vertically (units): 3 × 4 = 12 (write 2, carry 1)
Step 2: Cross multiply: (2 × 4) + (3 × 1) = 8 + 3 = 11, plus carry 1 = 12 (write 2, carry 1)
Step 3: Multiply vertically (tens): 2 × 1 = 2, plus carry 1 = 3

**Answer: 322**

This technique works for any multiplication and is especially powerful for 2-digit and 3-digit numbers.

## Technique 2: All from 9 and Last from 10 (Nikhilam)

Perfect for multiplying numbers close to powers of 10 (90s, 900s, 9000s, etc.)

**Example: 98 × 97**

Step 1: Both numbers are close to 100
Step 2: Deficiency from 100: 98 → 2, 97 → 3
Step 3: Subtract cross-wise: 98 - 3 = 95 OR 97 - 2 = 95
Step 4: Multiply deficiencies: 2 × 3 = 06

**Answer: 9506**

## Technique 3: Squaring Numbers Ending in 5

Instant squaring for any number ending in 5!

**Formula:** n5² = n(n+1) | 25

**Example: 75²**
- Take 7, multiply by 8: 7 × 8 = 56
- Append 25: 5625

## Practice Tips for Mastering Vedic Math

1. **Start with easy numbers**: Build confidence before tackling complex problems.
2. **Daily practice**: 15-20 minutes per day for 30 days shows dramatic improvement.
3. **Use real exam problems**: Apply techniques to past papers.
        """,
        "created_at": (datetime.now(timezone.utc) - timedelta(days=20)).isoformat(),
        "updated_at": (datetime.now(timezone.utc) - timedelta(days=20)).isoformat(),
    },
    {
        "id": str(uuid4()),
        "title": "CBSE Class 10 Mathematics Board Exam 2026: Complete Preparation Strategy",
        "slug": "cbse-class-10-maths-board-exam-preparation-strategy",
        "category": "Exam Preparation",
        "tags": ["CBSE", "class 10", "board exams", "exam strategy", "mathematics"],
        "excerpt": "Comprehensive preparation strategy for CBSE Class 10 Mathematics Board Exam 2026. Important questions, chapter-wise breakdown, and marking scheme insights.",
        "read_time": 12,
        "featured_image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
        "status": "published",
        "views": 245,
        "meta_title": "CBSE Class 10 Maths Board Exam 2026: Complete Preparation Guide",
        "meta_description": "Expert preparation strategy for CBSE Class 10 Maths 2026. Chapter-wise tips, important questions, marking scheme, time management. Score 95%+",
        "meta_keywords": ["CBSE class 10 maths", "board exam preparation", "CBSE 2026", "exam strategy"],
        "content": """
# CBSE Class 10 Mathematics Board Exam 2026: Complete Preparation Strategy

The CBSE Class 10 Mathematics Board Exam is a crucial milestone that shapes your academic future. This comprehensive guide provides a proven strategy to score 95%+ based on the latest CBSE pattern and expert analysis.

## Understanding the CBSE Class 10 Maths Paper Pattern 2026

### Paper Structure:
- **Duration:** 3 hours
- **Maximum Marks:** 80 (+ 20 Internal Assessment)
- **Sections:** 5 sections (A, B, C, D, E)

### Section-wise Breakdown:
- **Section A:** 20 MCQs × 1 mark = 20 marks
- **Section B:** 5 VSA questions × 2 marks = 10 marks
- **Section C:** 6 SA questions × 3 marks = 18 marks
- **Section D:** 4 LA questions × 5 marks = 20 marks
- **Section E:** 3 Case Studies × 4 marks = 12 marks

## High Weightage Chapters & Strategy

### 1. Trigonometry (10-12 marks)
- Memorize all identities perfectly.
- Practice identity proofs daily.
- Master word problems on heights & distances.

### 2. Coordinate Geometry (6-8 marks)
- Master the distance formula and section formula.
- Focus on application-based questions.

### 3. Quadratic Equations (6-8 marks)
- Practice 100+ factorization problems.
- Focus on age, speed-distance, and work problems.

## Month-wise Preparation Strategy

- **November - December (Syllabus Completion):** Complete entire syllabus, make formula sheets, understand all concepts.
- **January - Early February (Practice Phase):** Solve 10 complete sample papers, identify weak areas.
- **Mid-February - Exam Day (Revision & Perfection):** Revise entire syllabus twice, mock tests in exam conditions.
        """,
        "created_at": (datetime.now(timezone.utc) - timedelta(days=15)).isoformat(),
        "updated_at": (datetime.now(timezone.utc) - timedelta(days=15)).isoformat(),
    },
    {
        "id": str(uuid4()),
        "title": "10 Mental Math Tricks Every Student Should Know for Faster Calculations",
        "slug": "10-mental-math-tricks-faster-calculations",
        "category": "Mental Math",
        "tags": ["mental math", "calculation tricks", "study tips"],
        "excerpt": "Learn 10 powerful mental math tricks that will help you calculate faster and more accurately. Perfect for students preparing for competitive exams.",
        "read_time": 7,
        "featured_image": "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1200&q=80",
        "status": "published",
        "views": 98,
        "meta_title": "10 Mental Math Tricks for Faster Calculations | Student Guide",
        "meta_description": "Master 10 essential mental math tricks for lightning-fast calculations. Perfect for exam preparation and daily problem-solving.",
        "meta_keywords": ["mental math tricks", "fast calculation", "math shortcuts"],
        "content": """
# 10 Mental Math Tricks Every Student Should Know

Mental math is a superpower that can transform your performance in exams and daily life. Here are 10 essential tricks every student should master:

## 1. Multiplying by 11
- For a 2-digit number (e.g. 43 × 11), add the two digits: 4 + 3 = 7.
- Place the sum in the middle: **473**.

## 2. Multiplying by 9, 99, 999
- To multiply a number by 99 (e.g. 47 × 99), subtract 1 from the number: 47 - 1 = 46.
- Subtract that result from 99: 99 - 46 = 53.
- Combined answer: **4653**.

## 3. Multiplying large numbers by 5
- Divide the number by 2, then multiply by 10 (add a zero at the end).
- Example: 248 × 5 → 248 / 2 = 124 → add zero: **1240**.
        """,
        "created_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat(),
        "updated_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat(),
    },
    {
        "id": str(uuid4()),
        "title": "How to Master Algebra: Complete Guide for Class 8-10 Students",
        "slug": "master-algebra-guide-class-8-10",
        "category": "Algebra",
        "tags": ["algebra", "class 8", "class 9", "class 10"],
        "excerpt": "Comprehensive guide to mastering algebra with step-by-step explanations, practice problems, and expert tips for students in Classes 8-10.",
        "read_time": 10,
        "featured_image": "https://images.unsplash.com/photo-1596495578065-6e0763fa1141?w=1200&q=80",
        "status": "published",
        "views": 154,
        "meta_title": "Master Algebra: Complete Guide for Class 8-10 Students",
        "meta_description": "Learn algebra fundamentals to advanced concepts. Complete guide for Classes 8-10 with examples, practice problems, and expert tips.",
        "meta_keywords": ["algebra guide", "class 8 algebra", "class 9 algebra", "class 10 algebra"],
        "content": """
# How to Master Algebra: Complete Guide for Class 8-10 Students

Algebra is the foundation of higher mathematics. Many students find it challenging because it introduces variables (letters) instead of just numbers. This comprehensive guide will take you from basics to advanced concepts.

## 1. Understand the Variables
- Variables (like x, y, z) represent unknown values.
- Treat variables like placeholders or boxes containing numbers.

## 2. Master the Balance Rule (Equations)
- An equation is like a balance scale. Whatever operation you perform on one side, you must perform on the other side.
- To isolate the variable, perform inverse operations (e.g. subtract if there is addition, divide if there is multiplication).

## 3. Practice Quadratic Expressions
- Learn factoring techniques early.
- Master the quadratic formula: x = [-b ± √(b² - 4ac)] / 2a.
        """,
        "created_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(),
        "updated_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(),
    },
    {
        "id": str(uuid4()),
        "title": "Geometry Made Easy: Essential Theorems and Proofs for ICSE Students",
        "slug": "geometry-made-easy-icse-theorems-proofs",
        "category": "Geometry",
        "tags": ["geometry", "ICSE", "theorems", "proofs"],
        "excerpt": "Master essential geometry theorems and proofs with clear explanations and visual aids. Specifically designed for ICSE curriculum students.",
        "read_time": 8,
        "featured_image": "https://images.unsplash.com/photo-1453733190148-c44698c26588?w=1200&q=80",
        "status": "published",
        "views": 112,
        "meta_title": "Geometry Theorems & Proofs Made Easy for ICSE Students",
        "meta_description": "Learn essential geometry theorems and proofs for ICSE exams. Clear explanations, diagrams, and practice problems included.",
        "meta_keywords": ["geometry theorems", "ICSE geometry", "geometry proofs"],
        "content": """
# Geometry Made Easy: Essential Theorems and Proofs for ICSE Students

Geometry can seem daunting, but with the right approach, it becomes highly logical and enjoyable. Here are the key theorems and proofs you need to master for your ICSE exams:

## 1. Circle Theorems
- **Angle at Center Theorem:** The angle subtended by an arc at the center is double the angle subtended by it at any point on the remaining part of the circle.
- **Angles in Same Segment:** Angles subtended by the same arc in the same segment of a circle are equal.
- **Cyclic Quadrilateral:** The opposite angles of a cyclic quadrilateral are supplementary (add up to 180°).

## 2. Tangent Properties
- The tangent at any point on a circle is perpendicular to the radius through the point of contact.
- If two tangents are drawn to a circle from an external point, their lengths are equal.
        """,
        "created_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat(),
        "updated_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat(),
    },
]


async def seed_all():
    # Insert Testimonials
    await db.testimonials.delete_many({})
    await db.testimonials.insert_many(TESTIMONIALS)
    print(f"✅ Seeded {len(TESTIMONIALS)} testimonials")

    # Insert Blogs
    await db.blog_posts.delete_many({})
    await db.blog_posts.insert_many(BLOG_POSTS)
    print(f"✅ Seeded {len(BLOG_POSTS)} blog posts")

    print("🎉 Database seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed_all())
