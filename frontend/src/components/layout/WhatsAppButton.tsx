"use client";

import { MessageSquare } from "lucide-react";
import { SITE_METADATA } from "@/lib/constants";

export default function WhatsAppButton() {
  const prefilledMessage = encodeURIComponent(
    "Hi Aarti, I visited your website mathematicsgeek.com and would like to book a FREE demo math class."
  );
  
  const whatsappUrl = `https://wa.me/${SITE_METADATA.whatsapp}?text=${prefilledMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-300"
      aria-label="Contact us on WhatsApp"
    >
      {/* Outer pulse wave */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping pointer-events-none"></span>

      {/* Message icon */}
      <MessageSquare className="h-6 w-6 relative z-10 animate-pulse" />

      {/* Text Tooltip (Visible on Hover) */}
      <span className="absolute right-16 scale-0 origin-right transition-transform group-hover:scale-100 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-cyan/15 whitespace-nowrap shadow-lg select-none">
        Book Free Demo on WhatsApp
      </span>
    </a>
  );
}
