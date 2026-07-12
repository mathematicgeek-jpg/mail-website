import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { SITE_METADATA, CLASSES } from "@/lib/constants";
import { Zap, Brain, Target, ChevronRight, ArrowRight, Timer, Star, Sparkles } from "lucide-react";

const TRICKS_CONTENT: Record<string, { title: string; description: string; tricks: { name: string; description: string; steps: string[]; example: string }[]; examTips: string[] }> = {
  "class-6": {
    title: "Mental Math Tricks for Class 6",
    description: "Fun and easy mental math tricks every Class 6 student should know. Master quick addition, subtraction, and multiplication techniques that make math effortless.",
    tricks: [
      { name: "Multiply by 11 Instantly", description: "Add adjacent digits and place the sum in the middle", steps: ["Take any 2-digit number, e.g., 36", "Add the digits: 3 + 6 = 9", "Place 9 between 3 and 6: 396", "If sum > 9, carry over"], example: "36 × 11 = 396 | 85 × 11 = 935" },
      { name: "Subtract from 1000", description: "Use the 9-complement trick: All from 9, last from 10", steps: ["Subtract each digit from 9, except the last", "Subtract the last digit from 10", "Example: 1000 - 648", "9-6=3, 9-4=5, 10-8=2 → 352"], example: "1000 - 648 = 352" },
      { name: "Double and Halve", description: "Simplify multiplication by doubling one and halving the other", steps: ["14 × 16 is hard, so halve 14 → 7", "Double 16 → 32", "7 × 32 = 224", "Keep going until numbers are easy"], example: "14 × 16 = 7 × 32 = 224" },
    ],
    examTips: ["Always check your answer using digit-sum verification", "Practice 10 problems daily for speed improvement", "Use estimation first, then calculate exactly", "Write intermediate steps only when necessary"],
  },
  "class-7": {
    title: "Mental Math Tricks for Class 7",
    description: "Level up your Class 7 math with speed tricks for fractions, percentages, and divisibility. These shortcuts cut calculation time in half during exams.",
    tricks: [
      { name: "Percentage Flip Trick", description: "x% of y = y% of x — pick the easier one to calculate", steps: ["Need 8% of 50?", "Flip it: 50% of 8 = 4", "Same answer, much easier", "Works for any percentage pair"], example: "8% of 50 = 50% of 8 = 4" },
      { name: "Divisibility Quick Checks", description: "Know if a number divides evenly without doing long division", steps: ["By 3: digit sum divisible by 3", "By 4: last 2 digits divisible by 4", "By 8: last 3 digits divisible by 8", "By 9: digit sum divisible by 9"], example: "2,736 ÷ 4 → 36÷4=9 ✓ | 2+7+3+6=18÷9=2 ✓" },
      { name: "Fraction × Whole Number", description: "Cancel before you multiply to keep numbers small", steps: ["3/8 × 24", "Cancel: 24÷8 = 3", "3 × 3 = 9", "No big multiplication needed"], example: "3/8 × 24 = 3 × 3 = 9" },
    ],
    examTips: ["Convert fractions to decimals when comparison is needed", "Use cross-multiplication for comparing fractions", "Always simplify before multiplying fractions", "Round to nearest 10 for quick mental estimates"],
  },
  "class-8": {
    title: "Mental Math Tricks for Class 8",
    description: "Advanced speed calculation tricks for Class 8 — squares, cubes, and algebraic shortcuts that save critical exam time and build mathematical intuition.",
    tricks: [
      { name: "Square Numbers Near 50", description: "For numbers close to 50, use the base-50 method", steps: ["(50+n)² = 2500 + 100n + n²", "Example: 53² → n=3", "2500 + 300 + 9 = 2809", "Works perfectly for 45-55 range"], example: "53² = 2809 | 48² = 2304" },
      { name: "Cube Shortcut", description: "Use (a+b)³ expansion for cubes near round numbers", steps: ["23³ = (20+3)³", "= 8000 + 3(400)(3) + 3(20)(9) + 27", "= 8000 + 3600 + 540 + 27", "= 12,167"], example: "23³ = 12,167" },
      { name: "Algebraic Identity Speed", description: "Use (a+b)(a-b) = a²-b² for quick multiplication", steps: ["47 × 53 = (50-3)(50+3)", "= 50² - 3² = 2500 - 9", "= 2491", "Any numbers equidistant from a round number"], example: "47 × 53 = 2500 - 9 = 2491" },
    ],
    examTips: ["Memorize squares up to 30 for instant recall", "Use algebraic identities as calculation shortcuts", "Cross-verify using digit sum method", "Practice timed drills: 20 problems in 5 minutes"],
  },
  "class-9": {
    title: "Mental Math Tricks for Class 9",
    description: "Exam-winning speed math strategies for Class 9 — master quadratic shortcuts, ratio tricks, and geometry calculations that give you an edge.",
    tricks: [
      { name: "Quadratic Factoring by Inspection", description: "Factor ax²+bx+c mentally by finding factor pairs of a×c", steps: ["x² + 7x + 12", "Product = 12, Sum = 7", "Factors: 3 × 4 = 12, 3 + 4 = 7", "Answer: (x+3)(x+4)"], example: "x² + 7x + 12 = (x+3)(x+4)" },
      { name: "Ratio and Proportion Speed", description: "Use cross-multiplication patterns to solve in seconds", steps: ["If a/b = c/d, then ad = bc", "2/3 = x/15 → x = 2×15/3 = 10", "Directly cross-multiply", "Cancel common factors first"], example: "2/3 = x/15 → x = 10" },
      { name: "Heron's Formula Simplified", description: "Calculate triangle area without finding the height", steps: ["s = (a+b+c)/2", "Area = √[s(s-a)(s-b)(s-c)]", "For 3,4,5: s=6, Area=√(6×3×2×1)=6", "Recognize Pythagorean triples for shortcuts"], example: "Triangle(3,4,5): Area = 6 sq units" },
    ],
    examTips: ["Learn to recognize quadratic patterns instantly", "Use Pythagorean triplets (3-4-5, 5-12-13, 8-15-17)", "Practice coordinate geometry with graph visualization", "Always check discriminant before solving quadratics"],
  },
  "class-10": {
    title: "Board Exam Math Tricks for Class 10",
    description: "Score 95%+ with these CBSE/ICSE Class 10 board exam speed tricks. Save 15-20 minutes using proven mental math strategies for every chapter.",
    tricks: [
      { name: "Trigonometry Value Speed Recall", description: "Remember all standard angle values using finger trick + pattern", steps: ["Write √0/2, √1/2, √2/2, √3/2, √4/2", "sin 0°=0, 30°=½, 45°=1/√2, 60°=√3/2, 90°=1", "cos is the reverse of sin", "tan = sin/cos → derive instantly"], example: "sin60° = √3/2, cos60° = 1/2, tan60° = √3" },
      { name: "AP/GP Sum Shortcuts", description: "Use known formulas as speed tools, not just theory", steps: ["AP sum: n/2 × (first + last)", "For 1+2+...+100: 100/2 × 101 = 5050", "GP sum: a(rⁿ-1)/(r-1)", "Identify series type instantly"], example: "Sum(1 to 100) = 5050" },
      { name: "Surface Area/Volume Combos", description: "Group related formulas for instant recall", steps: ["Cylinder: CSA=2πrh, TSA=2πr(r+h), V=πr²h", "Cone: CSA=πrl, TSA=πr(r+l), V=⅓πr²h", "Sphere: SA=4πr², V=⅘πr³", "l² = r² + h² for cone"], example: "Cylinder(r=7,h=10): V = 22/7 × 49 × 10 = 1540 cm³" },
    ],
    examTips: ["In board exams, attempt easy questions first for confidence", "Use diagram-based approach for geometry questions", "Always write units in measurement answers", "Cross-verify using back-substitution for equations"],
  },
  "class-11": {
    title: "Speed Math Tricks for Class 11",
    description: "JEE/competitive exam speed tricks for Class 11 — permutations, binomial theorem, and calculus shortcuts that give you the time advantage.",
    tricks: [
      { name: "nCr Pascal's Triangle", description: "Use Pascal's triangle pattern for quick combination values", steps: ["Row 0: 1", "Row 4: 1,4,6,4,1", "Row 5: 1,5,10,10,5,1", "5C2 = 10 (read from row 5, position 2)"], example: "5C2 = 10, 6C3 = 20" },
      { name: "Binomial Expansion Pattern", description: "Expand (a+b)ⁿ using coefficient patterns", steps: ["(x+1)⁴ = x⁴ + 4x³ + 6x² + 4x + 1", "Coefficients from Pascal's row 4", "General term: nCr × aⁿ⁻ʳ × bʳ", "Identify specific terms by position"], example: "(x+1)⁴ = x⁴+4x³+6x²+4x+1" },
      { name: "Limits Speed Evaluation", description: "Recognize standard limits and apply L'Hôpital's shortcut", steps: ["lim(x→0) sin(x)/x = 1", "lim(x→0) (eˣ-1)/x = 1", "lim(x→0) ln(1+x)/x = 1", "For 0/0 form: differentiate top & bottom"], example: "lim(x→0) sin(3x)/x = 3" },
    ],
    examTips: ["Memorize first 8 rows of Pascal's triangle", "Practice limits by pattern recognition, not L'Hôpital every time", "Use calculator verification during practice (not exams)", "Build a formula sheet and revise before every test"],
  },
  "class-12": {
    title: "Board & JEE Speed Math for Class 12",
    description: "Master-level speed math for Class 12 boards and JEE Main/Advanced. Integration shortcuts, matrix tricks, and probability speed methods.",
    tricks: [
      { name: "Integration by Recognition", description: "Identify standard integral forms instantly to save time", steps: ["∫xⁿ dx = xⁿ⁺¹/(n+1)", "∫eˣ dx = eˣ", "∫1/x dx = ln|x|", "∫sin(x) dx = -cos(x) — sign patterns"], example: "∫x³dx = x⁴/4 + C" },
      { name: "3×3 Determinant Speed", description: "Use Sarrus' rule for fast 3×3 determinant calculation", steps: ["Write matrix, copy first 2 columns to the right", "Multiply diagonals ↘ (add them)", "Multiply diagonals ↙ (subtract them)", "Result = sum of products difference"], example: "|1 2 3; 4 5 6; 7 8 0| = -27" },
      { name: "Conditional Probability Template", description: "Set up Bayes' theorem problems with a standard template", steps: ["Draw a tree diagram mentally", "P(A|B) = P(B|A)×P(A) / P(B)", "P(B) = P(B|A)P(A) + P(B|A')P(A')", "Plug and solve systematically"], example: "Bayes' theorem — structured approach" },
    ],
    examTips: ["For JEE: skip stuck questions, return with fresh eyes", "Use dimensional analysis to verify physics-math answers", "Practice 30 integrals daily for board exam preparation", "Master all standard integral tables for instant recall"],
  },
};

export async function generateStaticParams() {
  return CLASSES.map((c) => ({ classId: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ classId: string }> }): Promise<Metadata> {
  const { classId } = await params;
  const content = TRICKS_CONTENT[classId];
  if (!content) return { title: "Math Tricks" };

  return {
    title: `${content.title} | Speed Calculation Shortcuts | ${SITE_METADATA.siteName}`,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${SITE_METADATA.siteUrl}/math-tricks/${classId}`,
      siteName: SITE_METADATA.siteName,
      type: "article",
    },
    alternates: { canonical: `${SITE_METADATA.siteUrl}/math-tricks/${classId}` },
  };
}

export default async function MathTricksClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const content = TRICKS_CONTENT[classId];
  const classInfo = CLASSES.find((c) => c.id === classId);

  if (!content || !classInfo) {
    return (
      <>
        <Header />
        <main className="flex-grow flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Class Not Found</h1>
            <Link href="/math-tricks/class-6" className="text-cyan hover:underline">Browse Math Tricks →</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: content.title,
    description: content.description,
    step: content.tricks.map((trick, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: trick.name,
      text: trick.description,
    })),
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-slate-950 to-cyan/5"></div>
          <div className="absolute top-[-15%] right-[-10%] w-[40rem] h-[40rem] bg-gold/8 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/math-tricks/class-6" className="hover:text-white transition-colors">Math Tricks</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gold">{classInfo.name}</span>
            </nav>

            <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 text-sm text-gold mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Speed Math Mastery</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Speed Math Tricks
              <span className="block text-gold">for {classInfo.name}</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed mb-8">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${SITE_METADATA.whatsapp}?text=${encodeURIComponent(`Hi, I want to learn speed math tricks for ${classInfo.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold to-amber-500 text-slate-950 font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-gold/25 transition-all"
              >
                <span>Learn These Tricks LIVE</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/games"
                className="inline-flex items-center space-x-2 glass text-gray-300 font-medium px-6 py-3 rounded-lg hover:text-white hover:border-cyan/30 transition-all"
              >
                <Timer className="h-4 w-4" />
                <span>Practice with Games</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Tricks Cards */}
        <section className="py-20 bg-slate-950/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                <span className="text-cyan">Speed Tricks</span> You&apos;ll Master
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Each trick includes step-by-step instructions and real examples. Practice these daily and watch your speed multiply.
              </p>
            </div>

            <div className="space-y-10">
              {content.tricks.map((trick, idx) => (
                <div key={idx} className="glass-cyan rounded-2xl overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shrink-0">
                        {idx === 0 ? <Zap className="h-6 w-6 text-gold" /> :
                         idx === 1 ? <Brain className="h-6 w-6 text-gold" /> :
                         <Target className="h-6 w-6 text-gold" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{trick.name}</h3>
                        <p className="text-gray-400 mt-1">{trick.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-cyan uppercase tracking-wider mb-3">Steps</h4>
                        <ol className="space-y-2">
                          {trick.steps.map((step, si) => (
                            <li key={si} className="flex items-start gap-3 text-gray-300 text-sm">
                              <span className="w-5 h-5 rounded-full bg-cyan/10 text-cyan text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{si + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">Example</h4>
                        <div className="bg-slate-900/60 rounded-lg p-5 border border-gold/10">
                          <p className="font-mono text-gold text-lg">{trick.example}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exam Tips */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
              <span className="text-gold">Exam</span> Tips for {classInfo.name}
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {content.examTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-4 glass rounded-xl p-6">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0">
                    <Star className="h-4 w-4 text-cyan" />
                  </div>
                  <p className="text-gray-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Classes */}
        <section className="py-16 bg-slate-950/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Math Tricks for <span className="text-cyan">Other Classes</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {CLASSES.map((cls) => (
                <Link
                  key={cls.id}
                  href={`/math-tricks/${cls.id}`}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    cls.id === classId
                      ? "bg-gold text-slate-950"
                      : "glass text-gray-300 hover:text-white hover:border-gold/30"
                  }`}
                >
                  {cls.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="glass-gold rounded-2xl p-10">
              <Zap className="h-12 w-12 text-cyan mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Calculate <span className="text-gold">Faster Than a Calculator</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                These tricks are just the beginning. In live classes, Aarti Ma&apos;am teaches 50+ advanced speed techniques with daily practice drills.
              </p>
              <a
                href={`https://wa.me/${SITE_METADATA.whatsapp}?text=${encodeURIComponent(`Hi Aarti, I want to learn speed math tricks for ${classInfo.name}. Please share class details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan to-cyan/80 text-slate-950 font-bold px-8 py-4 rounded-lg text-lg hover:shadow-xl hover:shadow-cyan/20 transition-all"
              >
                <span>Start Learning FREE</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
