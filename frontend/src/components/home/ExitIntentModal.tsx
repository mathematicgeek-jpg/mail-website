"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Gift } from "lucide-react";
import ContactForm from "./ContactForm";

export default function ExitIntentModal() {
  const [showModal, setShowModal] = useState(false);
  const [hasShown, setHasShown] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("exit_intent_seen");
    }
    return false;
  });

  useEffect(() => {
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if cursor leaves the top of the viewport (indicating closing tab / back button)
      if (e.clientY < 15 && !hasShown) {
        setShowModal(true);
        setHasShown(true);
        sessionStorage.setItem("exit_intent_seen", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  const handleClose = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan/20 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden z-10 animate-fade-in">
        {/* Glow decoration */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan/10 blur-3xl rounded-full"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {/* Pitch Panel */}
          <div className="md:col-span-2 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold uppercase tracking-wider mb-2">
              <Gift className="h-4 w-4" />
              <span>Special Offer</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white leading-tight">
              Before You Go...
            </h3>
            
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Get our premium <span className="text-gold font-semibold">Vedic Math Shortcuts PDF Cheat Sheet</span> absolutely FREE!
            </p>

            <ul className="space-y-2 text-left text-xs text-gray-300">
              <li className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-cyan shrink-0" />
                <span>Calculate 10x faster mentally</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-cyan shrink-0" />
                <span>Avoid simple arithmetic errors</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-cyan shrink-0" />
                <span>1 Free live demo class ticket</span>
              </li>
            </ul>
          </div>

          {/* Form Panel */}
          <div className="md:col-span-3">
            <div className="scale-95 bg-slate-950/40 p-1 rounded-2xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
