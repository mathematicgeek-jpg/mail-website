"use client";

import { useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

export default function Faq() {
  const faqs = [
    {
      question: "What grades do you teach mathematics for?",
      answer: "We provide expert mathematics coaching for students from Class 6th to 12th, covering all major educational boards including CBSE, ICSE, IB, GCSE, Cambridge, and Oxford curricula.",
    },
    {
      question: "Do you offer online mathematics coaching?",
      answer: "Yes, we offer both online and offline mathematics coaching with flexible teaching modes including one-on-one personalized sessions and small group classes. Our online sessions are conducted via interactive platforms with screen sharing and digital whiteboards.",
    },
    {
      question: "What is Vedic Mathematics and how does it help?",
      answer: "Vedic Mathematics is an ancient system of calculation that enables students to solve complex mathematical problems 10-15 times faster using mental math techniques. It improves calculation speed, accuracy, and builds confidence for competitive exams like SAT, CBSE, ICSE, IB, and other board exams.",
    },
    {
      question: "What are the teaching modes available?",
      answer: "We offer four teaching modes: (1) Offline classes at our center, (2) Online classes via video conferencing, (3) One-on-one personalized tutoring, and (4) Small group classes with 3-5 students for peer learning.",
    },
    {
      question: "How can I book a free demo class?",
      answer: "You can book a free demo class by filling out the contact form on our website, calling us at +91 9639351708, or sending an email to mathematicgeek@gmail.com. We'll schedule a convenient time for your trial session.",
    },
    {
      question: "What is the student success rate?",
      answer: "Our students consistently achieve 95%+ average scores in their board exams and show significant improvement in problem-solving speed and confidence. We have a proven track record of helping students excel in CBSE, ICSE, IB, and GCSE examinations.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-950/20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-sm">
            Everything you need to know about our math coaching methodology, scheduling, and learning modes.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="glass-cyan border border-cyan/10 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left text-sm sm:text-base font-bold text-white focus:outline-none transition-colors hover:bg-cyan/5"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-cyan shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 shrink-0 ml-4" />
                  )}
                </button>
                
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-96 border-t border-cyan/5" : "max-h-0"
                  }`}
                >
                  <p className="px-6 py-5 text-sm text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
