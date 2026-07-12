import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { SITE_METADATA, TOPICS } from "@/lib/constants";
import { BookOpen, ChevronRight, ArrowRight, GraduationCap, Target, Sparkles, TrendingUp } from "lucide-react";

const TOPIC_CONTENT: Record<string, { title: string; description: string; subtopics: string[]; whyImportant: string; classRelevance: string[]; keyFormulas: { formula: string; description: string }[] }> = {
  algebra: {
    title: "Algebra",
    description: "From basic equations to advanced polynomial theory — master algebra with structured coaching. Build the foundation that powers every competitive exam.",
    subtopics: ["Linear equations", "Quadratic equations", "Polynomials", "Factorization", "Algebraic identities", "Simultaneous equations", "Inequalities", "Sequences & series"],
    whyImportant: "Algebra is the language of mathematics. It appears in every exam — from CBSE boards to JEE Advanced, GMAT, and SAT. Mastering algebra means mastering the logical structure of math itself.",
    classRelevance: ["Class 6-7: Introduction to variables and expressions", "Class 8: Algebraic identities and factorization", "Class 9-10: Quadratics, polynomials, and equations", "Class 11-12: Sequences, series, and complex numbers"],
    keyFormulas: [
      { formula: "(a+b)² = a² + 2ab + b²", description: "Square of a binomial sum" },
      { formula: "(a-b)² = a² - 2ab + b²", description: "Square of a binomial difference" },
      { formula: "a² - b² = (a+b)(a-b)", description: "Difference of squares" },
      { formula: "x = (-b ± √(b²-4ac)) / 2a", description: "Quadratic formula" },
    ],
  },
  geometry: {
    title: "Geometry",
    description: "Visualize, prove, and solve — geometry from Euclidean basics to coordinate mastery. Learn construction, theorems, and problem-solving strategies.",
    subtopics: ["Lines and angles", "Triangles and congruence", "Circles and tangents", "Coordinate geometry", "Constructions", "Area and perimeter", "Similarity", "3D geometry basics"],
    whyImportant: "Geometry develops spatial reasoning — a skill valued in engineering, architecture, design, and data science. It teaches you to think visually and prove logically.",
    classRelevance: ["Class 6-7: Basic shapes, angles, and symmetry", "Class 8: Quadrilaterals and area formulas", "Class 9-10: Circles, constructions, coordinate geometry", "Class 11-12: 3D geometry, vectors, and conic sections"],
    keyFormulas: [
      { formula: "Area of triangle = ½ × base × height", description: "Basic triangle area" },
      { formula: "πr² (Area of circle)", description: "Circle area with radius r" },
      { formula: "d = √((x₂-x₁)² + (y₂-y₁)²)", description: "Distance formula" },
      { formula: "a² + b² = c² (Pythagoras)", description: "Right triangle relationship" },
    ],
  },
  trigonometry: {
    title: "Trigonometry",
    description: "Sin, cos, tan and beyond — from basic ratios to complex identities and equations. Essential for board exams, JEE, and real-world applications.",
    subtopics: ["Trigonometric ratios", "Identities and proofs", "Heights and distances", "Trigonometric equations", "Inverse trigonometry", "Applications in calculus"],
    whyImportant: "Trigonometry connects algebra with geometry. It's used in physics, engineering, music, and even game development. Board exams typically have 10-15% trigonometry questions.",
    classRelevance: ["Class 9: Introduction to trigonometric ratios", "Class 10: Heights and distances, identities", "Class 11: General solutions, inverse trig functions", "Class 12: Advanced applications in calculus"],
    keyFormulas: [
      { formula: "sin²θ + cos²θ = 1", description: "Fundamental identity" },
      { formula: "sin(A+B) = sinA cosB + cosA sinB", description: "Sum formula" },
      { formula: "tan θ = sin θ / cos θ", description: "Tangent definition" },
      { formula: "1 + tan²θ = sec²θ", description: "Secant identity" },
    ],
  },
  calculus: {
    title: "Calculus",
    description: "Limits, derivatives, and integrals — the mathematics of change. Build strong foundations for engineering, physics, and advanced mathematics.",
    subtopics: ["Limits and continuity", "Differentiation", "Applications of derivatives", "Integration", "Definite integrals", "Differential equations"],
    whyImportant: "Calculus is the gateway to higher mathematics and engineering. JEE Main/Advanced has 25-30% calculus questions. Mastering it opens doors to every STEM career.",
    classRelevance: ["Class 11: Limits and introduction to derivatives", "Class 12: Full differentiation, integration, and applications", "JEE/competitive: Advanced problem-solving and multi-concept questions"],
    keyFormulas: [
      { formula: "d/dx(xⁿ) = nxⁿ⁻¹", description: "Power rule of differentiation" },
      { formula: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C", description: "Power rule of integration" },
      { formula: "d/dx(sin x) = cos x", description: "Derivative of sine" },
      { formula: "∫₀ᵃ f(x)dx = F(a) - F(0)", description: "Fundamental theorem" },
    ],
  },
  statistics: {
    title: "Statistics & Probability",
    description: "Data analysis, measures of central tendency, and probability theory — essential skills for the data-driven world and board exam success.",
    subtopics: ["Mean, median, mode", "Standard deviation", "Probability basics", "Conditional probability", "Random variables", "Data representation"],
    whyImportant: "Statistics and probability are the most applicable math skills in modern careers — data science, AI, finance, and research all depend on statistical thinking.",
    classRelevance: ["Class 9-10: Central tendency, graphs, basic probability", "Class 11: Combinatorics, permutations, binomial distribution", "Class 12: Bayes' theorem, random variables, distributions"],
    keyFormulas: [
      { formula: "Mean = Σxᵢ / n", description: "Arithmetic mean" },
      { formula: "P(A) = n(A) / n(S)", description: "Classical probability" },
      { formula: "P(A|B) = P(A∩B) / P(B)", description: "Conditional probability" },
      { formula: "σ = √(Σ(xᵢ-μ)² / n)", description: "Standard deviation" },
    ],
  },
  "number-theory": {
    title: "Number Theory",
    description: "The queen of mathematics — prime numbers, divisibility, HCF/LCM, and patterns. Foundation for competitive math olympiads and advanced problem solving.",
    subtopics: ["Prime numbers", "Divisibility rules", "HCF and LCM", "Modular arithmetic", "Number patterns", "Real numbers"],
    whyImportant: "Number theory is the foundation of mathematical thinking. Olympiad questions heavily rely on number theory concepts, and it develops deep logical reasoning.",
    classRelevance: ["Class 6-8: Factors, multiples, HCF, LCM, divisibility", "Class 9-10: Real numbers, irrational numbers, Euclid's algorithm", "Olympiad: Modular arithmetic, Fermat's little theorem"],
    keyFormulas: [
      { formula: "a = bq + r (Division algorithm)", description: "Euclid's division lemma" },
      { formula: "HCF × LCM = Product of numbers", description: "HCF-LCM relationship" },
      { formula: "a ≡ b (mod n)", description: "Modular congruence" },
      { formula: "Every composite number = product of primes", description: "Fundamental theorem of arithmetic" },
    ],
  },
  arithmetic: {
    title: "Arithmetic",
    description: "Master the fundamentals — fractions, decimals, percentages, ratio, and proportion. The building blocks that make advanced math possible.",
    subtopics: ["Fractions and decimals", "Percentages", "Ratio and proportion", "Profit and loss", "Simple and compound interest", "Speed, distance, time"],
    whyImportant: "Arithmetic fluency is the single biggest predictor of math success. Students who calculate fast and accurately have a massive advantage in every exam.",
    classRelevance: ["Class 6-7: Fractions, decimals, and basic operations", "Class 8: Percentages, profit/loss, compound interest", "Competitive exams: Speed arithmetic, mental math"],
    keyFormulas: [
      { formula: "Percentage = (Part/Whole) × 100", description: "Percentage formula" },
      { formula: "SI = PRT/100", description: "Simple interest" },
      { formula: "CI = P(1 + R/100)ⁿ - P", description: "Compound interest" },
      { formula: "Speed = Distance / Time", description: "Speed formula" },
    ],
  },
  "vedic-math": {
    title: "Vedic Mathematics",
    description: "Ancient Indian mathematical techniques for lightning-fast mental calculations. 16 Vedic Sutras that transform how you think about numbers.",
    subtopics: ["Nikhilam multiplication", "Urdhva Tiryagbhyam", "Ekadhikena Purvena", "Paravartya Yojayet", "Speed squares", "Vinculum numbers", "Digit-sum verification"],
    whyImportant: "Vedic Math gives you a competitive edge no textbook can. Students typically improve their calculation speed by 5-10x within just 3 months of practice.",
    classRelevance: ["All classes: Mental arithmetic and speed calculation", "Class 9-10: Algebraic identity shortcuts", "JEE/Competitive: Time-saving techniques for MCQs"],
    keyFormulas: [
      { formula: "Nikhilam: All from 9, last from 10", description: "Subtraction from powers of 10" },
      { formula: "Urdhva Tiryagbhyam: Vertically & Crosswise", description: "Universal multiplication method" },
      { formula: "Ekadhikena: By one more than the one before", description: "Squaring numbers ending in 5" },
      { formula: "Digit sum = number mod 9", description: "Quick verification method" },
    ],
  },
};

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const content = TOPIC_CONTENT[topic];
  if (!content) return { title: "Math Topics" };

  return {
    title: `${content.title} Coaching | Expert Math Tutoring | ${SITE_METADATA.siteName}`,
    description: content.description,
    openGraph: {
      title: `${content.title} — Expert Coaching by ${SITE_METADATA.teacher}`,
      description: content.description,
      url: `${SITE_METADATA.siteUrl}/topics/${topic}`,
      siteName: SITE_METADATA.siteName,
      type: "article",
    },
    alternates: { canonical: `${SITE_METADATA.siteUrl}/topics/${topic}` },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const content = TOPIC_CONTENT[topic];
  const topicInfo = TOPICS.find((t) => t.id === topic);

  if (!content || !topicInfo) {
    return (
      <>
        <Header />
        <main className="flex-grow flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Topic Not Found</h1>
            <Link href="/topics/algebra" className="text-cyan hover:underline">Browse Math Topics →</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${content.title} Coaching`,
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
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/8 via-slate-950 to-gold/5"></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[40rem] h-[40rem] bg-cyan/6 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/topics/algebra" className="hover:text-white transition-colors">Topics</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-cyan">{content.title}</span>
            </nav>

            <div className="inline-flex items-center space-x-2 bg-cyan/10 border border-cyan/20 rounded-full px-4 py-1.5 text-sm text-cyan mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Expert-Led Topic Mastery</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Master <span className="text-cyan">{content.title}</span>
              <span className="block text-2xl md:text-3xl text-gray-400 mt-3 font-normal">with {SITE_METADATA.teacher}</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed mb-8">
              {content.description}
            </p>

            <a
              href={`https://wa.me/${SITE_METADATA.whatsapp}?text=${encodeURIComponent(`Hi Aarti, I need help with ${content.title}. Can I book a demo class?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan to-cyan/80 text-slate-950 font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan/25 transition-all"
            >
              <span>Book FREE Demo Class</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-20 bg-slate-950/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
              What You&apos;ll <span className="text-gold">Learn</span>
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.subtopics.map((sub, idx) => (
                <div key={idx} className="glass rounded-xl p-5 text-center hover:border-cyan/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5 text-cyan" />
                  </div>
                  <p className="text-gray-300 text-sm font-medium">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-cyan rounded-2xl p-10">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-7 w-7 text-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Why {content.title} Matters</h2>
                  <p className="text-gray-300 leading-relaxed text-lg">{content.whyImportant}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Formulas */}
        <section className="py-20 bg-slate-950/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
              Key <span className="text-cyan">Formulas</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {content.keyFormulas.map((f, idx) => (
                <div key={idx} className="glass rounded-xl p-6">
                  <div className="bg-slate-900/60 rounded-lg p-4 border border-cyan/10 mb-3">
                    <p className="font-mono text-cyan text-lg text-center">{f.formula}</p>
                  </div>
                  <p className="text-gray-400 text-sm text-center">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Class Relevance */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              {content.title} Across <span className="text-gold">Class Levels</span>
            </h2>

            <div className="space-y-4">
              {content.classRelevance.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 glass rounded-xl p-5">
                  <GraduationCap className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Topics */}
        <section className="py-16 bg-slate-950/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Explore <span className="text-cyan">Other Topics</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {TOPICS.map((t) => (
                <Link
                  key={t.id}
                  href={`/topics/${t.id}`}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    t.id === topic
                      ? "bg-cyan text-slate-950"
                      : "glass text-gray-300 hover:text-white hover:border-cyan/30"
                  }`}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="glass-cyan rounded-2xl p-10">
              <Target className="h-12 w-12 text-gold mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Need Help with <span className="text-cyan">{content.title}</span>?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Whether you&apos;re struggling with basics or preparing for competitive exams, Aarti Ma&apos;am tailors each session to your level and goals.
              </p>
              <a
                href={`https://wa.me/${SITE_METADATA.whatsapp}?text=${encodeURIComponent(`Hi Aarti, I want ${content.title} coaching. Please share details about classes.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold to-amber-500 text-slate-950 font-bold px-8 py-4 rounded-lg text-lg hover:shadow-xl hover:shadow-gold/20 transition-all"
              >
                <span>Start Your FREE Demo</span>
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
