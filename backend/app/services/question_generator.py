"""
AI-powered math question generator.
Generates infinite questions algorithmically — no external API needed.
Covers: arithmetic, algebra, geometry, vedic math, percentages, fractions.
"""

import random
import math
from typing import List, Dict, Any, Union


# Topic configurations with difficulty scaling
TOPIC_CONFIGS = {
    "addition": {
        "name": "Addition",
        "class_range": [6, 7, 8],
        "generator": "_gen_addition",
    },
    "subtraction": {
        "name": "Subtraction",
        "class_range": [6, 7, 8],
        "generator": "_gen_subtraction",
    },
    "multiplication": {
        "name": "Multiplication",
        "class_range": [6, 7, 8, 9, 10],
        "generator": "_gen_multiplication",
    },
    "division": {
        "name": "Division",
        "class_range": [6, 7, 8, 9],
        "generator": "_gen_division",
    },
    "squares": {
        "name": "Squares & Square Roots",
        "class_range": [7, 8, 9, 10],
        "generator": "_gen_squares",
    },
    "cubes": {
        "name": "Cubes & Cube Roots",
        "class_range": [8, 9, 10],
        "generator": "_gen_cubes",
    },
    "percentages": {
        "name": "Percentages",
        "class_range": [7, 8, 9, 10],
        "generator": "_gen_percentages",
    },
    "fractions": {
        "name": "Fractions",
        "class_range": [6, 7, 8],
        "generator": "_gen_fractions",
    },
    "algebra": {
        "name": "Algebra",
        "class_range": [8, 9, 10, 11, 12],
        "generator": "_gen_algebra",
    },
    "vedic_multiplication": {
        "name": "Vedic Multiplication",
        "class_range": [6, 7, 8, 9, 10, 11, 12],
        "generator": "_gen_vedic_multiplication",
    },
    "vedic_squares": {
        "name": "Vedic Squaring",
        "class_range": [7, 8, 9, 10, 11, 12],
        "generator": "_gen_vedic_squares",
    },
    "mental_math": {
        "name": "Mental Math",
        "class_range": [6, 7, 8, 9, 10],
        "generator": "_gen_mental_math",
    },
}


def _difficulty_range(difficulty: int) -> tuple:
    """Return (min_num, max_num) based on difficulty 1-5."""
    ranges = {
        1: (2, 20),
        2: (10, 50),
        3: (20, 100),
        4: (50, 500),
        5: (100, 999),
    }
    return ranges.get(difficulty, (2, 20))


def _gen_wrong_options(correct: Union[int, float], count: int = 3) -> List[Union[int, float]]:
    """Generate plausible wrong answers near the correct answer."""
    wrong = set()
    attempts = 0
    while len(wrong) < count and attempts < 50:
        attempts += 1
        if isinstance(correct, float):
            offset = round(random.uniform(-abs(correct) * 0.3, abs(correct) * 0.3), 2)
            if offset == 0:
                offset = round(random.uniform(0.1, 2.0), 2)
            candidate = round(correct + offset, 2)
        else:
            spread = max(5, abs(correct) // 4)
            offset = random.randint(-spread, spread)
            if offset == 0:
                offset = random.choice([-1, 1, -2, 2])
            candidate = correct + offset
        if candidate != correct and candidate > 0:
            wrong.add(candidate)
    return list(wrong)[:count]


def _gen_addition(difficulty: int) -> Dict[str, Any]:
    lo, hi = _difficulty_range(difficulty)
    a, b = random.randint(lo, hi), random.randint(lo, hi)
    correct = a + b
    return {
        "text": f"What is {a} + {b}?",
        "correct_answer": str(correct),
        "explanation": f"{a} + {b} = {correct}",
    }


def _gen_subtraction(difficulty: int) -> Dict[str, Any]:
    lo, hi = _difficulty_range(difficulty)
    a, b = random.randint(lo, hi), random.randint(lo, hi)
    if b > a:
        a, b = b, a
    correct = a - b
    return {
        "text": f"What is {a} − {b}?",
        "correct_answer": str(correct),
        "explanation": f"{a} − {b} = {correct}",
    }


def _gen_multiplication(difficulty: int) -> Dict[str, Any]:
    ranges = {1: (2, 12), 2: (5, 20), 3: (10, 30), 4: (12, 50), 5: (20, 99)}
    lo, hi = ranges.get(difficulty, (2, 12))
    a, b = random.randint(lo, hi), random.randint(lo, hi)
    correct = a * b
    return {
        "text": f"What is {a} × {b}?",
        "correct_answer": str(correct),
        "explanation": f"{a} × {b} = {correct}",
    }


def _gen_division(difficulty: int) -> Dict[str, Any]:
    ranges = {1: (2, 10), 2: (3, 15), 3: (5, 25), 4: (7, 50), 5: (10, 99)}
    lo, hi = ranges.get(difficulty, (2, 10))
    b = random.randint(lo, hi)
    correct = random.randint(lo, hi)
    a = b * correct  # ensures clean division
    return {
        "text": f"What is {a} ÷ {b}?",
        "correct_answer": str(correct),
        "explanation": f"{a} ÷ {b} = {correct}",
    }


def _gen_squares(difficulty: int) -> Dict[str, Any]:
    ranges = {1: (2, 10), 2: (5, 15), 3: (10, 25), 4: (15, 40), 5: (20, 99)}
    lo, hi = ranges.get(difficulty, (2, 10))
    n = random.randint(lo, hi)
    if random.random() < 0.5:
        correct = n * n
        return {
            "text": f"What is {n}²?",
            "correct_answer": str(correct),
            "explanation": f"{n}² = {n} × {n} = {correct}",
        }
    else:
        sq = n * n
        return {
            "text": f"What is √{sq}?",
            "correct_answer": str(n),
            "explanation": f"√{sq} = {n} because {n} × {n} = {sq}",
        }


def _gen_cubes(difficulty: int) -> Dict[str, Any]:
    ranges = {1: (2, 5), 2: (3, 8), 3: (5, 12), 4: (7, 15), 5: (10, 20)}
    lo, hi = ranges.get(difficulty, (2, 5))
    n = random.randint(lo, hi)
    correct = n ** 3
    return {
        "text": f"What is {n}³?",
        "correct_answer": str(correct),
        "explanation": f"{n}³ = {n} × {n} × {n} = {correct}",
    }


def _gen_percentages(difficulty: int) -> Dict[str, Any]:
    percentages = {
        1: [10, 20, 25, 50],
        2: [5, 15, 25, 30, 50, 75],
        3: [12, 15, 20, 33, 40, 60],
        4: [7, 13, 17, 23, 37, 43],
        5: [3, 7, 11, 13, 17, 19, 23],
    }
    pcts = percentages.get(difficulty, [10, 25, 50])
    p = random.choice(pcts)
    base_ranges = {1: (20, 100), 2: (50, 200), 3: (100, 500), 4: (200, 1000), 5: (500, 5000)}
    lo, hi = base_ranges.get(difficulty, (20, 100))
    base = random.randint(lo // 10, hi // 10) * 10  # keep it round-ish
    correct = base * p / 100
    if correct == int(correct):
        correct = int(correct)
    return {
        "text": f"What is {p}% of {base}?",
        "correct_answer": str(correct),
        "explanation": f"{p}% of {base} = {base} × {p}/100 = {correct}",
    }


def _gen_fractions(difficulty: int) -> Dict[str, Any]:
    denoms = {1: [2, 4, 5], 2: [3, 4, 6, 8], 3: [5, 7, 8, 9], 4: [6, 7, 9, 11], 5: [7, 11, 13]}
    d1 = random.choice(denoms.get(difficulty, [2, 4]))
    d2 = random.choice(denoms.get(difficulty, [2, 4]))
    n1 = random.randint(1, d1 - 1)
    n2 = random.randint(1, d2 - 1)
    op = random.choice(["+", "−"])
    if op == "+":
        correct_num = n1 * d2 + n2 * d1
    else:
        correct_num = n1 * d2 - n2 * d1
    correct_den = d1 * d2
    g = math.gcd(abs(correct_num), correct_den)
    correct_num //= g
    correct_den //= g
    if correct_den == 1:
        answer = str(correct_num)
    else:
        answer = f"{correct_num}/{correct_den}"
    return {
        "text": f"What is {n1}/{d1} {op} {n2}/{d2}?",
        "correct_answer": answer,
        "explanation": f"{n1}/{d1} {op} {n2}/{d2} = {answer}",
    }


def _gen_algebra(difficulty: int) -> Dict[str, Any]:
    """Generate simple linear equations."""
    ranges = {1: (1, 10), 2: (2, 15), 3: (3, 25), 4: (5, 50), 5: (10, 100)}
    lo, hi = ranges.get(difficulty, (1, 10))
    x = random.randint(lo, hi)
    a = random.randint(2, 10)
    b = random.randint(1, 20)
    result = a * x + b
    return {
        "text": f"If {a}x + {b} = {result}, find x.",
        "correct_answer": str(x),
        "explanation": f"{a}x + {b} = {result} → {a}x = {result - b} → x = {(result - b)}/{a} = {x}",
    }


def _gen_vedic_multiplication(difficulty: int) -> Dict[str, Any]:
    """Generate multiplication problems suited for Vedic math techniques."""
    templates = [
        # Numbers close to 100 (Nikhilam)
        lambda: (random.randint(90, 99), random.randint(90, 99)),
        # Numbers close to 1000
        lambda: (random.randint(990, 999), random.randint(990, 999)),
        # Numbers ending in 5
        lambda: (random.randint(2, 9) * 10 + 5, random.randint(2, 9) * 10 + 5),
        # Multiplication by 11
        lambda: (random.randint(10, 99), 11),
    ]
    d = min(difficulty, len(templates))
    a, b = templates[d - 1]()
    correct = a * b
    return {
        "text": f"Using Vedic math, calculate {a} × {b}",
        "correct_answer": str(correct),
        "explanation": f"{a} × {b} = {correct}. Try the Nikhilam or Urdhva-Tiryagbhyam sutra!",
    }


def _gen_vedic_squares(difficulty: int) -> Dict[str, Any]:
    """Generate squaring problems suited for Vedic techniques."""
    ranges = {1: (11, 19), 2: (21, 29), 3: (31, 49), 4: (51, 79), 5: (81, 99)}
    lo, hi = ranges.get(difficulty, (11, 19))
    n = random.randint(lo, hi)
    correct = n * n
    if n % 10 == 5:
        explanation = f"{n}² = {(n // 10) * (n // 10 + 1)}|25 = {correct}"
    else:
        explanation = f"{n}² = {correct}"
    return {
        "text": f"What is {n}²?",
        "correct_answer": str(correct),
        "explanation": explanation,
    }


def _gen_mental_math(difficulty: int) -> Dict[str, Any]:
    """Mixed mental math challenges."""
    generators = [_gen_addition, _gen_subtraction, _gen_multiplication, _gen_percentages]
    gen = random.choice(generators)
    return gen(difficulty)


# Generator dispatcher
_GENERATORS = {
    "_gen_addition": _gen_addition,
    "_gen_subtraction": _gen_subtraction,
    "_gen_multiplication": _gen_multiplication,
    "_gen_division": _gen_division,
    "_gen_squares": _gen_squares,
    "_gen_cubes": _gen_cubes,
    "_gen_percentages": _gen_percentages,
    "_gen_fractions": _gen_fractions,
    "_gen_algebra": _gen_algebra,
    "_gen_vedic_multiplication": _gen_vedic_multiplication,
    "_gen_vedic_squares": _gen_vedic_squares,
    "_gen_mental_math": _gen_mental_math,
}


def generate_questions(
    topic: str = "mental_math",
    difficulty: int = 2,
    count: int = 10,
    include_options: bool = True,
) -> List[Dict[str, Any]]:
    """
    Generate a set of math questions.

    Args:
        topic: Question topic (from TOPIC_CONFIGS keys)
        difficulty: 1-5
        count: Number of questions to generate
        include_options: Whether to generate multiple-choice options

    Returns:
        List of question dicts with text, options, correct_answer, explanation
    """
    config = TOPIC_CONFIGS.get(topic, TOPIC_CONFIGS["mental_math"])
    gen_name = config["generator"]
    gen_func = _GENERATORS[gen_name]

    questions = []
    seen = set()

    attempts = 0
    while len(questions) < count and attempts < count * 5:
        attempts += 1
        q = gen_func(difficulty)

        # Deduplicate
        if q["text"] in seen:
            continue
        seen.add(q["text"])

        q["topic"] = topic
        q["difficulty"] = difficulty
        q["id"] = f"{topic}_{difficulty}_{len(questions)}_{random.randint(1000, 9999)}"

        if include_options:
            try:
                correct_val = int(q["correct_answer"]) if "/" not in q["correct_answer"] else None
            except ValueError:
                correct_val = None

            if correct_val is not None:
                wrong = _gen_wrong_options(correct_val)
                options = [str(correct_val)] + [str(w) for w in wrong]
                random.shuffle(options)
                q["options"] = options
            else:
                q["options"] = [q["correct_answer"]]

        questions.append(q)

    return questions


def get_available_topics() -> List[Dict[str, Any]]:
    """Return list of available topics with metadata."""
    return [
        {
            "id": key,
            "name": config["name"],
            "class_range": config["class_range"],
        }
        for key, config in TOPIC_CONFIGS.items()
    ]
