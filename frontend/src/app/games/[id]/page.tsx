"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { api } from "@/lib/api";
import { Timer, Trophy, Check, X, ArrowLeft, RefreshCw, Sparkles, Brain, Award, ShieldAlert } from "lucide-react";

interface QuestionType {
  id: string;
  text: string;
  options: string[];
  correct_answer?: string; // only if cheated/fallback
}

export default function GameArena({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [playerName, setPlayerName] = useState("Anonymous");
  const [gameState, setGameState] = useState<"loading" | "intro" | "playing" | "complete" | "error">("loading");
  
  // Game session properties
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeLimit, setTimeLimit] = useState(60);

  // Score states
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  // Feedback states
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
  } | null>(null);

  // Is using client-side fallback
  const [isFallback, setIsFallback] = useState(false);
  const [fallbackQuestions, setFallbackQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("math_geek_player_name");
      if (stored) setPlayerName(stored);
    }
    setGameState("intro");
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft <= 0) {
      handleGameComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // Client-side question generation fallback for offline/static support
  const generateClientFallbackQuestions = (templateId: string): { questions: any[]; limit: number } => {
    const list: any[] = [];
    let limit = 60;
    
    for (let i = 0; i < 10; i++) {
      let qText = "";
      let correct = "";
      let explain = "";
      let options: string[] = [];

      if (templateId.includes("vedic") || templateId === "gt2") {
        limit = 120;
        // Vedic squaring or multiplication by 11
        if (Math.random() < 0.5) {
          const num = [15, 25, 35, 45, 65, 75, 85, 95][Math.floor(Math.random() * 8)];
          qText = `Calculate the square of ${num} mentally using Vedic Math.`;
          const ans = num * num;
          correct = String(ans);
          explain = `${num}² ending in 5: Multiply ${Math.floor(num/10)} by ${Math.floor(num/10)+1} = ${Math.floor(num/10)*(Math.floor(num/10)+1)} and append 25. Answer is ${ans}.`;
        } else {
          const num = Math.floor(Math.random() * 80) + 11;
          qText = `Calculate ${num} × 11 using Vedic techniques.`;
          const ans = num * 11;
          correct = String(ans);
          const first = Math.floor(num / 10);
          const second = num % 10;
          explain = `${num} × 11: Add the digits (${first} + ${second} = ${first+second}). Place in middle: ${ans}.`;
        }
      } else if (templateId.includes("algebra") || templateId === "gt4") {
        limit = 120;
        // Simple linear equation
        const x = Math.floor(Math.random() * 8) + 2;
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 15) + 1;
        const res = a * x + b;
        qText = `Solve for x: ${a}x + ${b} = ${res}`;
        correct = String(x);
        explain = `${a}x + ${b} = ${res} → ${a}x = ${res - b} → x = ${x}`;
      } else {
        // Mental Math sprint
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 20) + 5;
        const op = Math.random() < 0.5 ? "+" : "−";
        qText = `What is ${a} ${op} ${b}?`;
        const ans = op === "+" ? a + b : a - b;
        correct = String(ans);
        explain = `${a} ${op} ${b} = ${ans}`;
      }

      // Generate wrong options
      const correctVal = parseInt(correct);
      const wrong = new Set<number>();
      while (wrong.size < 3) {
        const offset = Math.floor(Math.random() * 10) - 5;
        if (offset !== 0 && correctVal + offset > 0) {
          wrong.add(correctVal + offset);
        }
      }
      options = [correct, ...Array.from(wrong).map(String)];
      options.sort(() => Math.random() - 0.5);

      list.push({
        id: `fb_q_${i}`,
        text: qText,
        options,
        correct_answer: correct,
        explanation: explain,
      });
    }

    return { questions: list, limit };
  };

  const handleStartGame = async () => {
    setGameState("loading");
    try {
      const session = await api.startGameSession(id, playerName || "Anonymous");
      if (session && session.questions && session.questions.length > 0) {
        setSessionId(session.session_id);
        setQuestions(session.questions);
        setTimeLimit(session.time_limit || 60);
        setTimeLeft(session.time_limit || 60);
        setTotalQuestions(session.total || 10);
        setIsFallback(false);
      } else {
        triggerLocalFallback();
      }
      
      setCurrentIdx(0);
      setScore(0);
      setStreak(0);
      setBestStreak(0);
      setXpEarned(0);
      setSelectedAnswer(null);
      setAnswerFeedback(null);
      setGameState("playing");
    } catch (err) {
      triggerLocalFallback();
      setGameState("playing");
    }
  };

  const triggerLocalFallback = () => {
    const fallback = generateClientFallbackQuestions(id);
    setQuestions(fallback.questions);
    setFallbackQuestions(fallback.questions);
    setTimeLimit(fallback.limit);
    setTimeLeft(fallback.limit);
    setTotalQuestions(10);
    setIsFallback(true);
  };

  const handleAnswerClick = async (answer: string) => {
    if (answerFeedback?.submitted) return;
    setSelectedAnswer(answer);

    const question = questions[currentIdx];
    const timeTaken = timeLimit - timeLeft;

    if (isFallback) {
      // Local evaluation
      const correctAns = fallbackQuestions[currentIdx].correct_answer;
      const isCorrect = answer === correctAns;
      
      const xp = isCorrect ? 10 + (streak > 0 ? 5 : 0) : 0;
      const newStreak = isCorrect ? streak + 1 : 0;
      
      setScore((prev) => prev + (isCorrect ? 1 : 0));
      setXpEarned((prev) => prev + xp);
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      setAnswerFeedback({
        submitted: true,
        isCorrect,
        correctAnswer: correctAns,
        explanation: fallbackQuestions[currentIdx].explanation,
      });
    } else {
      // API validation
      try {
        const feedback = await api.submitAnswer(sessionId, question.id, answer, 5.0);
        setScore(feedback.score);
        setStreak(feedback.streak);
        setXpEarned((prev) => prev + feedback.xp_earned);
        setBestStreak((prev) => Math.max(prev, feedback.streak));

        setAnswerFeedback({
          submitted: true,
          isCorrect: feedback.is_correct,
          correctAnswer: feedback.correct_answer,
          explanation: feedback.explanation,
        });
      } catch (err) {
        // fallback in case of connection drop mid-game
        const correctAns = question.correct_answer || answer; 
        const isCorrect = answer === correctAns;
        setAnswerFeedback({
          submitted: true,
          isCorrect,
          correctAnswer: correctAns,
        });
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setAnswerFeedback(null);

    if (currentIdx + 1 >= totalQuestions) {
      handleGameComplete();
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handleGameComplete = async () => {
    setGameState("loading");
    if (!isFallback && sessionId) {
      try {
        await api.completeGameSession(sessionId);
      } catch (err) {
        // ignore
      }
    }
    setGameState("complete");
  };

  return (
    <>
      <Header />

      <main className="flex-grow pt-32 pb-24 bg-slate-950 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto px-4 w-full">
          
          {/* Back link */}
          <Link
            href="/games"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Exit Arena</span>
          </Link>

          {/* Fallback Warning Flag */}
          {isFallback && gameState === "playing" && (
            <div className="flex items-center space-x-2 text-gold bg-gold/10 border border-gold/20 px-3 py-2 rounded-xl text-xs mb-6 max-w-fit">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Offline Practice Mode active (your score won't be saved online).</span>
            </div>
          )}

          {/* INTRO SCREEN */}
          {gameState === "intro" && (
            <div className="glass p-8 rounded-3xl border border-cyan/15 text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 blur-2xl rounded-full"></div>
              
              <div className="flex justify-center">
                <div className="p-4 bg-cyan/10 border border-cyan/20 rounded-full animate-float">
                  <Brain className="h-10 w-10 text-cyan" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Enter the Math Arena</h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  You are playing as <span className="text-gold font-bold">{playerName || "Anonymous"}</span>. Speed, accuracy, and streaks earn bonus XP points.
                </p>
              </div>

              <button
                onClick={handleStartGame}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan to-gold text-slate-950 font-bold hover:opacity-95 shadow-xl text-sm"
              >
                <span>Start Challenge</span>
              </button>
            </div>
          )}

          {/* LOADING SCREEN */}
          {gameState === "loading" && (
            <div className="glass p-12 rounded-3xl border border-cyan/15 text-center flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-cyan" />
              <span className="text-sm text-gray-400">Syncing with Vedic Game Engine...</span>
            </div>
          )}

          {/* GAMEPLAY SCREEN */}
          {gameState === "playing" && questions.length > 0 && (
            <div className="space-y-6">
              
              {/* Score bar */}
              <div className="flex items-center justify-between bg-slate-900/60 border border-cyan/10 p-4 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-400">
                    Question: <span className="text-white font-bold">{currentIdx + 1}/{totalQuestions}</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    Streak: <span className="text-gold font-bold">{streak} 🔥</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-cyan">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-bold">{timeLeft}s</span>
                </div>

                <span className="text-xs text-gray-400">
                  XP: <span className="text-emerald-400 font-bold">+{xpEarned}</span>
                </span>
              </div>

              {/* Question board */}
              <div className="glass p-8 rounded-3xl border border-cyan/15 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan/5 blur-xl rounded-full"></div>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {questions[currentIdx].text}
                </h3>
              </div>

              {/* Answer options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentIdx].options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const submitted = answerFeedback?.submitted;
                  const isCorrect = option === answerFeedback?.correctAnswer;
                  const isWrongAndSelected = isSelected && !answerFeedback?.isCorrect;

                  let btnClass = "bg-slate-950 border-gray-800 text-gray-300 hover:border-cyan/30 hover:bg-slate-900";
                  if (submitted) {
                    if (isCorrect) {
                      btnClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold";
                    } else if (isWrongAndSelected) {
                      btnClass = "bg-red/10 border-red/30 text-red font-bold";
                    } else {
                      btnClass = "bg-slate-950/20 border-gray-900 text-gray-600 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={option}
                      disabled={submitted}
                      onClick={() => handleAnswerClick(option)}
                      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border text-sm transition-all focus:outline-none ${btnClass}`}
                    >
                      <span>{option}</span>
                      {submitted && isCorrect && <Check className="h-4 w-4 text-emerald-400 shrink-0 ml-4" />}
                      {submitted && isWrongAndSelected && <X className="h-4 w-4 text-red shrink-0 ml-4" />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & explanation panel */}
              {answerFeedback?.submitted && (
                <div className="glass-cyan border border-cyan/15 p-6 rounded-2xl space-y-4 animate-fade-in">
                  <div className="flex items-center space-x-2">
                    {answerFeedback.isCorrect ? (
                      <span className="text-emerald-400 font-bold text-sm flex items-center">
                        <Sparkles className="h-4 w-4 mr-1.5 fill-emerald-400" /> Correct Answer! (+{streak > 1 ? 15 : 10} XP)
                      </span>
                    ) : (
                      <span className="text-red font-bold text-sm">
                        Incorrect. The correct answer is {answerFeedback.correctAnswer}.
                      </span>
                    )}
                  </div>
                  {answerFeedback.explanation && (
                    <p className="text-xs text-gray-400 leading-relaxed">
                      💡 {answerFeedback.explanation}
                    </p>
                  )}
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-slate-900 border border-cyan/20 text-xs font-semibold text-cyan hover:bg-slate-950 transition-colors"
                  >
                    {currentIdx + 1 >= totalQuestions ? "Finish Challenge" : "Next Question"}
                  </button>
                </div>
              )}

            </div>
          )}

          {/* COMPLETE SCREEN */}
          {gameState === "complete" && (
            <div className="glass p-8 rounded-3xl border border-cyan/15 text-center space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 blur-2xl rounded-full"></div>
              
              <div className="flex justify-center">
                <div className="p-4 bg-gold/10 border border-gold/20 rounded-full animate-float">
                  <Trophy className="h-10 w-10 text-gold" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Challenge Completed!</h2>
                <p className="text-gray-400 text-sm">
                  Awesome effort, <span className="text-gold font-bold">{playerName || "Anonymous"}</span>! Here is your scorecard:
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto bg-slate-950/60 border border-cyan/10 p-5 rounded-2xl">
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase font-semibold">Correct</span>
                  <span className="text-lg font-bold text-white">{score}/{totalQuestions}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase font-semibold">Best Streak</span>
                  <span className="text-lg font-bold text-gold">{bestStreak} 🔥</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase font-semibold">Total XP</span>
                  <span className="text-lg font-bold text-emerald-400">+{xpEarned}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleStartGame}
                  className="flex items-center justify-center px-6 py-3 rounded-2xl bg-cyan text-slate-950 text-xs font-bold hover:opacity-90"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span>Play Again</span>
                </button>
                <Link
                  href="/games"
                  className="flex items-center justify-center px-6 py-3 rounded-2xl bg-slate-900 border border-cyan/15 text-xs font-bold text-cyan hover:bg-slate-950"
                >
                  <span>Back to Games Hub</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
