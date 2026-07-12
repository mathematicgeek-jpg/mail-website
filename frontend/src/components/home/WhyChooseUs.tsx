import { Lightbulb, Compass, Zap, Hourglass, Shield, RefreshCw } from "lucide-react";

export default function WhyChooseUs() {
  const differentiators = [
    {
      icon: <Lightbulb className="h-6 w-6 text-cyan" />,
      title: "Analytical Thinking",
      desc: "We focus on teaching students *how* to think mathematically rather than rote memorization.",
    },
    {
      icon: <Zap className="h-6 w-6 text-gold" />,
      title: "Vedic Math Speed",
      desc: "We integrate Vedic calculation secrets to help students solve complex equations 10x faster.",
    },
    {
      icon: <Compass className="h-6 w-6 text-cyan" />,
      title: "Customized Blueprint",
      desc: "Every student gets a custom roadmap tailored to their speed, weaknesses, and academic goals.",
    },
    {
      icon: <Hourglass className="h-6 w-6 text-gold" />,
      title: "Time Management",
      desc: "Our mock exams prepare students to complete board papers with 20 minutes left to review.",
    },
    {
      icon: <Shield className="h-6 w-6 text-cyan" />,
      title: "Board Exam Mastery",
      desc: "15+ years of experience helping students score 95%+ in CBSE, ICSE, IB, and GCSE board exams.",
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-gold" />,
      title: "Continuous Feedback",
      desc: "Weekly progress updates, diagnostic test scoring, and close parent-teacher alignment.",
    },
  ];

  return (
    <section className="py-24 bg-slate-950/20 relative">
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-cyan/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose Aarti Mathematics Geek?
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            6 core pillars that make us the preferred choice for math tutoring among parents and students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((diff, index) => (
            <div
              key={index}
              className="glass p-6 rounded-2xl border border-gray-800/80 hover:border-cyan/20 transition-all duration-300 shadow-lg group hover:scale-[1.02]"
            >
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-gray-800 w-fit mb-5 group-hover:border-cyan/20 transition-colors">
                {diff.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                {diff.title}
              </h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                {diff.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
