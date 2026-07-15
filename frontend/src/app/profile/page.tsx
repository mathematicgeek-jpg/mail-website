"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getMaskedSessionId } from "@/lib/crypto";
import { 
  User, LogOut, ArrowRight, Brain, Zap, Target, 
  TrendingUp, Award, Play, ShieldCheck, CheckCircle2, Lock 
} from "lucide-react";

export default function ProfilePage() {
  const [playerName, setPlayerName] = useState("");
  const [sessionHash, setSessionHash] = useState<string | null>(null);
  
  // Simulated state for the dashboard
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("math_geek_player_name");
      const storedHash = localStorage.getItem("mg_session_hash");
      
      if (storedName) setPlayerName(storedName);
      if (storedHash) setSessionHash(storedHash);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mg_session_hash");
      localStorage.removeItem("math_geek_player_name");
      window.location.href = "/";
    }
  };

  const progressData = [
    { name: 'Vedic Maths Basics', progress: 50, color: 'bg-blue-500' },
    { name: 'Speed Multiplication', progress: 20, color: 'bg-cyan-500' },
    { name: 'Mental Calculation', progress: 0, color: 'bg-gray-300' }
  ];

  return (
    <>
      <Header />

      <main className="flex-grow pt-28 pb-24 bg-slate-50 min-h-screen relative font-sans">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* 1. HEADER */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
                My Dashboard
              </h1>
              <p className="text-[#374151] mt-2 font-medium">
                Track your learning journey and improve daily 🚀
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 md:mt-0 flex items-center text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Profile & Privacy */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 2. PROFILE + STATUS CARD */}
              <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md shrink-0">
                    <User className="w-8 h-8 text-[#ffffff]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#111827]">{playerName || "Guest"}</h2>
                    <p className="text-sm font-medium text-gray-500">Student Account</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Status</span>
                    {isEnrolled ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-[#16A34A]">
                        Enrolled ✅
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-[#F59E0B]">
                        Not Enrolled ❌
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Level</span>
                    <span className="text-sm font-bold text-[#2563EB]">Beginner</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Streak</span>
                    <span className="text-sm font-bold text-[#111827] flex items-center">
                      🔥 3 Days Active
                    </span>
                  </div>
                </div>

                {isEnrolled ? (
                  <button className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-[#ffffff] font-bold rounded-xl transition-all shadow-md">
                    Continue Learning
                  </button>
                ) : (
                  <Link href="/#contact" className="w-full flex items-center justify-center py-3 bg-[#F59E0B] hover:bg-amber-600 text-[#ffffff] font-bold rounded-xl transition-all shadow-md">
                    Enroll Now
                  </Link>
                )}
              </div>

              {/* 7. DATA PRIVACY (MINIMIZED) */}
              <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-5 shadow-sm flex items-start space-x-3">
                <Lock className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">Your data is सुरक्षित (secure)</h3>
                  <p className="text-xs text-[#374151] mt-1">We use encrypted sessions. No personal data is exposed.</p>
                  <button className="text-xs font-bold text-[#2563EB] mt-2 hover:underline">Learn More</button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Progress, Proficiency, Actions, CTA */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 3. LEARNING PROGRESS CARD */}
              <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#111827] flex items-center mb-6">
                  <TrendingUp className="w-5 h-5 text-[#2563EB] mr-2" />
                  Your Progress
                </h2>
                
                <div className="space-y-5">
                  {progressData.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1.5 font-bold">
                        <span className="text-[#111827]">{item.name}</span>
                        <span className="text-[#374151]">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: mounted ? `${item.progress}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1">🎯 Next Goal</p>
                    <p className="text-sm font-bold text-[#111827]">Complete "Vedic Squares Trick"</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-[#2563EB] text-[#ffffff] flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                </div>
              </div>

              {/* TWO COLUMN SUB-GRID FOR PROFICIENCY & ACTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 4. PROFICIENCY CARD */}
                <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-[#111827] flex items-center mb-6">
                    <Brain className="w-5 h-5 text-purple-500 mr-2" />
                    Your Proficiency
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#374151]">Speed</span>
                      <div className="flex text-yellow-400">⭐⭐⭐<span className="text-gray-200">⭐⭐</span></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#374151]">Accuracy</span>
                      <div className="flex text-yellow-400">⭐⭐⭐⭐<span className="text-gray-200">⭐</span></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#374151]">Concept Clarity</span>
                      <div className="flex text-yellow-400">⭐⭐<span className="text-gray-200">⭐⭐⭐</span></div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">📌 Recommendation</p>
                    <p className="text-sm font-bold text-[#111827]">Practice multiplication tricks</p>
                  </div>
                </div>

                {/* 5. QUICK ACTION CARD */}
                <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-[#111827] flex items-center mb-6">
                    <Zap className="w-5 h-5 text-amber-500 mr-2" />
                    Boost Your Skills
                  </h2>
                  
                  <div className="space-y-3">
                    <Link href="/games" className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 transition-colors group">
                      <span className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB]">Play Math Game</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB]" />
                    </Link>
                    <Link href="/games" className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 transition-colors group">
                      <span className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB]">Practice Tricks</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB]" />
                    </Link>
                    <Link href="/#courses" className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 transition-colors group">
                      <span className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB]">View Courses</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB]" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* 6. ENROLLMENT CTA BLOCK (HIGH PRIORITY) */}
              {!isEnrolled ? (
                <div className="bg-[#111827] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/20 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="relative z-10 mb-6 sm:mb-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#ffffff] mb-2">🚀 Unlock Full Learning Experience</h2>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-center text-sm font-medium text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] mr-2" /> 10+ Vedic Maths Tricks
                      </li>
                      <li className="flex items-center text-sm font-medium text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] mr-2" /> Faster Calculations
                      </li>
                      <li className="flex items-center text-sm font-medium text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] mr-2" /> Exam Confidence Boost
                      </li>
                    </ul>
                  </div>

                  <div className="relative z-10 w-full sm:w-auto shrink-0">
                    <Link href="/#contact" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-[#ffffff] text-sm font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
                      Enroll Now
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm text-center">
                  <h2 className="text-xl font-bold text-[#16A34A] mb-2">🎉 You’re Enrolled!</h2>
                  <p className="text-[#374151] text-sm mb-4">Continue your journey 👇</p>
                  <button className="inline-flex items-center justify-center px-6 py-3 bg-[#16A34A] hover:bg-green-700 text-[#ffffff] font-bold rounded-xl transition-colors">
                    Go to Dashboard
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
