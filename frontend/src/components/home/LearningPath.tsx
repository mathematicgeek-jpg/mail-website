"use client";

import { useEffect, useState } from "react";
import { getGamificationProfile } from "@/lib/gamification";
import { Lock, Unlock, MapPin, Zap, Brain, Clipboard, Medal, Star } from "lucide-react";

interface PathStage {
  id: number;
  levelRequired: number;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  benefits: string[];
  color: string;
  tag: string;
}

const STAGES: PathStage[] = [
  {
    id: 1,
    levelRequired: 1,
    title: "Vedic Speed Arithmetic",
    subtitle: "Mental Math Foundations",
    description: "Eliminate calculator dependence. Master speed techniques for mental addition, multiplication, squaring, and divisions using ancient Vedic principles.",
    icon: Zap,
    benefits: ["Save 15-20 minutes in board exams", "Perform 2-digit calculations in under 3 seconds", "Double-check answers instantly"],
    color: "cyan",
    tag: "Level 1: Active",
  },
  {
    id: 2,
    levelRequired: 2,
    title: "Core Concepts Alignment",
    subtitle: "Algebra & Geometry Mastery",
    description: "Bridge the transition to complex variables. Crack abstract algebra equations and master geometric theorems with visual conceptual graphics.",
    icon: Brain,
    benefits: ["Conquer trigonometry and graph curves", "Solve equations step-by-step", "Understand logic, not rote memorization"],
    color: "gold",
    tag: "Unlock at Level 2",
  },
  {
    id: 3,
    levelRequired: 3,
    title: "Board Exam Preparation",
    subtitle: "CBSE / ICSE / IB Syllabus Focus",
    description: "High-scoring board syllabus alignment. Weekly test series, past paper analysis, and answer presentation techniques to target 95%+ marks.",
    icon: Clipboard,
    benefits: ["Master exact marking schemes", "Receive customized test corrections", "Learn board-specific speed tricks"],
    color: "green",
    tag: "Unlock at Level 3",
  },
  {
    id: 4,
    levelRequired: 4,
    title: "Olympiad & Ranker Squad",
    subtitle: "Advanced Problem Solving",
    description: "Advanced logical reasoning and higher-level maths preparing students for national talent searches, Math Olympiads, and competitive entrance preparation.",
    icon: Medal,
    benefits: ["Target IIT-JEE / Foundation algebra", "Solve non-standard logic problems", "Gain national percentile confidence"],
    color: "red",
    tag: "Unlock at Level 4",
  },
];

export default function LearningPath() {
  const [userLevel, setUserLevel] = useState(1);
  const [selectedStage, setSelectedStage] = useState<PathStage>(STAGES[0]);

  useEffect(() => {
    const checkLevel = () => {
      const profile = getGamificationProfile();
      setUserLevel(profile.level);
    };
    checkLevel();
    window.addEventListener("gamificationUpdate", checkLevel);
    return () => window.removeEventListener("gamificationUpdate", checkLevel);
  }, []);

  return (
    <section className="py-24 bg-slate-900 border-y border-slate-200/60 relative">
      <div className="absolute top-[20%] left-[-10%] w-[30rem] h-[30rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[30rem] h-[30rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold uppercase tracking-widest mb-3">
            <Star className="h-3.5 w-3.5 fill-gold animate-pulse" />
            <span>Structured Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Vedic Math to Board Exam Journey
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Track your levels and progress through four conceptual stages. Click a path node to view stage secrets!
          </p>
        </div>

        {/* Roadmap Interaction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          
          {/* Timeline Node Map Column */}
          <div className="lg:col-span-2 relative flex flex-col items-center justify-between py-8 space-y-16">
            
            {/* Visual connecting line */}
            <div className="absolute top-0 bottom-0 left-[50%] -translate-x-[50%] w-1 bg-gradient-to-b from-cyan via-gold to-slate-800 z-0"></div>

            {STAGES.map((stage, idx) => {
              const isUnlocked = userLevel >= stage.levelRequired;
              const isSelected = selectedStage.id === stage.id;
              const Icon = stage.icon;

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage)}
                  className={`group relative z-10 flex items-center justify-center h-16 w-16 rounded-full border-2 transition-all duration-300 ${
                    isSelected
                      ? "bg-slate-900 border-gold shadow-[0_0_15px_rgba(217,119,6,0.5)] scale-110"
                      : isUnlocked
                      ? "bg-slate-950 border-cyan hover:border-gold hover:scale-105 shadow-md shadow-cyan/10"
                      : "bg-slate-900/90 border-slate-700 text-slate-500 scale-95 hover:border-slate-600"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${
                    isSelected
                      ? "text-gold"
                      : isUnlocked
                      ? "text-cyan group-hover:text-gold"
                      : "text-slate-500"
                  }`} />

                  {/* Absolute Badge locks */}
                  <span className={`absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full flex items-center justify-center border text-[9px] font-bold ${
                    isUnlocked
                      ? "bg-slate-950 border-emerald-400 text-emerald-400"
                      : "bg-slate-950 border-slate-700 text-slate-500"
                  }`}>
                    {isUnlocked ? <Unlock className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
                  </span>

                  {/* Float title tooltip */}
                  <span className={`absolute whitespace-nowrap text-xs font-semibold px-2 py-1 rounded-md border bg-slate-950 z-20 transition-all ${
                    idx % 2 === 0
                      ? "right-20 group-hover:translate-x-1"
                      : "left-20 group-hover:-translate-x-1"
                  } ${
                    isSelected
                      ? "text-gold border-gold"
                      : isUnlocked
                      ? "text-white border-cyan/30"
                      : "text-slate-500 border-slate-800"
                  }`}>
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Details Card Panel Column */}
          <div className="lg:col-span-3">
            <div className="bg-[#ffffff] border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden transition-all duration-300 min-h-[380px] flex flex-col justify-between">
              
              {/* Top Accent glow */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                selectedStage.levelRequired <= userLevel 
                  ? "bg-gradient-to-r from-cyan to-gold"
                  : "bg-slate-300"
              }`}></div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      selectedStage.levelRequired <= userLevel
                        ? "bg-cyan/10 text-cyan border border-cyan/20"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}>
                      {selectedStage.tag}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-3">{selectedStage.title}</h3>
                    <p className="text-sm font-semibold text-gold mt-1">{selectedStage.subtitle}</p>
                  </div>
                  
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    selectedStage.levelRequired <= userLevel
                      ? "bg-cyan/5 border-cyan/20 text-cyan"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                  }`}>
                    {selectedStage.levelRequired <= userLevel ? (
                      <Unlock className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {selectedStage.description}
                </p>

                {/* Benefits checklist */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Key Outcomes:
                  </span>
                  {selectedStage.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Info Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                {selectedStage.levelRequired <= userLevel ? (
                  <span className="text-emerald-500 flex items-center">
                    🟢 Unlocked! Ready to learn.
                  </span>
                ) : (
                  <span className="text-red flex items-center">
                    🔒 Raise your level to {selectedStage.levelRequired} to unlock this syllabus.
                  </span>
                )}
                
                <span className="text-slate-400">Step {selectedStage.id} of 4</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
