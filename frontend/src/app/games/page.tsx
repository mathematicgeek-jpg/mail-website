"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { api } from "@/lib/api";
import { Trophy, Play, Star, Sparkles, Brain, Award, Loader2, Zap } from "lucide-react";

interface GameTemplateType {
  id: string;
  name: string;
  type: string;
  description: string;
  topic: string;
  class_range: number[];
  config: {
    time_limit: number;
    question_count: number;
    difficulty_min: number;
  };
}

interface LeaderboardEntryType {
  rank: number;
  player_name: string;
  total_xp: number;
  level: number;
  level_title: string;
  games_played: number;
  accuracy: number;
}

export default function GamesHub() {
  const [templates, setTemplates] = useState<GameTemplateType[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryType[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fallback game templates
  const fallbackTemplates = [
    {
      id: "gt1",
      name: "Mental Math Sprint",
      type: "mental_math",
      description: "Race against the clock! Solve basic operations mentally as fast as you can.",
      topic: "mental_math",
      class_range: [6, 7, 8, 9, 10],
      config: { time_limit: 60, question_count: 10, difficulty_min: 2 },
    },
    {
      id: "gt2",
      name: "Vedic Math Challenge",
      type: "vedic_tricks",
      description: "Apply Vedic sutras (Nikhilam, Squaring) for lightning-fast calculations.",
      topic: "vedic_multiplication",
      class_range: [7, 8, 9, 10, 11, 12],
      config: { time_limit: 120, question_count: 10, difficulty_min: 3 },
    },
    {
      id: "gt3",
      name: "Speed Multiplication",
      type: "timed_quiz",
      description: "Put your multiplication tables to the test. How fast can you multiply?",
      topic: "multiplication",
      class_range: [6, 7, 8, 9],
      config: { time_limit: 90, question_count: 15, difficulty_min: 2 },
    },
    {
      id: "gt4",
      name: "Algebra Ace",
      type: "timed_quiz",
      description: "Solve linear equations and algebraic expressions with variables.",
      topic: "algebra",
      class_range: [8, 9, 10, 11, 12],
      config: { time_limit: 120, question_count: 10, difficulty_min: 2 },
    },
  ];

  // Fallback leaderboard entries
  const fallbackLeaderboard = [
    { rank: 1, player_name: "Shrey Malhotra", total_xp: 850, level: 9, level_title: "Math Champion", games_played: 14, accuracy: 92.5 },
    { rank: 2, player_name: "Ananya Sen", total_xp: 720, level: 8, level_title: "Vedic Scholar", games_played: 11, accuracy: 94.0 },
    { rank: 3, player_name: "Devanshu Saxena", total_xp: 680, level: 7, level_title: "Math Warrior", games_played: 9, accuracy: 96.2 },
    { rank: 4, player_name: "Rohan K.", total_xp: 510, level: 6, level_title: "Number Ninja", games_played: 8, accuracy: 88.0 },
    { rank: 5, player_name: "Priya M.", total_xp: 430, level: 5, level_title: "Speed Calculator", games_played: 7, accuracy: 90.1 },
  ];

  useEffect(() => {
    // Check if player name was previously stored
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("math_geek_player_name");
      if (stored) setPlayerName(stored);
    }

    const loadData = async () => {
      try {
        const templatesData = await api.fetchGameTemplates();
        const leaderboardData = await api.fetchLeaderboard();

        if (templatesData && templatesData.length > 0) {
          setTemplates(templatesData);
        } else {
          setTemplates(fallbackTemplates);
        }

        if (leaderboardData && leaderboardData.length > 0) {
          setLeaderboard(leaderboardData);
        } else {
          setLeaderboard(fallbackLeaderboard);
        }
      } catch (err) {
        setTemplates(fallbackTemplates);
        setLeaderboard(fallbackLeaderboard);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPlayerName(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("math_geek_player_name", val);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-grow pt-32 pb-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold uppercase tracking-wider mb-3">
              <Brain className="h-3.5 w-3.5" />
              <span>Vedic Math Arena</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Gamified Learning Hub
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Solve equations, try speed tricks, accumulate XP points, and climb the leaderboard.
            </p>
          </div>

          {/* Name Setup Widget */}
          <div className="max-w-md mx-auto mb-16 glass p-6 rounded-2xl border border-cyan/15 text-center space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Setup Your Player Nickname
            </h3>
            <input
              type="text"
              value={playerName}
              onChange={handleNameChange}
              placeholder="Enter your name (e.g. Shrey M.)"
              className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-4 py-2.5 text-sm text-center text-white placeholder-gray-600 focus:outline-none focus:border-cyan transition-colors"
            />
            <p className="text-[10px] text-gray-500">
              Your score and XP will be recorded under this name in the global leaderboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Game Arena cards */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center">
                <Zap className="h-5 w-5 text-cyan mr-2" />
                Select a Challenge
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-16 text-gray-500">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan mr-2" />
                  <span>Loading game arenas...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="glass-cyan border border-cyan/10 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan/20 transition-all duration-300 relative group overflow-hidden"
                    >
                      {/* Decoration */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan/5 blur-xl rounded-full"></div>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-start">
                          <span className="bg-slate-900 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-800 uppercase tracking-widest">
                            Class {Math.min(...template.class_range)}-{Math.max(...template.class_range)}
                          </span>
                          <span className="text-[10px] font-bold text-gold flex items-center">
                            <Sparkles className="h-3.5 w-3.5 mr-1 fill-gold" />
                            {template.config.question_count} Qs
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-cyan transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed mt-1.5 line-clamp-3">
                            {template.description}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/games/${template.id}`}
                        className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-cyan to-gold text-slate-950 text-xs font-bold hover:opacity-95 transition-opacity"
                      >
                        <Play className="h-3.5 w-3.5 fill-slate-950 mr-1.5" />
                        <span>Play Challenge</span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leaderboard panel */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center">
                <Trophy className="h-5 w-5 text-gold mr-2" />
                Leaderboard
              </h2>

              <div className="glass-gold border border-gold/15 p-6 rounded-2xl shadow-xl">
                <div className="space-y-4">
                  {leaderboard.slice(0, 5).map((entry) => {
                    const isTop3 = entry.rank <= 3;
                    return (
                      <div
                        key={entry.rank}
                        className={`flex items-center justify-between p-3 rounded-xl border ${
                          isTop3 ? "bg-gold/5 border-gold/10" : "bg-slate-950/40 border-gray-800"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            entry.rank === 1 ? "bg-gold text-slate-950" :
                            entry.rank === 2 ? "bg-slate-300 text-slate-950" :
                            entry.rank === 3 ? "bg-amber-600 text-white" : "bg-slate-900 text-gray-400"
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <span className="block text-xs md:text-sm font-bold text-white">
                              {entry.player_name}
                            </span>
                            <span className="block text-[9px] text-gray-500 font-medium uppercase tracking-wider">
                              Level {entry.level} — {entry.level_title}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block text-xs md:text-sm font-bold text-gold">
                            {entry.total_xp} XP
                          </span>
                          <span className="block text-[9px] text-gray-500">
                            {entry.accuracy}% Acc
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
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
