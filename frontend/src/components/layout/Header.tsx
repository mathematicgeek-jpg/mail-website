"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap, ChevronRight } from "lucide-react";
import { SITE_METADATA } from "@/lib/constants";
import { getGamificationProfile, GamificationProfile } from "@/lib/gamification";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setProfile] = useState<GamificationProfile | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    const loadProfile = () => {
      setProfile(getGamificationProfile());
    };
    loadProfile();
    window.addEventListener("gamificationUpdate", loadProfile);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("gamificationUpdate", loadProfile);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/#" },
    { name: "About", href: "/#about" },
    { name: "Courses", href: "/#courses" },
    { name: "Games Hub", href: "/games" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-cyan shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center bg-[#ffffff] p-1 rounded-full shadow-sm border border-cyan/10">
              <img src="/logo.png" alt="Aarti Mathematics Geek Logo" className="h-10 w-10 object-contain transition-transform group-hover:scale-105" />
            </div>
            <div>
              <span className="font-bold text-lg md:text-xl tracking-tight bg-gradient-to-r from-[#0f172a] via-[#0891b2] to-[#d97706] bg-clip-text text-transparent">
                Aarti Math Geek
              </span>
              <span className="block text-[10px] text-gold font-semibold uppercase tracking-widest">
                Merit Score Expert
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-cyan transition-colors relative group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA & Gamification Button */}
          <div className="hidden md:flex items-center space-x-4">
            {profile && (
              <Link
                href="/#profile-dashboard"
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan/15 text-xs font-bold hover:border-gold hover:scale-105 transition-all text-white"
              >
                <span className="flex items-center">
                  🔥 <span className="ml-1 text-slate-100">{profile.streak}</span>
                </span>
                <span className="w-[1px] h-3 bg-slate-800"></span>
                <span className="flex items-center text-gold">
                  ⭐ <span className="ml-1 text-slate-100">Lvl {profile.level}</span>
                </span>
              </Link>
            )}

            <Link
              href="/#contact"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold text-white rounded-lg group bg-gradient-to-br from-cyan to-gold group-hover:from-cyan group-hover:to-gold hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-800"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Book Free Demo <ChevronRight className="inline-block h-4 w-4 ml-1" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-cyan focus:outline-none p-1"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[60px] bg-slate-950/95 border-b border-cyan/15 transition-all duration-300 ease-in-out z-40 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan hover:bg-slate-900 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {profile && (
            <div className="px-3 py-2 border-t border-gray-800 flex justify-between items-center text-sm font-bold text-white">
              <span>Learning Progress:</span>
              <div className="flex space-x-3">
                <span className="flex items-center">
                  🔥 <span className="ml-1 text-slate-100">{profile.streak} days</span>
                </span>
                <span className="flex items-center text-gold">
                  ⭐ <span className="ml-1 text-slate-100">Lvl {profile.level}</span>
                </span>
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-gray-800">
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center py-2.5 px-4 rounded-md bg-gradient-to-r from-cyan to-gold text-sm font-semibold text-[#111827] hover:opacity-90 transition-opacity"
            >
              Book Free Demo
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
