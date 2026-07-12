"use client";

import { useState } from "react";
import { addXP, awardBadge } from "@/lib/gamification";
import { Zap, HelpCircle, ArrowRight, Play, RefreshCw, Award } from "lucide-react";

type TrickType = "multiply_11" | "square_5";

interface CalculationStep {
  text: string;
  expression: string;
}

export default function InteractiveTrick() {
  const [activeTrick, setActiveTrick] = useState<TrickType>("multiply_11");
  const [inputVal, setInputVal] = useState<string>("43");
  const [steps, setSteps] = useState<CalculationStep[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [xpMessage, setXpMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculateTrick = () => {
    setErrorMsg(null);
    setSteps([]);
    setResult(null);

    const num = parseInt(inputVal);

    if (isNaN(num)) {
      setErrorMsg("Please enter a valid number.");
      return;
    }

    if (activeTrick === "multiply_11") {
      if (num < 10 || num > 99) {
        setErrorMsg("Please enter a 2-digit number (10–99).");
        return;
      }

      // Step-by-step for Multiply by 11
      const d1 = Math.floor(num / 10);
      const d2 = num % 10;
      const sum = d1 + d2;
      
      const calculationSteps: CalculationStep[] = [
        {
          text: `Split the two digits of ${num}:`,
          expression: `${d1}   ...   ${d2}`,
        },
        {
          text: `Add the two digits together:`,
          expression: `${d1} + ${d2} = ${sum}`,
        },
      ];

      if (sum >= 10) {
        calculationSteps.push({
          text: `Since the sum (${sum}) is 10 or greater, put ${sum % 10} in the middle and carry over 1 to ${d1}:`,
          expression: `(${d1} + 1) ... ${sum % 10} ... ${d2}  =  ${d1 + 1}${sum % 10}${d2}`,
        });
      } else {
        calculationSteps.push({
          text: `Place the sum (${sum}) in the middle:`,
          expression: `${d1} ... ${sum} ... ${d2}  =  ${d1}${sum}${d2}`,
        });
      }

      const res = num * 11;
      setResult(res);
      setSteps(calculationSteps);

    } else if (activeTrick === "square_5") {
      if (num % 10 !== 5 || num <= 0 || num > 195) {
        setErrorMsg("Please enter a positive number ending in 5 (e.g., 15, 25, 35...95).");
        return;
      }

      // Step-by-step for Squaring ending in 5
      const remainingDigits = Math.floor(num / 10);
      const nextNum = remainingDigits + 1;
      const firstPart = remainingDigits * nextNum;
      
      const calculationSteps: CalculationStep[] = [
        {
          text: `Split the number before the ending 5:`,
          expression: `Digits before 5: ${remainingDigits}`,
        },
        {
          text: `Multiply ${remainingDigits} by its consecutive successor (${remainingDigits} + 1 = ${nextNum}):`,
          expression: `${remainingDigits} × ${nextNum} = ${firstPart}`,
        },
        {
          text: `Append '25' (which is 5²) to the end of the result:`,
          expression: `${firstPart} appended with 25 = ${firstPart}25`,
        },
      ];

      const res = num * num;
      setResult(res);
      setSteps(calculationSteps);
    }

    // Award Gamification rewards
    const profile = addXP(15);
    const { newlyUnlocked } = awardBadge("speed_demon");
    
    if (newlyUnlocked) {
      setXpMessage("✨ +15 XP Earned & 'Speed Demon' Badge Unlocked! ⚡");
    } else {
      setXpMessage("⚡ +15 XP Added to your profile!");
    }

    setTimeout(() => {
      setXpMessage(null);
    }, 4500);
  };

  const handleTrickChange = (trick: TrickType) => {
    setActiveTrick(trick);
    setInputVal(trick === "multiply_11" ? "43" : "75");
    setSteps([]);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold uppercase tracking-widest mb-3">
            <Zap className="h-3.5 w-3.5 animate-bounce" />
            <span>Interactive Speed Math</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Vedic Mental Math Magic
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Select a mental math trick, enter a number, and see how Vedic Math solves it instantly!
          </p>
        </div>

        {/* Gamification Notification Pop-up */}
        {xpMessage && (
          <div className="fixed bottom-6 right-6 bg-[#0f172a] border-2 border-gold text-gold font-bold px-6 py-4 rounded-2xl shadow-[0_0_20px_rgba(217,119,6,0.35)] z-50 flex items-center space-x-3 animate-float">
            <Award className="h-6 w-6 text-gold animate-bounce" />
            <span className="text-sm leading-tight text-white">{xpMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Controls Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-200 p-4 rounded-3xl space-y-2 shadow-sm">
              <span className="text-sm text-[#0e7490] font-bold block mb-2 px-1 uppercase tracking-wider">
                Choose Math Formula
              </span>
              
              <button
                onClick={() => handleTrickChange("multiply_11")}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all border ${
                  activeTrick === "multiply_11"
                    ? "bg-gradient-to-r from-cyan/15 to-cyan/5 border-cyan text-[#0e7490] shadow-sm"
                    : "bg-transparent border-transparent text-gray-400 hover:text-[#111827] hover:bg-slate-100"
                }`}
              >
                🔢 Multiply 2-Digit by 11
              </button>

              <button
                onClick={() => handleTrickChange("square_5")}
                className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all border ${
                  activeTrick === "square_5"
                    ? "bg-gradient-to-r from-gold/15 to-gold/5 border-gold text-[#b45309] shadow-sm"
                    : "bg-transparent border-transparent text-gray-400 hover:text-[#111827] hover:bg-slate-100"
                }`}
              >
                📐 Square Ending in 5
              </button>
            </div>

            {/* Input field card */}
            <div className="bg-[#ffffff] border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {activeTrick === "multiply_11" ? "Enter any 2-digit number:" : "Enter number ending in 5:"}
                </label>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={activeTrick === "multiply_11" ? "e.g. 43" : "e.g. 75"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-cyan"
                />
              </div>

              {errorMsg && <p className="text-xs text-red font-semibold">{errorMsg}</p>}

              <button
                onClick={calculateTrick}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-[#111827] text-slate-100 hover:bg-slate-800 font-semibold text-sm transition-all shadow-md active:scale-95"
              >
                <Play className="h-4 w-4 mr-2 text-cyan fill-cyan" />
                Solve Step-by-Step
              </button>
            </div>
          </div>

          {/* Explanation Output Column */}
          <div className="md:col-span-3">
            <div className="bg-slate-900 border border-slate-200 rounded-3xl p-6 min-h-[300px] flex flex-col justify-between shadow-sm backdrop-blur-sm">
              
              {/* If no calculation triggered yet */}
              {steps.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-grow text-center text-gray-500 py-12">
                  <HelpCircle className="h-12 w-12 text-slate-800 mb-3 animate-pulse" />
                  <p className="text-sm">Input a value and click "Solve" to visualize the shortcut steps.</p>
                </div>
              )}

              {/* Step list */}
              {steps.length > 0 && (
                <div className="space-y-6 flex-grow">
                  <span className="text-sm font-bold text-[#0e7490] uppercase tracking-widest block mb-4 border-b border-cyan/10 pb-2">
                    Vedic Math Solution Process
                  </span>
                  
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 text-sm animate-float"
                      style={{ animationDelay: `${idx * 0.15}s` }}
                    >
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan/15 text-[#0e7490] font-bold text-sm shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-300 font-medium">{step.text}</p>
                        <code className="block bg-slate-950 px-3 py-1.5 rounded-lg text-[#059669] font-bold font-mono text-sm max-w-max border border-slate-900">
                          {step.expression}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Result Indicator */}
              {result !== null && (
                <div className="mt-8 pt-6 border-t border-cyan/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold block">
                      Vedic Shortcut Result:
                    </span>
                    <span className="text-3xl font-extrabold text-white font-mono mt-1 block">
                      {inputVal} × {activeTrick === "multiply_11" ? "11" : inputVal} ={" "}
                      <span className="text-gold glow-text-gold">{result}</span>
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSteps([]);
                      setResult(null);
                    }}
                    className="p-3 bg-[#111827] text-slate-100 hover:bg-slate-800 rounded-2xl border border-slate-950 transition-colors"
                    title="Clear calculation"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
