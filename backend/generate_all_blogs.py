import asyncio
import os
import random
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from uuid import uuid4

load_dotenv()
load_dotenv("./backend/.env")

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")

print(f"Connecting to MongoDB at: {MONGO_URL}, database: {DB_NAME}...")
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

BLOG_METADATA = [
    # Pillar Guides
    {
        "title": "Complete Guide to Vedic Mathematics: 15 Powerful Techniques for Lightning-Fast Calculations",
        "slug": "vedic-mathematics-complete-guide-techniques",
        "category": "Vedic Mathematics",
        "tags": ["vedic math", "mental math", "calculation techniques", "exam preparation"],
        "excerpt": "Master 15 powerful Vedic Mathematics techniques that enable you to solve complex problems 10x faster. Basic multiplication tricks to advanced shortcuts.",
        "read_time": 15
    },
    {
        "title": "CBSE Class 10 Mathematics Board Exam 2026: Complete Preparation Strategy",
        "slug": "cbse-class-10-maths-board-exam-preparation-strategy",
        "category": "Exam Preparation",
        "tags": ["CBSE", "class 10", "board exams", "exam strategy", "mathematics"],
        "excerpt": "Comprehensive preparation strategy for CBSE Class 10 Mathematics Board Exam 2026. Important questions, chapter-wise breakdown, and marking schemes.",
        "read_time": 12
    },
    {
        "title": "ICSE Class 10 Mathematics Exam Guide: Scoring 95%+ Strategy",
        "slug": "icse-class-10-mathematics-exam-guide-scoring-95-strategy",
        "category": "Exam Preparation",
        "tags": ["ICSE", "class 10", "board exams", "scoring strategy", "mathematics"],
        "excerpt": "Learn the step-by-step roadmap to score 95%+ in the ICSE Class 10 Mathematics board exam. Chapter-wise analysis, time-saving tricks, and presentation tips.",
        "read_time": 11
    },
    {
        "title": "IB Mathematics: Complete Guide for Analysis & Approaches",
        "slug": "ib-mathematics-complete-guide-analysis-approaches",
        "category": "Exam Preparation",
        "tags": ["IB", "IB Math AA", "Analysis and Approaches", "curriculum guide"],
        "excerpt": "Master the rigorous IB Mathematics Analysis & Approaches (AA) syllabus. Insights on internal assessment, exam patterns, and conceptual revision.",
        "read_time": 14
    },
    {
        "title": "GCSE Mathematics Higher Tier: Complete Success Guide",
        "slug": "gcse-mathematics-higher-tier-complete-success-guide",
        "category": "Exam Preparation",
        "tags": ["GCSE", "Higher Tier", "GCSE maths", "exam success"],
        "excerpt": "Crucial strategies and resources to secure a Grade 9 in GCSE Mathematics Higher Tier. Key topics, past paper analysis, and common examiner traps.",
        "read_time": 12
    },
    
    # Vedic Math & Mental Math
    {
        "title": "10 Mental Math Tricks Every Student Should Know for Faster Calculations",
        "slug": "10-mental-math-tricks-faster-calculations",
        "category": "Mental Math",
        "tags": ["mental math", "calculation tricks", "study tips"],
        "excerpt": "Learn 10 powerful mental math tricks that will help you calculate faster and more accurately. Perfect for students preparing for competitive exams.",
        "read_time": 7
    },
    {
        "title": "Vedic Math Multiplication Tricks for Class 7-9 Students",
        "slug": "vedic-math-multiplication-tricks-class-7-9-students",
        "category": "Vedic Mathematics",
        "tags": ["vedic math", "multiplication", "class 7", "class 8", "class 9"],
        "excerpt": "Simplify multi-digit multiplication using ancient Vedic Sutras. Tailored examples and interactive steps for middle school math students.",
        "read_time": 8
    },
    {
        "title": "How to Square Any Number Mentally in 3 Seconds",
        "slug": "how-to-square-any-number-mentally-in-3-seconds",
        "category": "Mental Math",
        "tags": ["mental math", "squaring numbers", "speed math", "calculation techniques"],
        "excerpt": "Learn the step-by-step Vedic tricks to square 2-digit and 3-digit numbers in your head. Say goodbye to scratch paper calculation.",
        "read_time": 6
    },
    {
        "title": "Division Shortcuts Using Vedic Mathematics",
        "slug": "division-shortcuts-using-vedic-mathematics",
        "category": "Vedic Mathematics",
        "tags": ["vedic math", "division tricks", "mental calculations", "arithmetic shortcuts"],
        "excerpt": "Divide complex numbers quickly without long division. Master the Nikhilam and Paravartya sutras for fractional calculations.",
        "read_time": 9
    },
    {
        "title": "Vedic Math for Competitive Exams: SAT, ACT, and Olympiads",
        "slug": "vedic-math-for-competitive-exams-sat-act-olympiads",
        "category": "Vedic Mathematics",
        "tags": ["vedic math", "competitive exams", "SAT", "ACT", "Olympiad"],
        "excerpt": "How to leverage speed calculation methods to save up to 35% time on standardized tests. Optimize your scratchpad workflow.",
        "read_time": 8
    },
    {
        "title": "Teaching Vedic Math to Kids: Parent's Guide",
        "slug": "teaching-vedic-math-to-kids-parents-guide",
        "category": "Vedic Mathematics",
        "tags": ["parents guide", "vedic math for kids", "teaching math", "early math learning"],
        "excerpt": "A friendly roadmap for parents to introduce Vedic Math concepts to children. Turn calculation practice into fun daily games.",
        "read_time": 7
    },
    {
        "title": "Vedic Math vs Traditional Math: Which is Better?",
        "slug": "vedic-math-vs-traditional-math-which-is-better",
        "category": "Vedic Mathematics",
        "tags": ["vedic math", "traditional math", "comparison", "education methods"],
        "excerpt": "An objective comparison of both systems. Learn how combining traditional reasoning with Vedic shortcuts produces optimal learning results.",
        "read_time": 6
    },
    {
        "title": "Top 5 Vedic Math Books for Self-Learning",
        "slug": "top-5-vedic-math-books-for-self-learning",
        "category": "Study Tips",
        "tags": ["vedic math books", "self study", "math resources", "book reviews"],
        "excerpt": "Expand your speed math library with our expert reviews of the 5 best books on Vedic Mathematics for students and tutors.",
        "read_time": 5
    },
    {
        "title": "Vedic Math Mobile Apps: Best Tools for Practice",
        "slug": "vedic-math-mobile-apps-best-tools-for-practice",
        "category": "Study Tips",
        "tags": ["mobile apps", "math practice", "educational apps", "digital tools"],
        "excerpt": "Harness screen time for math skill building. The top iOS and Android apps for daily mental math drills and calculation games.",
        "read_time": 6
    },
    {
        "title": "Common Vedic Math Mistakes and How to Avoid Them",
        "slug": "common-vedic-math-mistakes-and-how-to-avoid-them",
        "category": "Vedic Mathematics",
        "tags": ["vedic math", "common errors", "verification", "mistakes to avoid"],
        "excerpt": "Ensure precision alongside speed. Learn when students make common errors with carry-overs and how to prevent calculation slips.",
        "read_time": 7
    },

    # Board-Specific Content
    {
        "title": "CBSE Class 9 Maths: Chapter-wise Important Questions",
        "slug": "cbse-class-9-maths-chapter-wise-important-questions",
        "category": "Exam Preparation",
        "tags": ["CBSE", "Class 9", "important questions", "chapter breakdown"],
        "excerpt": "A comprehensive compilation of must-practice questions for CBSE Class 9 Mathematics. Ensure your foundational topics are secure.",
        "read_time": 9
    },
    {
        "title": "ICSE Class 12 Mathematics Syllabus 2026: Complete Breakdown",
        "slug": "icse-class-12-mathematics-syllabus-complete-breakdown",
        "category": "Exam Preparation",
        "tags": ["ICSE", "Class 12", "syllabus analysis", "math preparation"],
        "excerpt": "Deep dive into the Class 12 ISC Math syllabus structure. Topic weights, calculus breakdowns, and strategy for scoring high.",
        "read_time": 10
    },
    {
        "title": "IB Math AA vs AI: Which Should You Choose?",
        "slug": "ib-math-aa-vs-ai-which-should-you-choose",
        "category": "Study Tips",
        "tags": ["IB math", "Analysis and Approaches", "Applications and Interpretation", "curriculum choose"],
        "excerpt": "Understand the differences between Analysis & Approaches (AA) and Applications & Interpretation (AI) to make the right college prep choice.",
        "read_time": 8
    },
    {
        "title": "GCSE Maths Revision Tips: Last 30 Days Strategy",
        "slug": "gcse-maths-revision-tips-last-30-days-strategy",
        "category": "Exam Preparation",
        "tags": ["GCSE", "math revision", "last minute tips", "study plan"],
        "excerpt": "Turn high-stress study into high scores. A detailed calendar and preparation checklist for the final 30 days before your GCSE Math exam.",
        "read_time": 7
    },
    {
        "title": "Cambridge IGCSE Mathematics: Topicwise Practice Guide",
        "slug": "cambridge-igcse-mathematics-topicwise-practice-guide",
        "category": "Exam Preparation",
        "tags": ["Cambridge IGCSE", "practice guide", "topic breakdown", "study resources"],
        "excerpt": "Tackle the extended and core papers with confidence. Highly recommended questions and exam strategies for IGCSE Mathematics.",
        "read_time": 9
    },
    {
        "title": "Oxford Board Mathematics: Curriculum Overview",
        "slug": "oxford-board-mathematics-curriculum-overview",
        "category": "Exam Preparation",
        "tags": ["Oxford Board", "curriculum review", "international boards", "mathematics education"],
        "excerpt": "Get familiar with the structure and evaluation model of Oxford AQA Mathematics. Critical concepts explained for high marks.",
        "read_time": 8
    },
    {
        "title": "CBSE vs ICSE Mathematics: Key Differences Explained",
        "slug": "cbse-vs-icse-mathematics-key-differences-explained",
        "category": "Study Tips",
        "tags": ["CBSE", "ICSE", "comparison", "syllabus differences", "board selection"],
        "excerpt": "A detailed syllabus and pedagogical comparison. Understand how each board shapes mathematical logic and competitive test prep.",
        "read_time": 7
    },
    {
        "title": "Switching Boards? Mathematics Transition Guide",
        "slug": "switching-boards-mathematics-transition-guide",
        "category": "Study Tips",
        "tags": ["board transition", "switching boards", "bridge concepts", "math guidance"],
        "excerpt": "A bridge curriculum guide for students switching between CBSE, ICSE, or IB boards. Close the mathematical syllabus gaps seamlessly.",
        "read_time": 6
    },

    # Topic-Specific Guides
    {
        "title": "How to Master Algebra: Complete Guide for Class 8-10 Students",
        "slug": "master-algebra-guide-class-8-10",
        "category": "Algebra",
        "tags": ["algebra", "class 8", "class 9", "class 10"],
        "excerpt": "Learn algebra fundamentals to advanced concepts. Complete guide for Classes 8-10 with examples, practice problems, and expert tips.",
        "read_time": 10
    },
    {
        "title": "Geometry Made Easy: Essential Theorems and Proofs for ICSE Students",
        "slug": "geometry-made-easy-icse-theorems-proofs",
        "category": "Geometry",
        "tags": ["geometry", "ICSE", "theorems", "proofs"],
        "excerpt": "Master essential geometry theorems and proofs with clear explanations and visual aids. Specifically designed for ICSE curriculum students.",
        "read_time": 8
    },
    {
        "title": "Trigonometry Made Simple: Sin, Cos, Tan Explained",
        "slug": "trigonometry-made-simple-sin-cos-tan-explained",
        "category": "Trigonometry",
        "tags": ["trigonometry", "sin cos tan", "math formulas", "concepts explained"],
        "excerpt": "Demystify standard angles, trigonometric ratios, and equations. Step-by-step derivations and simple shortcuts to memorize values.",
        "read_time": 8
    },
    {
        "title": "Coordinate Geometry: Distance, Section Formula & Applications",
        "slug": "coordinate-geometry-distance-section-formula-applications",
        "category": "Geometry",
        "tags": ["coordinate geometry", "formulas", "distance formula", "section formula"],
        "excerpt": "Visualize graphs and solve coordinate problems like a pro. Thorough explanation of distance, section, and midpoint formulas.",
        "read_time": 8
    },
    {
        "title": "Quadratic Equations: Solving Methods & Real-world Applications",
        "slug": "quadratic-equations-solving-methods-real-world-applications",
        "category": "Algebra",
        "tags": ["quadratic equations", "solving methods", "discriminant", "algebraic formulas"],
        "excerpt": "Master three different methods to solve quadratic equations: factorization, completing the square, and using the quadratic formula.",
        "read_time": 9
    },
    {
        "title": "Calculus Basics for Class 11-12: Derivatives & Integrals",
        "slug": "calculus-basics-for-class-11-12-derivatives-integrals",
        "category": "Study Tips",
        "tags": ["calculus", "derivatives", "integrals", "class 11", "class 12"],
        "excerpt": "Get a solid conceptual headstart on limits, derivatives, and integration. Relate calculus concepts to real-world physics problems.",
        "read_time": 11
    },
    {
        "title": "Statistics for Students: Mean, Median, Mode Explained",
        "slug": "statistics-for-students-mean-median-mode-explained",
        "category": "Study Tips",
        "tags": ["statistics", "mean median mode", "data analysis", "math basics"],
        "excerpt": "Learn how to compute central tendency for grouped and ungrouped data. Practice problems and typical exam questions solved.",
        "read_time": 8
    },
    {
        "title": "Probability Made Easy: Concepts & Problem-Solving",
        "slug": "probability-made-easy-concepts-problem-solving",
        "category": "Study Tips",
        "tags": ["probability", "dice and coins", "cards probability", "problem solving"],
        "excerpt": "Understand sample spaces, events, and independent probability. A comprehensive checklist of card and coin problem templates.",
        "read_time": 8
    },
    {
        "title": "Number Theory Essentials: Primes, HCF, LCM",
        "slug": "number-theory-essentials-primes-hcf-lcm",
        "category": "Algebra",
        "tags": ["number theory", "prime numbers", "HCF", "LCM", "arithmetic foundation"],
        "excerpt": "Build strong arithmetic fundamentals. Understand prime factorization, Euclidean division algorithm, and application of HCF/LCM in word problems.",
        "read_time": 7
    },
    {
        "title": "Mensuration Formulas: Complete Reference Guide",
        "slug": "mensuration-formulas-complete-reference-guide",
        "category": "Geometry",
        "tags": ["mensuration", "formulas sheet", "surface area", "volume", "geometry"],
        "excerpt": "A handy formula sheet for 2D and 3D shapes. Cylinder, sphere, cone, prism, and cuboid formulas compiled for fast exam revision.",
        "read_time": 8
    },

    # Exam Prep & Study Tips
    {
        "title": "How to Prepare for Math Olympiad: Complete Roadmap",
        "slug": "how-to-prepare-for-math-olympiad-complete-roadmap",
        "category": "Exam Preparation",
        "tags": ["Math Olympiad", "preparation guide", "advanced math", "olympiad roadmap"],
        "excerpt": "A detailed roadmap for students aiming for regional and national Math Olympiads. Requisite skills, syllabus sources, and recommended books.",
        "read_time": 10
    },
    {
        "title": "Time Management Tips for Math Exams",
        "slug": "time-management-tips-for-math-exams",
        "category": "Study Tips",
        "tags": ["time management", "exam strategy", "speed tips", "exam tips"],
        "excerpt": "Learn how to allocate time across Sections A to E in math papers. Maximize your score by planning reading and buffer revision slots.",
        "read_time": 7
    },
    {
        "title": "How to Overcome Math Anxiety and Build Confidence",
        "slug": "how-to-overcome-math-anxiety-and-build-confidence",
        "category": "Study Tips",
        "tags": ["math anxiety", "mental health", "confidence building", "student guidance"],
        "excerpt": "Overcome the fear of math. Actionable psychological strategies, conceptual learning steps, and practice habits to build math confidence.",
        "read_time": 8
    },
    {
        "title": "Best Math Practice Resources for Self-Study",
        "slug": "best-math-practice-resources-for-self-study",
        "category": "Study Tips",
        "tags": ["self study", "math practice", "free resources", "websites for students"],
        "excerpt": "The ultimate compilation of online repositories, question banks, worksheets, and videos for secondary board math self-study.",
        "read_time": 6
    },
    {
        "title": "How to Check Your Math Answers: Verification Techniques",
        "slug": "how-to-check-your-math-answers-verification-techniques",
        "category": "Study Tips",
        "tags": ["verification", "check answers", "exam techniques", "digit sum"],
        "excerpt": "Avoid silly calculation mistakes. Learn back-substitution, digit sums, estimation, and range checking to verify answers instantly.",
        "read_time": 7
    },
    {
        "title": "Creating the Perfect Math Study Schedule",
        "slug": "creating-the-perfect-math-study-schedule",
        "category": "Study Tips",
        "tags": ["study schedule", "time table", "consistency", "study habits"],
        "excerpt": "A customisable weekly timetable template designed for balancing math practice with other subjects. Maximize learning retention.",
        "read_time": 6
    },
    {
        "title": "Math Exam Day Checklist: Do's and Don'ts",
        "slug": "math-exam-day-checklist-dos-and-donts",
        "category": "Study Tips",
        "tags": ["exam day", "checklist", "student checklist", "exam prep"],
        "excerpt": "A checklist for the night before and the morning of your math exam. Stationery, mental preparation, and instructions inside the exam hall.",
        "read_time": 5
    }
]

def generate_post_content(meta):
    title = meta["title"]
    category = meta["category"]
    tags = ", ".join(meta["tags"])
    
    # We will generate rich structured content programmatically
    content = f"# {title}\n\n"
    content += f"Mathematics can sometimes feel challenging, but with the right guidance, techniques, and preparation, any student can unlock their inner math genius. In this article, we deep-dive into **{title}**, exploring key concepts, solved examples, and exam-focused strategies.\n\n"
    
    content += f"## Understanding the Foundations of {category}\n\n"
    content += f"When mastering topics in **{category}**, conceptual clarity is your most powerful tool. Rote memorization often fails during competitive exams or board assessments when questions are twisted. Instead, build a solid foundation by focusing on the 'why' behind every mathematical principle.\n\n"
    content += f"### Key Highlights & Objectives:\n"
    for tag in meta["tags"]:
        content += f"- **{tag.title()}**: Understand its application in practical and academic settings.\n"
    content += "\n"
    
    # Add formulas or tables depending on category
    if category in ["Algebra", "Trigonometry", "Geometry"]:
        content += "## Essential Formula Reference Sheet\n\n"
        content += "Below is a summary of the critical formulas you must have on your fingertips:\n\n"
        if category == "Trigonometry":
            content += "| Trigonometric Identity | Definition / Equivalent | Application |\n"
            content += "| :--- | :--- | :--- |\n"
            content += "| $\\sin^2\\theta + \\cos^2\\theta$ | $1$ | Pythagorean Trigonometric Identity |\n"
            content += "| $1 + \\tan^2\\theta$ | $\\sec^2\\theta$ | Secondary Pythagorean Identity |\n"
            content += "| $1 + \\cot^2\\theta$ | $\\csc^2\\theta$ | Tertiary Pythagorean Identity |\n"
            content += "| $\\sin(2\\theta)$ | $2\\sin\\theta\\cos\\theta$ | Double Angle Identity |\n\n"
        elif category == "Algebra":
            content += "| Identity / Formula | Equation | Usage |\n"
            content += "| :--- | :--- | :--- |\n"
            content += "| Difference of Squares | $a^2 - b^2 = (a-b)(a+b)$ | Factoring polynomials |\n"
            content += "| Quadratic Formula | $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ | Solving any second degree equation |\n"
            content += "| Discriminant | $D = b^2 - 4ac$ | Determining nature of quadratic roots |\n\n"
        else:  # Geometry
            content += "| Theorem / Concept | Key Formula / Definition | Importance |\n"
            content += "| :--- | :--- | :--- |\n"
            content += "| Distance Formula | $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ | Coordinate geometry length checks |\n"
            content += "| Section Formula (Internal) | $x = \\frac{mx_2+nx_1}{m+n}, y = \\frac{my_2+ny_1}{m+n}$ | Splitting line segments in ratios |\n"
            content += "| Tangent Theorem | Tangent is $\\perp$ to radius at point of contact | Circle geometry proof-based questions |\n\n"
            
    content += "## Step-by-Step Solved Examples\n\n"
    content += "Let us review how to apply these rules to solve typical exam problems systematically.\n\n"
    
    if category == "Trigonometry":
        content += "### Example 1: Prove that $\\frac{\\sin\\theta}{1+\\cos\\theta} + \\frac{1+\\cos\\theta}{\\sin\\theta} = 2\\csc\\theta$\n\n"
        content += "**Solution:**\n"
        content += "1. Find the common denominator for LHS:\n"
        content += "   $$\\text{LHS} = \\frac{\\sin^2\\theta + (1+\\cos\\theta)^2}{\\sin\\theta(1+\\cos\\theta)}$$\n"
        content += "2. Expand the numerator:\n"
        content += "   $$\\sin^2\\theta + 1 + 2\\cos\\theta + \\cos^2\\theta$$\n"
        content += "3. Group terms using $\\sin^2\\theta + \\cos^2\\theta = 1$:\n"
        content += "   $$(1) + 1 + 2\\cos\\theta = 2 + 2\\cos\\theta = 2(1+\\cos\\theta)$$\n"
        content += "4. Substitute back into LHS:\n"
        content += "   $$\\text{LHS} = \\frac{2(1+\\cos\\theta)}{\\sin\\theta(1+\\cos\\theta)} = \\frac{2}{\\sin\\theta} = 2\\csc\\theta$$\n"
        content += "5. Hence, **LHS = RHS. Proved!**\n\n"
    elif category == "Algebra":
        content += "### Example 1: Solve for $x$: $2x^2 - 7x + 3 = 0$ using factorization.\n\n"
        content += "**Solution:**\n"
        content += "1. Identify parameters: $a=2, b=-7, c=3$.\n"
        content += "2. Find two numbers that multiply to $a \\times c = 6$ and add up to $b = -7$.\n"
        content += "   - The numbers are $-6$ and $-1$.\n"
        content += "3. Split the middle term:\n"
        content += "   $$2x^2 - 6x - x + 3 = 0$$\n"
        content += "4. Factor by grouping:\n"
        content += "   $$2x(x-3) - 1(x-3) = 0$$\n"
        content += "   $$(2x-1)(x-3) = 0$$\n"
        content += "5. Solve for roots: $2x-1 = 0 \\implies x=0.5$; $x-3=0 \\implies x=3$.\n"
        content += "   - **Roots:** $x = 0.5$ or $x = 3$.\n\n"
    elif category == "Vedic Mathematics" or category == "Mental Math":
        content += "### Example 1: Calculate $94 \\times 95$ mentally using the Base Method (Nikhilam).\n\n"
        content += "**Solution:**\n"
        content += "1. Identify the base: Both numbers are close to $100$.\n"
        content += "2. Determine the deficiencies from base 100:\n"
        content += "   - $94$ is $-6$ below 100.\n"
        content += "   - $95$ is $-5$ below 100.\n"
        content += "3. Cross-subtract deficiencies:\n"
        content += "   - $94 - 5 = 89$ or $95 - 6 = 89$ (this forms the left side of the answer: $89$).\n"
        content += "4. Multiply the deficiencies:\n"
        content += "   - $-6 \\times -5 = 30$ (this forms the right side of the answer: $30$).\n"
        content += "5. Combine left and right sides:\n"
        content += "   - **Answer: 8930**.\n\n"
    else:  # Exam Prep, Study Tips, Geometry
        content += "### Practical Application Exercise: The 3-Step Verification Method\n\n"
        content += "When verifying answers in the exam room, top-scoring merit students use this structured pipeline:\n"
        content += "1. **Estimation Range check**: Is the calculated number physically possible? (e.g. area cannot be negative, hypotenuse must be the longest side).\n"
        content += "2. **Digit Sum Check**: Does the digital root of LHS match RHS? (Very useful for arithmetic verification).\n"
        content += "3. **Reverse calculation**: Re-insert the solution back into the original equation to verify if it balances.\n\n"

    content += "## Common Mistakes to Avoid\n\n"
    content += "Many students drop critical marks not due to lack of knowledge, but due to avoidable exam slips:\n"
    content += "- **Sign Errors**: Forgetting to distribute negative signs inside parenthetical equations.\n"
    content += "- **Unit Omission**: Forgetting to write $cm^2$ or $m/s$ in final answers, which costs 0.5 marks in board grading schemes.\n"
    content += "- **Skipping intermediate formulas**: Directly putting numbers in calculations without stating the basic formula first.\n\n"

    content += "## Build Your Speed with Mathematics Geek\n\n"
    content += f"Mastering **{meta['category']}** requires structured learning, regular revision, and speed practice. If you are preparing for board exams or competitive entries, consistent mentorship can accelerate your score transformation.\n\n"
    content += "Ready to boost your speed and conceptual clarity? [Book a free demo coaching class with Aarti Agarwal](/contact) today and start your journey towards scoring 95%+ in math!\n\n"
    
    content += "---\n\n"
    content += "**About Aarti Agarwal Ma'am:**\n"
    content += "Aarti Agarwal is a Merit Score Expert with 15+ years of experience teaching mathematics to students in CBSE, ICSE, IB, and Oxford curricula. Her unique conceptual methodologies have helped over 500+ students achieve top academic positions.\n"
    
    return content

async def seed_all_posts():
    print("🚀 Starting generation of all 40 blog posts...")
    
    # Valid category-specific Unsplash image hashes
    unsplash_images = {
        "Vedic Mathematics": [
            "1509228468518-180dd4864904",
            "1518133910546-b6c2fb7d79e3",
            "1453733190148-c44698c26588"
        ],
        "Exam Preparation": [
            "1434030216411-0b793f4b4173",
            "1606326608606-aa0b62935f2b",
            "1516979187457-637abb4f9353"
        ],
        "Mental Math": [
            "1596495578065-6e0763fa1141",
            "1509228468518-180dd4864904"
        ],
        "Algebra": [
            "1596495578065-6e0763fa1141",
            "1518133910546-b6c2fb7d79e3"
        ],
        "Geometry": [
            "1453733190148-c44698c26588",
            "1544377193-33dcf4d68fb5"
        ],
        "Trigonometry": [
            "1544377193-33dcf4d68fb5"
        ],
        "Study Tips": [
            "1456513080510-7bf3a84b82f8",
            "1516979187457-637abb4f9353",
            "1501504905252-473c47e087f8"
        ]
    }
    
    all_posts = []
    
    for i, meta in enumerate(BLOG_METADATA):
        slug = meta["slug"]
        cat = meta["category"]
        
        # Get category-specific image hashes, fallback to a default math image if category is not mapped
        hashes = unsplash_images.get(cat, ["1509228468518-180dd4864904"])
        img_hash = hashes[i % len(hashes)]
        
        # Populate standard fields
        post = {
            "id": str(uuid4()),
            "title": meta["title"],
            "slug": slug,
            "category": cat,
            "tags": meta["tags"],
            "excerpt": meta["excerpt"],
            "read_time": meta["read_time"],
            "featured_image": f"https://images.unsplash.com/photo-{img_hash}?w=1200&q=80",
            "status": "published",
            "views": random.randint(50, 600),
            "meta_title": f"{meta['title']} | Mathematics Geek",
            "meta_description": meta["excerpt"][:155],
            "meta_keywords": meta["tags"],
            "author": "Aarti Agarwal",
            "content": generate_post_content(meta)
        }
        
        # Stagger creation dates over the last 90 days
        days_ago = random.randint(1, 90)
        created_date = datetime.now(timezone.utc) - timedelta(days=days_ago)
        post["created_at"] = created_date.isoformat()
        post["updated_at"] = created_date.isoformat()
        
        all_posts.append(post)

    try:
        # Clear existing posts and insert all 40
        await db.blog_posts.delete_many({})
        result = await db.blog_posts.insert_many(all_posts)
        print(f"✅ Successfully seeded {len(result.inserted_ids)} blog posts into MongoDB!")
        
        # Print summary by category
        categories = {}
        for post in all_posts:
            cat = post['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        print("\n📊 Blog Posts Summary by Category:")
        for cat, count in categories.items():
            print(f"  - {cat}: {count} posts")
            
    except Exception as e:
        print(f"❌ Error seeding blog posts: {e}")

if __name__ == "__main__":
    asyncio.run(seed_all_posts())
