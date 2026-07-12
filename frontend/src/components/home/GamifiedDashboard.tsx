"use client";

import { useEffect, useState } from "react";
import { getGamificationProfile, saveGamificationProfile, GamificationProfile, BADGES } from "@/lib/gamification";
import { Award, ShieldAlert, Sparkles, RefreshCw, Edit2, Check } from "lucide-react";

export default function GamifiedDashboard() {
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  // Sync state initially and attach event listener for live updates
  useEffect(() => {
    const loadProfile = () => {
      const data = getGamificationProfile();
      setProfile(data);
      setTempName(data.playerName);
    };

    loadProfile();
    window.addEventListener("gamificationUpdate", loadProfile);
    return () => window.removeEventListener("gamificationUpdate", loadProfile);
  }, []);

  if (!profile) return null;

  const currentLevelXp = profile.xp % 100;
  const xpProgressPercent = Math.min(100, Math.max(0, currentLevelXp));

  const handleSaveName = () => {
    if (!tempName.trim()) return;
    const updated = { ...profile, playerName: tempName.trim() };
    saveGamificationProfile(updated);
    setIsEditingName(false);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your score and streak? This will erase all badges and XP!")) {
      const defaultProfile = {
        playerName: "Math Cadet",
        xp: 0,
        level: 1,
        streak: 0,
        lastPlayedDate: "",
        badges: [],
      };
      saveGamificationProfile(defaultProfile);
    }
  };

  return (
    <section id="profile-dashboard" className="py-20 bg-slate-900 border-y border-slate-200/60 relative">
      <div className="absolute top-[30%] left-[20%] w-[20rem] h-[20rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[30%] right-[20%] w-[20rem] h-[20rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[#b45309] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
            <span>Interactive Student Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Your Math Geek Dashboard
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Practice daily, earn experience points (XP), and unlock badges like a true math champion!
          </p>
        </div>

        {/* Dashboard grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Player Card */}
          <div className="bg-[#ffffff] border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Profile Name Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-full">
                  {isEditingName ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        maxLength={15}
                        className="bg-slate-50 border border-cyan/30 rounded-xl px-3 py-1.5 text-[#111827] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan w-full"
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#111827] truncate">
                        {profile.playerName}
                      </h3>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 text-slate-400 hover:text-cyan transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <span className="text-xs text-slate-400">Rank: Arithmetic Cadet</span>
                </div>
              </div>

              {/* Status Items Grid */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                  <span className="text-3xl block">🔥</span>
                  <span className="block text-xl font-extrabold text-[#111827] mt-1">
                    {profile.streak} {profile.streak === 1 ? "Day" : "Days"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Current Streak
                  </span>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                  <span className="text-3xl block">⭐</span>
                  <span className="block text-xl font-extrabold text-[#111827] mt-1">
                    Level {profile.level}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Current Rank
                  </span>
                </div>
              </div>
            </div>

            {/* Reset Stats */}
            <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center text-xs">
              <span className="text-slate-400">XP Earned: {profile.xp} XP</span>
              <button
                onClick={handleReset}
                className="flex items-center space-x-1 text-red hover:text-red-700 font-semibold transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset Profile</span>
              </button>
            </div>
          </div>

          {/* Column 2: XP Progression Bar */}
          <div className="bg-[#ffffff] border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-bold text-[#111827]">Level Progression</h4>
                <span className="text-xs text-[#0e7490] font-bold bg-cyan/5 px-2.5 py-1 rounded-full">
                  {currentLevelXp} / 100 XP to Level {profile.level + 1}
                </span>
              </div>
              
              {/* Custom Progression Bar */}
              <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden p-1 border border-slate-200">
                <div
                  style={{ width: `${xpProgressPercent}%` }}
                  className="bg-gradient-to-r from-cyan to-gold h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(8,145,178,0.3)]"
                ></div>
              </div>

              {/* Learning Insights Info */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-3 text-sm bg-slate-50 border border-slate-100 p-4 rounded-2xl text-gray-400">
                  <Award className="h-5 w-5 text-[#b45309] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[#111827]">How to earn points:</h5>
                    <p className="text-gray-400 mt-1 leading-relaxed">
                      Completing math tricks solver gives <span className="font-semibold text-[#0e7490]">+15 XP</span>. Answering interactive games correctly grants <span className="font-semibold text-[#0e7490]">+20 XP</span> per question. Practice daily to raise your streak!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="pt-6 border-t border-slate-100 mt-6">
              <h4 className="text-sm font-bold text-[#111827] mb-4">Your Achievements</h4>
              <div className="flex flex-wrap gap-4">
                {Object.values(BADGES).map((badge) => {
                  const unlocked = profile.badges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      title={`${badge.title}: ${badge.description}`}
                      className={`group relative flex items-center space-x-2 px-3 py-2 rounded-2xl border transition-all ${
                        unlocked
                          ? "bg-gradient-to-br from-gold/5 to-cyan/5 border-gold/30 text-[#111827] shadow-sm"
                          : "bg-slate-50 border-slate-200/60 text-gray-500 select-none"
                      }`}
                    >
                      <span className="text-lg">{badge.icon}</span>
                      <div className="text-left">
                        <span className="block text-xs font-bold leading-none">{badge.title}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">
                          {unlocked ? "Unlocked" : "Locked"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
