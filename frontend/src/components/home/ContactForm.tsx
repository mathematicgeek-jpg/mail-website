/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { CLASSES, BOARDS } from "@/lib/constants";
import { CheckCircle2, AlertTriangle, Send, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "India",
    studentClass: "",
    board: "",
    preferredMode: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple validation
    if (!formData.name || !formData.phone || !formData.studentClass || !formData.board || !formData.preferredMode) {
      setError("Please fill in all required fields marked with *");
      setLoading(false);
      return;
    }

    try {
      await api.submitInquiry(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        country: "India",
        studentClass: "",
        board: "",
        preferredMode: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit demo class inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-cyan p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 blur-2xl rounded-full pointer-events-none"></div>

      <div className="text-center mb-8 relative z-10">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          Book a Free Demo Class
        </h3>
        <p className="text-gray-400 text-sm">
          Submit this form and Aarti Ma&apos;am will schedule an interactive session with you.
        </p>
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center py-12 text-center relative z-10 animate-fade-in">
          <div className="relative mb-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-400" />
            <div className="absolute inset-0 bg-emerald-500 blur-md opacity-30"></div>
          </div>
          <h4 className="text-lg font-bold text-white mb-2">Thank you, Registration Successful!</h4>
          <p className="text-gray-400 text-sm max-w-md">
            Your free demo class inquiry is submitted successfully. We will reach out to you within 24 hours to schedule the demo session.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 px-6 py-2 rounded-lg bg-gray-900 border border-cyan/30 text-xs font-semibold text-cyan hover:bg-opacity-80 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
          {error && (
            <div className="flex items-center space-x-2 text-red bg-red/10 border border-red/20 px-4 py-3 rounded-lg text-sm">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Student Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Student / Parent Name <span className="text-cyan">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full bg-slate-900 border border-slate-200 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                WhatsApp Phone Number <span className="text-cyan">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number (e.g. +91 9876543210)"
                className="w-full bg-slate-900 border border-slate-200 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email (optional)"
                className="w-full bg-slate-900 border border-slate-200 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-colors"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                City / Town
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full bg-slate-900 border border-slate-200 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Class */}
            <div>
              <label htmlFor="studentClass" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Class <span className="text-cyan">*</span>
              </label>
              <select
                id="studentClass"
                name="studentClass"
                required
                value={formData.studentClass}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-200 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-colors"
              >
                <option value="" disabled className="text-gray-600">Select Class</option>
                {CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.name}>{cls.name}</option>
                ))}
              </select>
            </div>

            {/* Board */}
            <div>
              <label htmlFor="board" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Curriculum Board <span className="text-cyan">*</span>
              </label>
              <select
                id="board"
                name="board"
                required
                value={formData.board}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-200 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-colors"
              >
                <option value="" disabled className="text-gray-600">Select Board</option>
                {BOARDS.map((bd) => (
                  <option key={bd.id} value={bd.name}>{bd.name}</option>
                ))}
              </select>
            </div>

            {/* Preferred Mode */}
            <div>
              <label htmlFor="preferredMode" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Coaching Mode <span className="text-cyan">*</span>
              </label>
              <select
                id="preferredMode"
                name="preferredMode"
                required
                value={formData.preferredMode}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-200 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-colors"
              >
                <option value="" disabled className="text-gray-600">Select Mode</option>
                <option value="Online Live Sessions">Online Live Sessions</option>
                <option value="Offline Home Tuitions">Offline Home Tuitions</option>
                <option value="Both Modes Acceptable">Both Modes Acceptable</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Add a Message (Topics you want help with)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell Ma'am if you need help with algebraic identities, trigonometry, Vedic speed multiplication tricks, board exam strategy, etc."
              className="w-full bg-slate-900 border border-slate-200 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-colors resize-y"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold text-gray-950 rounded-lg group bg-gradient-to-br from-cyan to-gold group-hover:from-cyan group-hover:to-gold hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-800 disabled:opacity-50"
          >
            <span className="w-full relative px-5 py-3 transition-all ease-in duration-75 bg-gradient-to-r from-cyan to-gold rounded-md group-hover:bg-opacity-0 flex items-center justify-center space-x-2 cursor-pointer">
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Book Free Demo Now</span>
                </>
              )}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
