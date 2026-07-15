"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, Play, Lock, CheckCircle2, ChevronRight, Calculator, Trophy, Star } from "lucide-react";
import { api } from "@/lib/api";

const QUESTIONS = [
  { q: "15", a: "225", n: 1 },
  { q: "25", a: "625", n: 2 },
  { q: "45", a: "2025", n: 4 },
];

export default function VedicMathGame() {
  const [stage, setStage] = useState<"hero" | "learning" | "game" | "paywall">("hero");
  const [qIndex, setQIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "hint" | "solution"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    studentClass: "",
    board: "",
    preferredMode: "Online",
    message: "I want to unlock the full Vedic Math Tricks pack!"
  });
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const fireConfetti = () => {
    // Simple lightweight CSS confetti generator
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    for (let i = 0; i < 40; i++) {
      const confetto = document.createElement('div');
      confetto.style.position = 'absolute';
      confetto.style.width = Math.random() > 0.5 ? '8px' : '6px';
      confetto.style.height = confetto.style.width;
      confetto.style.backgroundColor = ['#2563EB', '#16A34A', '#F59E0B', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 5)];
      confetto.style.left = '50%';
      confetto.style.top = '50%';
      confetto.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetto.style.pointerEvents = 'none';
      confetto.style.zIndex = '50';
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 100; // slight upward bias
      
      confetto.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.8 },
        { transform: `translate(calc(-50% + ${tx * 1.5}px), calc(-50% + ${ty * 1.5 + 50}px)) scale(0.5) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });
      
      container.appendChild(confetto);
      setTimeout(() => confetto.remove(), 2000);
    }
  };

  const handleStart = () => {
    setStage("learning");
  };

  const handleStartGame = () => {
    setStage("game");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const checkAnswer = () => {
    const currentQ = QUESTIONS[qIndex];
    if (inputValue.trim() === currentQ.a) {
      // Correct!
      fireConfetti();
      setFeedback({ type: "success", text: "🔥 Genius! You're faster than most students!" });
      
      setTimeout(() => {
        if (qIndex < QUESTIONS.length - 1) {
          setQIndex(qIndex + 1);
          setInputValue("");
          setFeedback(null);
          setAttempts(0);
          inputRef.current?.focus();
        } else {
          setStage("paywall");
        }
      }, 1800);
    } else {
      // Wrong
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts === 1) {
        setFeedback({ 
          type: "hint", 
          text: `Oops! Try again 👇 (Hint: ${currentQ.n} × ${currentQ.n + 1} = ?, then add 25)` 
        });
      } else if (newAttempts >= 2) {
        setFeedback({ 
          type: "solution", 
          text: `Solution: ${currentQ.n} × ${currentQ.n + 1} = ${currentQ.n * (currentQ.n + 1)}, so the answer is ${currentQ.a}` 
        });
      } else {
        setFeedback({ type: "error", text: "Oops! Try again 👇" });
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue) {
      checkAnswer();
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    
    try {
      await api.submitInquiry({ ...formData, source: "Vedic Math Game" });
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id="math-game">
      {/* Decorative bg elements */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          
          {/* STAGE: HERO */}
          {stage === "hero" && (
            <div className="text-center max-w-2xl mx-auto animate-fade-in">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Interactive Mini-Game</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight">
                Can You Multiply Faster Than a Calculator?
              </h2>
              <p className="text-lg text-[#374151] mb-10 leading-relaxed font-medium">
                Most students take 30 seconds to square a number ending in 5. Learn a secret Vedic Math trick and do it in under 5 seconds!
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button 
                  onClick={handleStart}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Start the Math Game
                </button>
                <p className="text-sm text-gray-500 font-semibold flex items-center mt-2 sm:mt-0">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  2,000+ students already learned this
                </p>
              </div>
            </div>
          )}

          {/* STAGE: LEARNING */}
          {stage === "learning" && (
            <div className="w-full max-w-lg bg-[#ffffff] rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
              <div className="bg-[#111827] p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan/20 to-transparent pointer-events-none"></div>
                <h3 className="text-2xl font-bold text-white relative z-10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
                  The Magic Trick
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-[#111827] font-semibold text-lg text-center">
                  Any number ending in 5 can be squared instantly!
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <p className="text-[#374151] font-bold text-center mb-4">Example: What is 35² ?</p>
                  <ul className="space-y-4 text-sm md:text-base text-[#374151]">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3 mt-0.5 text-xs">1</span>
                      <span>Multiply the first digit (3) by the next number (4) &rarr; <strong className="text-[#111827]">3 × 4 = 12</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3 mt-0.5 text-xs">2</span>
                      <span>Simply add "25" to the end &rarr; <strong className="text-[#111827]">1225</strong></span>
                    </li>
                  </ul>
                </div>
                <p className="text-center text-lg font-bold text-[#16A34A]">
                  😲 That's it! 35² = 1225
                </p>
                <button 
                  onClick={handleStartGame}
                  className="w-full inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-2xl shadow-md transition-colors"
                >
                  I'm ready! Let me try
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE: GAME */}
          {stage === "game" && (
            <div className="w-full max-w-md bg-[#ffffff] rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in relative">
              <div id="confetti-container" className="absolute inset-0 pointer-events-none z-50 overflow-hidden"></div>
              
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Question {qIndex + 1} of 3</span>
                <span className="flex items-center text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                  <Trophy className="w-4 h-4 mr-1" /> Score: {qIndex}/3
                </span>
              </div>
              
              <div className="p-8 text-center space-y-6">
                <h3 className="text-xl font-bold text-[#374151]">What is</h3>
                <div className="text-6xl font-extrabold text-[#111827] tracking-tighter">
                  {QUESTIONS[qIndex].q}² ?
                </div>
                
                <div className="pt-4">
                  <input
                    ref={inputRef}
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter answer"
                    className="w-full text-center text-2xl font-bold py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[#111827] focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
                
                {feedback && (
                  <div className={`p-4 rounded-xl text-sm font-bold animate-fade-in ${
                    feedback.type === "success" ? "bg-green-100 text-[#16A34A]" : 
                    "bg-red-50 text-[#dc2626]"
                  }`}>
                    {feedback.text}
                  </div>
                )}
                
                <button 
                  onClick={checkAnswer}
                  disabled={!inputValue.trim()}
                  className="w-full inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-md transition-colors"
                >
                  Submit Answer
                </button>
              </div>
            </div>
          )}

          {/* STAGE: PAYWALL / LEAD FORM */}
          {stage === "paywall" && (
            <div className="w-full max-w-3xl bg-[#ffffff] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in flex flex-col md:flex-row">
              {/* Benefits Section */}
              <div className="w-full md:w-5/12 bg-[#111827] p-8 text-white relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan/20 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Brilliant!</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Want to learn 10+ tricks like this?</h3>
                  <p className="text-gray-400 text-sm mb-6">Unlock our full Vedic Math Secrets pack and become a human calculator.</p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                      <span className="text-sm font-medium">Multiply 3-digit numbers in seconds</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                      <span className="text-sm font-medium">Calculate faster than calculators</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                      <span className="text-sm font-medium">Boost exam speed & confidence</span>
                    </li>
                  </ul>
                  
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center">
                    <Lock className="w-8 h-8 text-gold mr-3 shrink-0" />
                    <p className="text-xs text-gray-300 font-medium leading-tight">
                      Register now to unlock these techniques in a free interactive demo class!
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="w-full md:w-7/12 p-8">
                {submitSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in py-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#111827]">Tricks Unlocked!</h3>
                    <p className="text-[#374151]">
                      Thank you for registering. Aarti Ma'am will contact you shortly to schedule your free demo class and share the full tricks pack!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEnrollSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-[#111827] mb-6">Unlock Full Tricks Pack</h3>
                    
                    {submitError && (
                      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
                        {submitError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parent/Student Name *</label>
                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number *</label>
                        <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="+91 9999999999" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Student Class *</label>
                        <select required value={formData.studentClass} onChange={(e) => setFormData({...formData, studentClass: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                          <option value="">Select Class</option>
                          {[6,7,8,9,10,11,12].map(n => <option key={n} value={`Class ${n}`}>Class {n}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Board *</label>
                        <select required value={formData.board} onChange={(e) => setFormData({...formData, board: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                          <option value="">Select Board</option>
                          <option value="CBSE">CBSE</option>
                          <option value="ICSE">ICSE</option>
                          <option value="IB">IB</option>
                          <option value="IGCSE">IGCSE</option>
                          <option value="State Board">State Board</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mode *</label>
                        <select required value={formData.preferredMode} onChange={(e) => setFormData({...formData, preferredMode: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                          <option value="Online">Online Interactive</option>
                          <option value="Offline">Offline Home Tuition</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl shadow-md transition-all active:scale-[0.98]"
                    >
                      {loading ? "Unlocking..." : "Enroll Now to Unlock All Tricks"}
                      {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </button>
                    <p className="text-center text-xs font-medium text-gray-400 mt-3">
                      100% free demo class. No credit card required.
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
