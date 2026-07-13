import { CheckCircle2 } from "lucide-react";

export default function ClassGallery() {
  const environments = [
    {
      id: "physical",
      title: "Physical Home Tuitions",
      subtitle: "One-on-One Personalized Attention",
      image: "/physical_class.png",
      description: "In-person coaching sessions in a distraction-free home environment. Aarti Ma'am works side-by-side with the student to pinpoint learning blocks, explain complex derivations on paper, and teach Vedic math techniques directly.",
      features: [
        "Personalized face-to-face attention",
        "Direct correction of paper-pencil solving errors",
        "Custom pacing based on student absorption",
        "Ideal for Classes 6th–12th Board Exam preparation"
      ],
      badge: "In-Person",
      badgeColor: "bg-cyan/10 text-[#0e7490] border-cyan/20"
    },
    {
      id: "online",
      title: "Interactive Online Coaching",
      subtitle: "Virtual Whiteboard & Live Interaction",
      image: "/online_class.png",
      description: "Highly engaging live online sessions powered by digital whiteboards, screen sharing, and interactive math tools. Students can attend from anywhere while receiving real-time guidance, worksheets, and diagnostic scoring.",
      features: [
        "Live interactive whiteboards & 3D geometric visualizations",
        "Class recordings available for revision anytime",
        "Digital blueprints & instant PDF sheet sharing",
        "Convenient schedule coordination for busy students"
      ],
      badge: "Online Live",
      badgeColor: "bg-gold/10 text-[#b45309] border-gold/20"
    }
  ];

  return (
    <section id="gallery" className="py-24 bg-slate-50 border-y border-slate-200/60 relative">
      <div className="absolute top-[20%] left-[-10%] w-[30rem] h-[30rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[30rem] h-[30rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-[#0e7490] text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Class Formats</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Our Learning Environments
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Choose the coaching format that fits your student's learning style. We deliver result-driven math sessions both in-person and virtually.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {environments.map((env) => (
            <div 
              key={env.id}
              className="bg-[#ffffff] border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group hover:scale-[1.01] transition-all duration-300"
            >
              <div>
                {/* Image Wrap */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900 border-b border-slate-200">
                  <img 
                    src={env.image} 
                    alt={env.title}
                    className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <span className={`absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 border ${env.badgeColor}`}>
                    {env.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#111827]">
                      {env.title}
                    </h3>
                    <p className="text-sm font-semibold text-[#b45309] mt-1">
                      {env.subtitle}
                    </p>
                  </div>

                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    {env.description}
                  </p>

                  <div className="border-t border-slate-100 pt-6 space-y-3">
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Key Advantages:
                    </span>
                    <ul className="space-y-3">
                      {env.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-3 text-sm text-gray-400">
                          <CheckCircle2 className="h-5 w-5 text-[#059669] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
