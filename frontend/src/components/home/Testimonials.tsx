"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Star, Quote, ArrowUpRight, MessageSquare, Heart } from "lucide-react";

interface TestimonialType {
  id: string;
  name: string;
  student_class: string;
  board: string;
  rating: number;
  testimonial: string;
  improvement: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);

  // High quality static fallbacks (from client details)
  const fallbackTestimonials = [
    {
      id: "t1",
      name: "Rohan Malhotra (Parent of Shrey)",
      student_class: "Class 10",
      board: "ICSE",
      rating: 5,
      testimonial: "Aarti Ma'am completely transformed Shrey's attitude towards math. He went from struggling to secure passing marks to scoring a brilliant 94% in his ICSE board exams. Her focus on conceptual clarity and speed tricks works like magic.",
      improvement: "52% to 94% score improvement",
    },
    {
      id: "t2",
      name: "Meera Sen (Parent of Ananya)",
      student_class: "Class 12",
      board: "CBSE",
      rating: 5,
      testimonial: "The G.R.A.F methodology is highly structured and effective. Ananya enjoyed the live sessions and learned Vedic math shortcuts that saved her a lot of time in her MCQ sections. Highly recommend Aarti Ma'am!",
      improvement: "68% to 96% score improvement",
    },
    {
      id: "t3",
      name: "Devanshu Saxena",
      student_class: "Class 10",
      board: "CBSE",
      rating: 5,
      testimonial: "I used to get very anxious during math exams and make silly calculation mistakes. The mental math shortcuts and weekly diagnostic tests helped me build speed and double-check my answers quickly. Scored 98/100!",
      improvement: "98/100 in board exam",
    },
  ];

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await api.fetchTestimonials(true);
        if (data && data.length > 0) {
          // Normalize API fields
          const mapped = data.map((t: any) => ({
            id: t.id,
            name: t.name,
            student_class: t.studentClass || t.student_class || "",
            board: t.board || "",
            rating: t.rating || 5,
            testimonial: t.testimonial,
            improvement: t.improvement || "",
          }));
          setTestimonials(mapped);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-slate-950/40 relative">
      <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="h-3.5 w-3.5 fill-cyan" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Proven Results That Speak for Themselves
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Read how parents and students experienced a massive shift in their speed, calculation confidence, and board exam marks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="glass p-6 md:p-8 rounded-3xl border border-cyan/10 relative flex flex-col justify-between shadow-xl"
            >
              {/* Quote icon watermark */}
              <Quote className="absolute top-6 right-6 h-12 w-12 text-cyan/5 pointer-events-none" />

              <div>
                {/* Rating stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                  ))}
                </div>

                {/* Testimonial body */}
                <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">
                  "{item.testimonial}"
                </p>
              </div>

              <div className="border-t border-gray-800/80 pt-4 mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">
                    {item.name}
                  </span>
                  {item.improvement && (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span>{item.improvement}</span>
                    </span>
                  )}
                </div>
                <span className="block text-xs text-gray-500 font-medium">
                  {item.student_class} | {item.board} Board
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
