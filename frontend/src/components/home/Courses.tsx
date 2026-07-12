import { BookOpen, GraduationCap, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Courses() {
  const courses = [
    {
      title: "Foundation Building",
      grades: "Classes 6th - 8th",
      description: "Nurturing logical thinking, removing math fear, and introducing basic mental calculation shortcuts.",
      features: [
        "Interactive math concepts",
        "Vedic speed tricks starter",
        "Home worksheet practice modules",
        "Daily practice templates",
      ],
      icon: <Compass className="h-6 w-6 text-cyan" />,
      color: "cyan",
    },
    {
      title: "Board & Competitive Focus",
      grades: "Classes 9th - 12th",
      description: "Rigorous concept mastery, past board paper revision, and test series for CBSE, ICSE, IB, and GCSE.",
      features: [
        "Advanced Algebra & Calculus",
        "Trigonometry cheat sheets",
        "Structured board test series",
        "Time management mock tests",
      ],
      icon: <GraduationCap className="h-6 w-6 text-gold" />,
      color: "gold",
    },
  ];

  return (
    <section id="courses" className="py-24 bg-slate-950 relative">
      {/* Glow decorations */}
      <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Structured Programs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Curated Programs for Academic Success
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            No matter the student&apos;s current grade or difficulty level, we have a targeted learning framework designed to build calculations speed and analytical reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {courses.map((course) => {
            const isCyan = course.color === "cyan";
            return (
              <div
                key={course.title}
                className={`relative p-6 md:p-8 rounded-3xl overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 ${
                  isCyan ? "glass-cyan" : "glass-gold"
                }`}
              >
                {/* Visual decoration */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 blur-3xl opacity-20 rounded-full ${
                  isCyan ? "bg-cyan" : "bg-gold"
                }`}></div>

                <div className="flex items-center space-x-4 mb-6">
                  <div className={`p-3 rounded-2xl ${
                    isCyan ? "bg-cyan/10 border border-cyan/20" : "bg-gold/10 border border-gold/20"
                  }`}>
                    {course.icon}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      {course.grades}
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {course.description}
                </p>

                <div className="border-t border-gray-800 pt-6 mb-8">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Course Inclusions:
                  </span>
                  <ul className="space-y-3">
                    {course.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3 text-xs text-gray-400">
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          isCyan ? "bg-cyan" : "bg-gold"
                        }`}></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/#contact"
                  className={`w-full inline-flex items-center justify-center py-3 rounded-2xl text-xs font-bold transition-all ${
                    isCyan
                      ? "bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan hover:text-slate-950"
                      : "bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-slate-950"
                  }`}
                >
                  <span>Schedule Trial Session</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
