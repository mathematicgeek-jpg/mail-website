"use client";

import Link from "next/link";
import { MessageSquare, Calendar, Award, Zap, ShieldCheck } from "lucide-react";
import { SITE_METADATA } from "@/lib/constants";

export default function Hero() {
  const prefilledMessage = encodeURIComponent(
    "Hi Aarti, I visited your website and would like to book a FREE demo math class."
  );
  const whatsappUrl = `https://wa.me/${SITE_METADATA.whatsapp}?text=${prefilledMessage}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Dynamic Animated Backdrop Elements */}
      <div className="absolute inset-0 bg-slate-950"></div>
      
      {/* Background gradients/glow circles */}
      <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] bg-cyan/10 rounded-full blur-[100px] animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] bg-gold/5 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Banner Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold uppercase tracking-widest animate-float">
          <Zap className="h-4 w-4 animate-bounce" />
          <span>Vedic Math & Board Exam Mastery</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white max-w-5xl mx-auto">
          Transform Your Mathematics Journey from{" "}
          <span className="bg-gradient-to-r from-cyan via-cyan-400 to-teal-400 bg-clip-text text-transparent glow-text-cyan">
            Fear
          </span>{" "}
          to{" "}
          <span className="bg-gradient-to-r from-gold via-yellow-400 to-amber-300 bg-clip-text text-transparent glow-text-gold">
            Excellence
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-400 font-normal leading-relaxed">
          Personalized online live coaching & offline home tuitions for <span className="text-cyan font-medium">Classes 6th–12th</span>. Custom curriculum prep for CBSE, ICSE, IB, GCSE, Cambridge, and Oxford boards by Merit Score Expert <span className="text-gold font-medium">Aarti Agarwal</span>.
        </p>

        {/* Highlights Tags */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
          <div className="flex items-center space-x-3 bg-slate-900/60 border border-cyan/10 rounded-2xl p-4 text-left">
            <Award className="h-10 w-10 text-cyan shrink-0" />
            <div>
              <span className="block text-xl font-bold text-white">15+ Years</span>
              <span className="text-xs text-gray-400">Teaching Experience</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-900/60 border border-cyan/10 rounded-2xl p-4 text-left">
            <ShieldCheck className="h-10 w-10 text-gold shrink-0" />
            <div>
              <span className="block text-xl font-bold text-white">95%+ Scores</span>
              <span className="text-xs text-gray-400">Consistent Board Results</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-900/60 border border-cyan/10 rounded-2xl p-4 text-left col-span-2 md:col-span-1">
            <Zap className="h-10 w-10 text-emerald-400 shrink-0" />
            <div>
              <span className="block text-xl font-bold text-white">10x Speed</span>
              <span className="text-xs text-gray-400">Vedic Math Techniques</span>
            </div>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          {/* Main CTA */}
          <Link
            href="/#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-2xl bg-gradient-to-r from-cyan to-gold text-slate-950 hover:opacity-95 shadow-xl transition-all hover:scale-105"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book Free Demo Class
          </Link>

          {/* Secondary WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-cyan/20 text-base font-semibold rounded-2xl text-cyan bg-slate-900/50 hover:bg-slate-900 transition-all hover:scale-105 hover:border-cyan"
          >
            <MessageSquare className="mr-2 h-5 w-5 text-emerald-400" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Small Trust Tag */}
        <p className="text-xs text-gray-500 pt-4">
          No credit card required. Demo class is 100% free with zero obligations.
        </p>
      </div>
    </section>
  );
}
