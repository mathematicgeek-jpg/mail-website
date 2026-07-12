import { Award, Target, BookOpen, BarChart3, Star, CheckCircle } from "lucide-react";

export default function About() {
  const steps = [
    {
      icon: <BookOpen className="h-6 w-6 text-cyan" />,
      title: "Grasp Concepts",
      desc: "Interactive conceptual learning instead of dry memorization.",
    },
    {
      icon: <Target className="h-6 w-6 text-gold" />,
      title: "Reinforce Tricks",
      desc: "Applying speed formulas and Vedic shortcuts for quick results.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-cyan" />,
      title: "Analyze Gaps",
      desc: "Weekly chapter tests to diagnose and resolve errors early.",
    },
    {
      icon: <Award className="h-6 w-6 text-gold" />,
      title: "Feedback Loop",
      desc: "Regular progress updates shared with parents and students.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-slate-950/40 relative">
      {/* Glow decorations */}
      <div className="absolute top-[30%] right-[-10%] w-96 h-96 bg-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Teacher Details */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold uppercase tracking-wider">
              <Star className="h-3.5 w-3.5 fill-cyan" />
              <span>Meet the Mentor</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Aarti Agarwal
              <span className="block text-lg font-medium text-gold mt-1 glow-text-gold">
                Mathematics Merit Score Expert
              </span>
            </h2>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              With over 15 years of dedicated experience, Aarti Ma&apos;am specializes in building structured learning paths that help students master mathematics. She maps individual student learning patterns to identify bottlenecks and uses tailored tricks to unlock mathematical thinking.
            </p>

            <div className="space-y-3">
              {[
                "Custom coaching blueprints based on student learning speed",
                "Proven expertise with CBSE, ICSE, IB, GCSE, and Oxford curricula",
                "Creator of Vedic speed-calculation blueprints for competitive success",
                "Personalized mentor for 500+ successful scorers across the globe",
              ].map((point, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm text-gray-300">
                  <CheckCircle className="h-5 w-5 text-cyan shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Teaching Methodology (G.R.A.F.) */}
          <div className="glass p-6 md:p-8 rounded-3xl border border-cyan/15 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan/5 blur-2xl rounded-full"></div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Our Methodology</h3>
              <p className="text-xs text-gray-400">
                How our signature <span className="text-cyan font-semibold">G.R.A.F. Teaching Framework</span> ensures student success:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step) => (
                <div key={step.title} className="bg-slate-950/60 border border-gray-800/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-900 rounded-xl border border-cyan/10">
                      {step.icon}
                    </div>
                    <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
