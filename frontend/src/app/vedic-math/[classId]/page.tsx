import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { SITE_METADATA, CLASSES } from "@/lib/constants";
import { BookOpen, Zap, Brain, Trophy, ChevronRight, ArrowRight, Star, Calculator, Sparkles } from "lucide-react";

const VEDIC_CONTENT: Record<string, { title: string; description: string; tricks: { name: string; description: string; example: string }[]; benefits: string[] }> = {
  "class-6": {
    title: "Vedic Math for Class 6",
    description: "Build a strong foundation in mental math with ancient Vedic techniques. Perfect for Class 6 students looking to develop speed and accuracy in basic arithmetic operations.",
    tricks: [
      { name: "Nikhilam Sutra (All from 9, last from 10)", description: "Subtract any number from a round number instantly", example: "1000 - 357 = 643 (9-3=6, 9-5=4, 10-7=3)" },
      { name: "Ekadhikena Purvena", description: "Multiply numbers ending in 5 in seconds", example: "35 × 35 = 1225 (3×4=12, append 25)" },
      { name: "Vertically & Crosswise", description: "Two-digit multiplication without pen and paper", example: "23 × 14 = 322 (2×1 | 2×4+3×1 | 3×4)" },
    ],
    benefits: ["Build mental calculation confidence from a young age", "Make arithmetic fun and engaging", "Develop number sense and pattern recognition", "Prepare for competitive math olympiads"],
  },
  "class-7": {
    title: "Vedic Math for Class 7",
    description: "Accelerate your Class 7 math skills with Vedic shortcuts for fractions, decimals, and algebraic expressions. Master calculations that take others minutes in just seconds.",
    tricks: [
      { name: "Anurupyena (Proportionality)", description: "Solve fraction operations using proportional relationships", example: "3/7 + 2/7 = 5/7 — extended to unlike fractions" },
      { name: "Paravartya Yojayet", description: "Transpose and adjust for quick division", example: "1234 ÷ 112 — rearrange for mental division" },
      { name: "Dwandwa Yoga (Duplex)", description: "Square any two-digit number mentally", example: "47² = 2209 (use duplex combination method)" },
    ],
    benefits: ["Speed up fraction and decimal calculations", "Build algebraic thinking through patterns", "Reduce exam time by 30-40%", "Boost confidence in class tests"],
  },
  "class-8": {
    title: "Vedic Math for Class 8",
    description: "Master advanced Vedic techniques for squares, cubes, and algebraic identities. Class 8 students learn to solve complex problems with elegant mental shortcuts.",
    tricks: [
      { name: "Yavadunam (Deficiency Method)", description: "Square numbers near a base (100, 1000)", example: "98² = 9604 (98-2=96, 2²=04 → 9604)" },
      { name: "Anurupya Sutra", description: "Find cube roots of perfect cubes mentally", example: "∛274625 = 65 (pattern recognition)" },
      { name: "Vinculum Numbers", description: "Convert hard multiplications to easier bar-number forms", example: "298 × 7 = (300-2) × 7 = 2100-14 = 2086" },
    ],
    benefits: ["Master squares and cubes of any number", "Simplify algebraic identity applications", "Excel in NTSE and Olympiad preparation", "Develop advanced pattern recognition"],
  },
  "class-9": {
    title: "Vedic Math for Class 9",
    description: "Dive into Vedic techniques for quadratic equations, polynomials, and coordinate geometry. Essential speed math for Class 9 board exam preparation.",
    tricks: [
      { name: "Adyamadyenantyamantya", description: "Factor quadratics by inspection", example: "x²+5x+6 = (x+2)(x+3) — mental factoring" },
      { name: "Urdhva Tiryagbhyam (3-digit)", description: "Multiply any 3-digit numbers vertically and crosswise", example: "123 × 456 = 56088 (extended crosswise)" },
      { name: "Sankalana Vyavakalana", description: "Solve simultaneous equations by addition/subtraction", example: "2x+3y=12, x+y=5 → instant elimination" },
    ],
    benefits: ["Solve quadratics in under 30 seconds", "Speed up coordinate geometry calculations", "Build strong algebra manipulation skills", "Prepare for competitive entrance exams"],
  },
  "class-10": {
    title: "Vedic Math for Class 10 Board Exam",
    description: "Board exam-focused Vedic math strategies for Class 10. Score 95%+ with speed techniques for trigonometry, statistics, and real number operations.",
    tricks: [
      { name: "Trigonometric Shortcuts", description: "Memorize all trig ratios using Vedic patterns", example: "sin30°=1/2, cos60°=1/2 — pattern-based recall" },
      { name: "HCF/LCM Speed Method", description: "Find HCF and LCM using Vedic division", example: "HCF(252,105) in 2 steps vs traditional 5 steps" },
      { name: "Statistics Fast Formulas", description: "Calculate mean, median, mode with mental math", example: "Grouped data mean — shortcut assumed mean method" },
    ],
    benefits: ["Save 15-20 minutes in board exams", "Verify answers instantly with check methods", "Score 95%+ in Mathematics", "Master all board exam question patterns"],
  },
  "class-11": {
    title: "Vedic Math for Class 11",
    description: "Advanced Vedic strategies for Class 11 mathematics including sequences, permutations, and calculus foundations. Build competitive exam readiness.",
    tricks: [
      { name: "Sequence Sum Shortcuts", description: "Sum arithmetic and geometric progressions mentally", example: "Sum of 1+2+...+100 = 100×101/2 = 5050 (Vedic pattern)" },
      { name: "Permutation Speed Calc", description: "Calculate factorials and P(n,r) with cancellation tricks", example: "P(10,3) = 10×9×8 = 720 — chunked multiplication" },
      { name: "Derivative Patterns", description: "Differentiate polynomial functions by pattern", example: "d/dx(3x⁴+2x³) = 12x³+6x² — coefficient cascade" },
    ],
    benefits: ["Master JEE/competitive exam speed techniques", "Handle complex permutation problems mentally", "Build strong calculus foundations", "Develop mathematical maturity for higher studies"],
  },
  "class-12": {
    title: "Vedic Math for Class 12 Board & JEE",
    description: "Elite-level Vedic speed math for Class 12 boards and JEE/NEET preparation. Integration shortcuts, matrix tricks, and probability speed methods.",
    tricks: [
      { name: "Integration Patterns", description: "Recognize standard integral forms instantly", example: "∫x²dx = x³/3 — power rule pattern mastery" },
      { name: "Matrix Determinant Speed", description: "Calculate 3×3 determinants with Sarrus' rule + Vedic", example: "3×3 det in under 20 seconds using cross patterns" },
      { name: "Probability Fast Methods", description: "Bayes' theorem and conditional probability shortcuts", example: "Tree diagram mental mapping for complex events" },
    ],
    benefits: ["Score 95%+ in Class 12 board exam", "Gain 15-20 extra minutes in JEE/NEET", "Master all calculus speed techniques", "Achieve top percentile in competitive exams"],
  },
};

export async function generateStaticParams() {
  return CLASSES.map((c) => ({ classId: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ classId: string }> }): Promise<Metadata> {
  const { classId } = await params;
  const content = VEDIC_CONTENT[classId];
  if (!content) return { title: "Vedic Math" };

  return {
    title: `${content.title} | Speed Math Tricks & Techniques | ${SITE_METADATA.siteName}`,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${SITE_METADATA.siteUrl}/vedic-math/${classId}`,
      siteName: SITE_METADATA.siteName,
      type: "article",
    },
    alternates: { canonical: `${SITE_METADATA.siteUrl}/vedic-math/${classId}` },
  };
}

export default async function VedicMathClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const content = VEDIC_CONTENT[classId];
  const classInfo = CLASSES.find((c) => c.id === classId);

  if (!content || !classInfo) {
    return (
      <>
        <Header />
        <main className="flex-grow flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Class Not Found</h1>
            <Link href="/vedic-math/class-6" className="text-cyan hover:underline">Browse Vedic Math Classes →</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: content.title,
    description: content.description,
    provider: {
      "@type": "Organization",
      name: SITE_METADATA.siteName,
      url: SITE_METADATA.siteUrl,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      instructor: { "@type": "Person", name: SITE_METADATA.teacher },
    },
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-slate-950 to-gold/5"></div>
          <div className="absolute top-[-15%] left-[-10%] w-[40rem] h-[40rem] bg-cyan/8 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/vedic-math/class-6" className="hover:text-white transition-colors">Vedic Math</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-cyan">{classInfo.name}</span>
            </nav>

            <div className="inline-flex items-center space-x-2 bg-cyan/10 border border-cyan/20 rounded-full px-4 py-1.5 text-sm text-cyan mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Ancient Wisdom × Modern Speed</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {content.title.split("for")[0]}
              <span className="block text-cyan">for {classInfo.name} Students</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed mb-8">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${SITE_METADATA.whatsapp}?text=${encodeURIComponent(`Hi Aarti, I'm interested in Vedic Math classes for ${classInfo.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan to-cyan/80 text-slate-950 font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan/25 transition-all"
              >
                <span>Book FREE Demo Class</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/games"
                className="inline-flex items-center space-x-2 glass-cyan text-cyan font-medium px-6 py-3 rounded-lg hover:bg-cyan/10 transition-all"
              >
                <Calculator className="h-4 w-4" />
                <span>Try Speed Math Games</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Vedic Tricks Section */}
        <section className="py-20 bg-slate-950/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                <span className="text-gold">Vedic Sutras</span> You&apos;ll Master
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Each technique is an ancient formula refined for modern exam success. Learn these and you&apos;ll calculate faster than a calculator.
              </p>
            </div>

            <div className="grid gap-8">
              {content.tricks.map((trick, idx) => (
                <div
                  key={idx}
                  className="glass-cyan rounded-2xl p-8 hover:border-cyan/30 transition-all group"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan/20 to-cyan/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {idx === 0 ? <Zap className="h-6 w-6 text-cyan" /> :
                       idx === 1 ? <Brain className="h-6 w-6 text-cyan" /> :
                       <BookOpen className="h-6 w-6 text-cyan" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{trick.name}</h3>
                      <p className="text-gray-400 mb-4">{trick.description}</p>
                      <div className="bg-slate-900/60 rounded-lg p-4 border border-cyan/10">
                        <p className="text-sm font-mono text-cyan">{trick.example}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
              Why <span className="text-cyan">Vedic Math</span> for {classInfo.name}?
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {content.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4 glass rounded-xl p-6">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Star className="h-4 w-4 text-gold" />
                  </div>
                  <p className="text-gray-300 leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-link to other classes */}
        <section className="py-16 bg-slate-950/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Vedic Math for <span className="text-gold">Other Classes</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {CLASSES.map((cls) => (
                <Link
                  key={cls.id}
                  href={`/vedic-math/${cls.id}`}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    cls.id === classId
                      ? "bg-cyan text-slate-950"
                      : "glass text-gray-300 hover:text-white hover:border-cyan/30"
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
            <div className="glass-cyan rounded-2xl p-10">
              <Trophy className="h-12 w-12 text-gold mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Become a <span className="text-cyan">Math Genius</span>?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join hundreds of {classInfo.name} students who went from struggling with math to scoring 95%+ in their exams.
              </p>
              <a
                href={`https://wa.me/${SITE_METADATA.whatsapp}?text=${encodeURIComponent(`Hi Aarti, I want to join Vedic Math classes for ${classInfo.name}. Please share details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold to-amber-500 text-slate-950 font-bold px-8 py-4 rounded-lg text-lg hover:shadow-xl hover:shadow-gold/20 transition-all"
              >
                <span>Book Your FREE Demo Now</span>
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
