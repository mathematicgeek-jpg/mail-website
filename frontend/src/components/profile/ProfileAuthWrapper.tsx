"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowRight, Brain, Sparkles, CheckCircle2, User } from "lucide-react";
import { api } from "@/lib/api";
import { generateSHA256Hash } from "@/lib/crypto";

export default function ProfileAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    studentClass: "",
    board: "",
    preferredMode: "Online",
    message: "I want to unlock my Profile Dashboard!"
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [pendingApproval, setPendingApproval] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Check if real JWT token exists
    const checkAuth = async () => {
      const token = localStorage.getItem("mg_student_token");
      if (token) {
        // Set api token and verify
        try {
          // Temporarily set it for the generic getAuthHeaders logic
          // A better approach is having a separate token key for students vs admins,
          // but if we use the same TOKEN_KEY it might overwrite the admin one.
          // Let's assume the user uses different browsers for admin/student.
          localStorage.setItem("math_geek_admin_token", token);
          const user = await api.fetchCurrentUser();
          if (user) {
            setIsUnlocked(true);
            localStorage.setItem("math_geek_player_name", user.name.split(" ")[0]);
          }
        } catch (err) {
          localStorage.removeItem("mg_student_token");
          localStorage.removeItem("math_geek_admin_token");
        }
      }
      setIsLoadingSession(false);
    };
    checkAuth();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await api.studentLogin({ username: loginForm.email, password: loginForm.password });
      localStorage.setItem("mg_student_token", res.access_token);
      localStorage.setItem("math_geek_admin_token", res.access_token); // used by api.ts
      
      const user = await api.fetchCurrentUser();
      localStorage.setItem("math_geek_player_name", user.name.split(" ")[0]);
      
      setIsUnlocked(true);
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    
    try {
      // Submit lead to API
      await api.submitInquiry({ ...formData, source: "Profile Lock" });
      
      // Show pending message instead of unlocking
      setPendingApproval(true);
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
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <User className="h-4 w-4" />
                <span>Profile Locked</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Access Your Dashboard</h3>
              <p className="text-gray-400 text-sm mb-6">Register your free account to unlock your personalized learning dashboard and track progress.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
                  <span className="text-sm font-medium">Track your learning progress</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
                  <span className="text-sm font-medium">View personal performance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
                  <span className="text-sm font-medium">Get customized recommendations</span>
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
          <div className="w-full md:w-7/12 bg-[#ffffff] flex flex-col">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => { setActiveTab("login"); setPendingApproval(false); }}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setActiveTab("register"); setPendingApproval(false); }}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeTab === "register" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Register
              </button>
            </div>

            <div className="p-8 flex-grow">
              
              {activeTab === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-[#111827] mb-6">Welcome Back</h3>
                  
                  {loginError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
                      {loginError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input required type="email" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="student@example.com" />
                  </div>
                  
                  <div className="pb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                    <input required type="password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#111827] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" placeholder="••••••••" />
                  </div>

                  <button 
                    type="submit"
                    disabled={loginLoading}
                    className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    {loginLoading ? "Authenticating..." : "Login to Profile"}
                    {!loginLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </button>
                </form>
              )}

              {activeTab === "register" && (
                <>
                  {pendingApproval ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#111827]">Request Received!</h3>
                      <p className="text-gray-600 text-sm max-w-sm mx-auto">
                        Your registration has been submitted successfully. Our team will contact you shortly to verify your details and provide your login credentials.
                      </p>
                      <button
                        onClick={() => setActiveTab("login")}
                        className="mt-6 px-6 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Back to Login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleEnrollSubmit} className="space-y-4">
                      <h3 className="text-xl font-bold text-[#111827] mb-6">Register to Unlock Profile</h3>
                      
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
                        className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl shadow-md transition-all active:scale-[0.98]"
                      >
                        {loading ? "Submitting..." : "Submit Registration"}
                        {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
