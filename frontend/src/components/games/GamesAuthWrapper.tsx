"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowRight, Brain, Sparkles, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { generateSHA256Hash } from "@/lib/crypto";

export default function GamesAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    studentClass: "",
    board: "",
    preferredMode: "Online",
    message: "I want to unlock the Games Hub!"
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    // Check if session hash exists in local storage
    if (typeof window !== "undefined") {
      const sessionHash = localStorage.getItem("mg_session_hash");
      if (sessionHash) {
        setIsUnlocked(true);
      }
      setIsLoadingSession(false);
    }
  }, []);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    
    try {
      // 1. Submit lead to API
      await api.submitInquiry({ ...formData, source: "Games Hub Lock" });
      
      // 2. Securely hash identifier (email or phone) to avoid storing PII
      const identifier = formData.email ? formData.email.toLowerCase().trim() : formData.phone.trim();
      const hash = await generateSHA256Hash(identifier);
      
      // 3. Store hash & standard player name
      localStorage.setItem("mg_session_hash", hash);
      localStorage.setItem("math_geek_player_name", formData.name.split(" ")[0]); // set first name as nickname
      
      setIsUnlocked(true);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan"></div>
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 relative overflow-hidden flex items-center justify-center">
      {/* Decorative bg elements */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        <div className="w-full bg-[#111827] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row">
          {/* Benefits Section */}
          <div className="w-full md:w-5/12 bg-slate-900 p-8 text-white relative flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold uppercase tracking-wider mb-6">
                <Brain className="h-4 w-4" />
                <span>Games Hub Locked</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Ready to Play & Learn?</h3>
              <p className="text-gray-400 text-sm mb-6">Register your free account to unlock the Vedic Math gaming arena and climb the leaderboard.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-cyan mr-3 shrink-0" />
                  <span className="text-sm font-medium">Access timed math sprints</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-cyan mr-3 shrink-0" />
                  <span className="text-sm font-medium">Earn XP and unlock badges</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-cyan mr-3 shrink-0" />
                  <span className="text-sm font-medium">Compete on the global leaderboard</span>
                </li>
              </ul>
              
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center">
                <Lock className="w-8 h-8 text-gold mr-3 shrink-0" />
                <p className="text-xs text-gray-300 font-medium leading-tight">
                  Your privacy is our priority. Your session is secured via SHA-256 encryption.
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-7/12 p-8 bg-[#ffffff]">
            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-[#111827] mb-6">Register to Unlock Hub</h3>
              
              {submitError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Player Name *</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-colors" placeholder="Shrey M." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number *</label>
                  <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-colors" placeholder="+91 9999999999" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-colors" placeholder="player@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Student Class *</label>
                  <select required value={formData.studentClass} onChange={(e) => setFormData({...formData, studentClass: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-colors">
                    <option value="">Select Class</option>
                    {[6,7,8,9,10,11,12].map(n => <option key={n} value={`Class ${n}`}>Class {n}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Board *</label>
                  <select required value={formData.board} onChange={(e) => setFormData({...formData, board: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-colors">
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
                  <select required value={formData.preferredMode} onChange={(e) => setFormData({...formData, preferredMode: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-colors">
                    <option value="Online">Online Interactive</option>
                    <option value="Offline">Offline Home Tuition</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-bold text-slate-950 bg-cyan hover:bg-[#06b6d4] disabled:opacity-70 disabled:cursor-not-allowed rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                {loading ? "Registering & Encrypting..." : "Unlock Games Hub"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
