"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Calendar, Award, Zap, ShieldCheck, Check } from "lucide-react";
import { SITE_METADATA } from "@/lib/constants";

export default function Hero() {
  const [calculationMode, setCalculationMode] = useState<"traditional" | "vedic">("traditional");
  const [traditionalSteps, setTraditionalSteps] = useState<string[]>([]);
  const [vedicSteps, setVedicSteps] = useState<string[]>([]);

  const prefilledMessage = encodeURIComponent(
    "Hi Aarti Ma'am, I visited your website and would like to book a FREE demo math class."
  );
  const whatsappUrl = `https://wa.me/${SITE_METADATA.whatsapp}?text=${prefilledMessage}`;

  // Interactive animation sequence loops
  useEffect(() => {
    const timer = setInterval(() => {
      setCalculationMode((prev) => (prev === "traditional" ? "vedic" : "traditional"));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-slate-950"></div>
      <div className="absolute top-[20%] left-[-10%] w-[35rem] h-[35rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[35rem] h-[35rem] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Banner Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-bold uppercase tracking-wider">
              <Zap className="h-4 w-4 animate-bounce text-gold" />
              <span>Vedic Math & 95%+ Board Exam Mastery</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-extrabold tracking-tight leading-tight text-white">
              Learn Math with{" "}
              <span className="bg-gradient-to-r from-cyan via-cyan-400 to-teal-400 bg-clip-text text-transparent glow-text-cyan">
                10x Speed
              </span>{" "}
              & Build Board Exam{" "}
              <span className="bg-gradient-to-r from-gold via-yellow-400 to-amber-300 bg-clip-text text-transparent glow-text-gold">
                Confidence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl font-normal">
              Live interactive classes & offline home tuitions for <span className="text-cyan font-semibold">Classes 6th–12th</span>. Custom curriculum for CBSE, ICSE, and IB boards powered by gamified practice sets.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-2xl bg-gradient-to-r from-cyan to-gold text-[#111827] hover:opacity-95 shadow-xl transition-all hover:scale-105"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Start Free Trial Class
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-base font-semibold rounded-2xl text-[#111827] bg-[#FFFFFF] hover:bg-slate-50 transition-all hover:scale-105"
              >
                <MessageSquare className="mr-2 h-5 w-5 text-emerald-600" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Trust stats pill */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-900 max-w-lg">
              <div>
                <span className="block text-2xl font-bold text-white">15+ Yrs</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Experience</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">95%+</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Scorers</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">500+</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Mentored</span>
              </div>
            </div>

          </div>

          {/* Right Column: Calculations Demo Animation Widget */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="bg-slate-900 border border-slate-200 rounded-3xl p-6 shadow-lg backdrop-blur-sm w-full max-w-md relative overflow-hidden flex flex-col justify-between h-[360px]">
              
              {/* Header Selector tabs */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Calculating: 98 × 97
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCalculationMode("traditional")}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border transition-all ${
                      calculationMode === "traditional"
                        ? "bg-slate-800 text-white border-slate-700"
                        : "bg-transparent text-slate-500 border-transparent hover:text-slate-400"
                    }`}
                  >
                    Traditional
                  </button>
                  <button
                    onClick={() => setCalculationMode("vedic")}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border transition-all ${
                      calculationMode === "vedic"
                        ? "bg-cyan/10 text-cyan border-cyan/20"
                        : "bg-transparent text-slate-500 border-transparent hover:text-slate-400"
                    }`}
                  >
                    Vedic Magic
                  </button>
                </div>
              </div>

              {/* Demo Calculation Display */}
              <div className="flex-grow flex flex-col justify-center font-mono">
                {calculationMode === "traditional" ? (
                  <div className="space-y-1.5 text-slate-400 text-sm pl-4 animate-pulse">
                    <p className="text-right pr-16">98</p>
                    <p className="text-right pr-16">× 97</p>
                    <div className="border-t border-slate-800 w-32 ml-auto mr-12 my-1"></div>
                    <p className="text-right pr-16">686  (7 × 98)</p>
                    <p className="text-right pr-16">+ 8820  (90 × 98)</p>
                    <div className="border-t border-slate-800 w-32 ml-auto mr-12 my-1"></div>
                    <p className="text-right pr-16 text-white font-bold">9506  (Takes 25s)</p>
                  </div>
                ) : (
                  <div className="space-y-4 pl-4">
                    <div className="flex items-center space-x-6 justify-center">
                      <div className="text-center">
                        <span className="text-sm font-bold text-white block">98</span>
                        <span className="text-sm text-red font-semibold block mt-1">-2 (from 100)</span>
                      </div>
                      <span className="text-slate-700 text-lg font-bold">×</span>
                      <div className="text-center">
                        <span className="text-sm font-bold text-white block">97</span>
                        <span className="text-sm text-red font-semibold block mt-1">-3 (from 100)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-center text-sm border-t border-cyan/10 pt-4 max-w-xs mx-auto">
                      <p className="text-slate-300">
                        Left: <span className="text-white font-bold">98 - 3 = 95</span>
                      </p>
                      <p className="text-slate-300">
                        Right: <span className="text-white font-bold">-2 × -3 = 06</span>
                      </p>
                      <p className="text-base font-bold text-[#059669] font-mono mt-2">
                        Result: <span className="text-[#b45309] glow-text-gold font-extrabold text-lg">9506</span> (Takes 2s!)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Slider footer */}
              <div className="mt-4 pt-4 border-t border-cyan/5 text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-ping"></span>
                  {calculationMode === "traditional"
                    ? "Traditional method requires carrying & summation steps."
                    : "Vedic methods resolve calculations in single-line grids."}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
