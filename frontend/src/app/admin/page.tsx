"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken, clearAuthToken, getAuthToken } from "@/lib/api";
import { 
  Users, MessageSquare, BookOpen, Brain, 
  Trash2, Check, X, LogOut, Lock, Loader2,
  Calendar, CheckCircle, Clock, PlusCircle
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<"inquiries" | "students" | "testimonials" | "blogs">("inquiries");
  const [loadingData, setLoadingData] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState<any>({
    leads: { total: 0, pending: 0, contacted: 0, enrolled: 0 },
    testimonials: { total: 0, approved: 0, pending: 0 },
    blog: { total: 0, published: 0, drafts: 0 },
    games: { total_sessions: 0, total_players: 0 },
  });

  // Data lists
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  // Student creation form
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    studentClass: "",
    board: "",
  });
  const [studentSuccess, setStudentSuccess] = useState(false);
  const [studentError, setStudentError] = useState("");

  // Blog creation form
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80",
    category: "Vedic Mathematics",
    tags: "",
    meta_title: "",
    meta_description: "",
    status: "published",
  });
  const [blogSuccess, setBlogSuccess] = useState(false);
  const [blogError, setBlogError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLoggedIn(true);
      loadDashboardData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const res = await api.login({ username, password });
      setAuthToken(res.access_token);
      setIsLoggedIn(true);
      loadDashboardData();
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const statsRes = await api.fetchDashboardStats();
      setStats(statsRes);

      if (activeTab === "inquiries") {
        const data = await api.fetchInquiries();
        setInquiries(data);
      } else if (activeTab === "students") {
        const data = await api.fetchUsers();
        setStudents(data);
      } else if (activeTab === "testimonials") {
        const data = await api.fetchTestimonials(false);
        setTestimonials(data);
      } else if (activeTab === "blogs") {
        const data = await api.fetchAllBlogPostsAdmin();
        setBlogs(data);
      }
    } catch (err) {
      // Setup mock data fallbacks for previewing admin features if server is off
      setupFallbackMockAdminData();
    } finally {
      setLoadingData(false);
    }
  };

  const setupFallbackMockAdminData = () => {
    setStats({
      leads: { total: 12, pending: 4, contacted: 5, enrolled: 3 },
      testimonials: { total: 5, approved: 3, pending: 2 },
      blog: { total: 3, published: 3, drafts: 0 },
      games: { total_sessions: 24, total_players: 8 },
    });

    if (activeTab === "inquiries") {
      setInquiries([
        { id: "i1", name: "Suresh Gupta", phone: "+91 98765 43210", studentClass: "Class 10", board: "CBSE", preferredMode: "Online Live Sessions", status: "pending", created_at: new Date().toISOString() },
        { id: "i2", name: "Neha Sharma", phone: "+91 87654 32109", studentClass: "Class 8", board: "ICSE", preferredMode: "Offline Home Tuitions", status: "contacted", created_at: new Date().toISOString() },
      ]);
    } else if (activeTab === "students") {
      setStudents([
        { id: "s1", name: "Test Student", email: "test@example.com", phone: "+91 0000000000", student_class: "Class 10", board: "CBSE", role: "student", status: "active", created_at: new Date().toISOString() }
      ]);
    } else if (activeTab === "testimonials") {
      setTestimonials([
        { id: "t1", name: "Rohan Malhotra", studentClass: "Class 10", board: "ICSE", rating: 5, testimonial: "Aarti Ma'am completely transformed Shrey's attitude towards math.", approved: true },
        { id: "t_pending", name: "Karan Singh", studentClass: "Class 9", board: "CBSE", rating: 5, testimonial: "The speed calculation tricks are amazing. My marks improved by 25%.", approved: false },
      ]);
    } else if (activeTab === "blogs") {
      setBlogs([
        { id: "b1", title: "Complete Guide to Vedic Mathematics", category: "Vedic Mathematics", status: "published", views: 142 },
      ]);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [activeTab, isLoggedIn]);

  // Actions
  const handleInquiryStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateInquiryStatus(id, newStatus);
      loadDashboardData();
    } catch (err) {
      // Local fallback
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    }
  };

  const handleInquiryDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await api.deleteInquiry(id);
      loadDashboardData();
    } catch (err) {
      setInquiries(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleTestimonialApprove = async (id: string, approved: boolean) => {
    try {
      await api.approveTestimonial(id, approved);
      loadDashboardData();
    } catch (err) {
      setTestimonials(prev => prev.map(item => item.id === id ? { ...item, approved } : item));
    }
  };

  const handleTestimonialDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.deleteTestimonial(id);
      loadDashboardData();
    } catch (err) {
      setTestimonials(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError("");
    setStudentSuccess(false);
    try {
      await api.createUser(studentForm);
      setStudentSuccess(true);
      setStudentForm({ name: "", email: "", phone: "", password: "", studentClass: "", board: "" });
      loadDashboardData();
    } catch (err: any) {
      setStudentError(err.message || "Failed to create student.");
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogError("");
    setBlogSuccess(false);

    try {
      const postData = {
        ...blogForm,
        tags: blogForm.tags.split(",").map(t => t.trim()).filter(Boolean),
        meta_keywords: blogForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      };

      await api.createBlogPost(postData);
      setBlogSuccess(true);
      setBlogForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featured_image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80",
        category: "Vedic Mathematics",
        tags: "",
        meta_title: "",
        meta_description: "",
        status: "published",
      });
      loadDashboardData();
    } catch (err: any) {
      setBlogError(err.message || "Failed to publish blog post.");
    }
  };

  return (
    <>
      <Header />

      <main className="flex-grow pt-32 pb-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* LOGIN SCREEN */}
          {!isLoggedIn ? (
            <div className="max-w-md mx-auto py-12">
              <div className="glass p-8 rounded-3xl border border-cyan/15 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan/5 blur-xl rounded-full"></div>
                
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-cyan/10 rounded-2xl border border-cyan/20 mb-2">
                    <Lock className="h-6 w-6 text-cyan" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Teacher Admin Login</h2>
                  <p className="text-xs text-gray-500">
                    Access inquiries, moderate reviews, and write blog articles.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {authError && (
                    <div className="text-red bg-red/10 border border-red/20 px-3 py-2 rounded-lg text-xs">
                      {authError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full flex items-center justify-center py-2.5 rounded-lg bg-gradient-to-r from-cyan to-gold text-slate-950 text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                    <span>Unlock Dashboard</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ADMIN DASHBOARD PANELS */
            <div className="space-y-8 animate-fade-in">
              
              {/* Header stats bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Teacher Admin Dashboard</h1>
                  <p className="text-xs text-gray-500">Welcome, Aarti Ma'am. Here is your platform overview.</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-xs font-semibold text-red hover:bg-red/10 border border-red/20 px-4 py-2 rounded-xl transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Stats summary grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl border border-cyan/10 flex items-center space-x-4">
                  <div className="p-3 bg-cyan/10 border border-cyan/20 text-cyan rounded-xl"><Users className="h-5 w-5" /></div>
                  <div>
                    <span className="block text-[10px] text-gray-500 font-semibold uppercase">Total Leads</span>
                    <span className="text-lg font-bold text-white">{stats.leads.total}</span>
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-cyan/10 flex items-center space-x-4">
                  <div className="p-3 bg-gold/10 border border-gold/20 text-gold rounded-xl"><MessageSquare className="h-5 w-5" /></div>
                  <div>
                    <span className="block text-[10px] text-gray-500 font-semibold uppercase">Testimonials</span>
                    <span className="text-lg font-bold text-white">{stats.testimonials.total} ({stats.testimonials.pending} pending)</span>
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-cyan/10 flex items-center space-x-4">
                  <div className="p-3 bg-cyan/10 border border-cyan/20 text-cyan rounded-xl"><BookOpen className="h-5 w-5" /></div>
                  <div>
                    <span className="block text-[10px] text-gray-500 font-semibold uppercase">Blog Articles</span>
                    <span className="text-lg font-bold text-white">{stats.blog.total}</span>
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border border-cyan/10 flex items-center space-x-4">
                  <div className="p-3 bg-gold/10 border border-gold/20 text-gold rounded-xl"><Brain className="h-5 w-5" /></div>
                  <div>
                    <span className="block text-[10px] text-gray-500 font-semibold uppercase">Game Players</span>
                    <span className="text-lg font-bold text-white">{stats.games.total_players}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-800">
                {(["inquiries", "students", "testimonials", "blogs"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeTab === tab
                        ? "border-cyan text-cyan"
                        : "border-transparent text-gray-500 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB PANELS */}
              {loadingData ? (
                <div className="flex justify-center items-center py-16 text-gray-500">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan mr-2" />
                  <span>Loading data...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* INQUIRIES TAB */}
                  {activeTab === "inquiries" && (
                    <div className="glass p-6 rounded-2xl border border-cyan/10 overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-gray-800 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                            <th className="py-3 px-4">Student</th>
                            <th className="py-3 px-4">Contact</th>
                            <th className="py-3 px-4">Class/Board</th>
                            <th className="py-3 px-4">Preference</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inquiries.map((inq) => (
                            <tr key={inq.id} className="border-b border-gray-900 hover:bg-slate-900/40">
                              <td className="py-3.5 px-4 font-bold text-white">{inq.name}</td>
                              <td className="py-3.5 px-4 text-gray-400">{inq.phone}</td>
                              <td className="py-3.5 px-4 text-gray-400">{inq.studentClass} | {inq.board}</td>
                              <td className="py-3.5 px-4 text-cyan font-medium">{inq.preferredMode}</td>
                              <td className="py-3.5 px-4">
                                <select
                                  value={inq.status}
                                  onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                                  className="bg-slate-950 border border-gray-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="enrolled">Enrolled</option>
                                  <option value="lost">Lost</option>
                                </select>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => handleInquiryDelete(inq.id)}
                                  className="text-red hover:bg-red/10 p-1.5 rounded-lg border border-red/15"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* STUDENTS TAB */}
                  {activeTab === "students" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: list */}
                      <div className="lg:col-span-2 glass p-6 rounded-2xl border border-cyan/10 overflow-x-auto h-fit">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan mb-4">
                          Enrolled Students
                        </h3>
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead>
                            <tr className="border-b border-gray-800 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                              <th className="py-3 px-4">Name</th>
                              <th className="py-3 px-4">Contact</th>
                              <th className="py-3 px-4">Class/Board</th>
                              <th className="py-3 px-4">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((s) => (
                              <tr key={s.id} className="border-b border-gray-900 hover:bg-slate-900/40">
                                <td className="py-3.5 px-4 font-bold text-white">{s.name}</td>
                                <td className="py-3.5 px-4 text-gray-400">
                                  {s.email}<br/><span className="text-[10px]">{s.phone}</span>
                                </td>
                                <td className="py-3.5 px-4 text-gray-400">{s.student_class} | {s.board}</td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${s.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-400'}`}>
                                    {s.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Right: create form */}
                      <div className="lg:col-span-1 glass-cyan p-6 rounded-2xl border border-cyan/15 space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                          <PlusCircle className="h-5 w-5 text-cyan mr-2" />
                          Enroll New Student
                        </h3>
                        
                        {studentSuccess && (
                          <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg text-xs">
                            Student enrolled successfully!
                          </div>
                        )}
                        {studentError && (
                          <div className="text-red bg-red/10 border border-red/20 px-3 py-2 rounded-lg text-xs">
                            {studentError}
                          </div>
                        )}

                        <form onSubmit={handleCreateStudent} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                            <input required type="text" value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                            <input required type="email" value={studentForm.email} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                            <input required type="tel" value={studentForm.phone} onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})} className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Initial Password</label>
                            <input required type="text" value={studentForm.password} onChange={(e) => setStudentForm({...studentForm, password: e.target.value})} className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Class</label>
                              <input required type="text" value={studentForm.studentClass} onChange={(e) => setStudentForm({...studentForm, studentClass: e.target.value})} className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan" placeholder="Class 10" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Board</label>
                              <input required type="text" value={studentForm.board} onChange={(e) => setStudentForm({...studentForm, board: e.target.value})} className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan" placeholder="CBSE" />
                            </div>
                          </div>
                          <button type="submit" className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan to-gold text-slate-950 text-xs font-bold hover:opacity-90">
                            Create Account
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* TESTIMONIALS TAB */}
                  {activeTab === "testimonials" && (
                    <div className="glass p-6 rounded-2xl border border-cyan/10 overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-gray-800 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                            <th className="py-3 px-4">Author</th>
                            <th className="py-3 px-4">Class/Board</th>
                            <th className="py-3 px-4">Review</th>
                            <th className="py-3 px-4">Approval</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testimonials.map((t) => (
                            <tr key={t.id} className="border-b border-gray-900 hover:bg-slate-900/40">
                              <td className="py-3.5 px-4 font-bold text-white">{t.name}</td>
                              <td className="py-3.5 px-4 text-gray-400">{t.studentClass} | {t.board}</td>
                              <td className="py-3.5 px-4 text-gray-400 max-w-sm truncate">{t.testimonial}</td>
                              <td className="py-3.5 px-4">
                                {t.approved ? (
                                  <button
                                    onClick={() => handleTestimonialApprove(t.id, false)}
                                    className="flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Approved</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleTestimonialApprove(t.id, true)}
                                    className="flex items-center space-x-1 text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded text-xs font-semibold"
                                  >
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>Pending</span>
                                  </button>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => handleTestimonialDelete(t.id)}
                                  className="text-red hover:bg-red/10 p-1.5 rounded-lg border border-red/15"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* BLOGS TAB */}
                  {activeTab === "blogs" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: list */}
                      <div className="lg:col-span-1 glass p-6 rounded-2xl border border-cyan/10 h-fit space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan">
                          Published Articles
                        </h3>
                        <div className="space-y-3">
                          {blogs.map((b) => (
                            <div key={b.id} className="p-3 bg-slate-950/60 border border-gray-800 rounded-xl flex items-center justify-between">
                              <div>
                                <span className="block text-xs font-bold text-white line-clamp-1">{b.title}</span>
                                <span className="block text-[10px] text-gray-500">{b.category}</span>
                              </div>
                              <button
                                onClick={() => handleTestimonialDelete(b.id)} // Replace with blog delete
                                className="text-red hover:bg-red/10 p-1.5 rounded-lg border border-red/15 ml-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: create form */}
                      <div className="lg:col-span-2 glass-cyan p-6 rounded-2xl border border-cyan/15 space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                          <PlusCircle className="h-5 w-5 text-cyan mr-2" />
                          Publish a New Math Article
                        </h3>

                        {blogSuccess && (
                          <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg text-xs">
                            Article published successfully!
                          </div>
                        )}
                        {blogError && (
                          <div className="text-red bg-red/10 border border-red/20 px-3 py-2 rounded-lg text-xs">
                            {blogError}
                          </div>
                        )}

                        <form onSubmit={handleCreateBlog} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Title</label>
                              <input
                                type="text"
                                required
                                value={blogForm.title}
                                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") })}
                                className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Slug</label>
                              <input
                                type="text"
                                required
                                value={blogForm.slug}
                                onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                                className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                              <select
                                value={blogForm.category}
                                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
                              >
                                <option value="Vedic Mathematics">Vedic Mathematics</option>
                                <option value="Mental Math">Mental Math</option>
                                <option value="Exam Preparation">Exam Preparation</option>
                                <option value="Algebra">Algebra</option>
                                <option value="Geometry">Geometry</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                              <input
                                type="text"
                                value={blogForm.tags}
                                onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                                placeholder="vedic math, speed, exam strategy"
                                className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Excerpt (Short description)</label>
                            <input
                              type="text"
                              required
                              value={blogForm.excerpt}
                              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                              className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Content (Markdown supported)</label>
                            <textarea
                              required
                              rows={8}
                              value={blogForm.content}
                              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                              placeholder="# Header 1&#10;&#10;Use headings, bullet points, and code blocks..."
                              className="w-full bg-slate-950 border border-cyan/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan resize-y"
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan to-gold text-slate-950 text-xs font-bold hover:opacity-90 cursor-pointer"
                          >
                            Publish Article
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
