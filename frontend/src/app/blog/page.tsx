"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { api } from "@/lib/api";
import { Calendar, User, Clock, ChevronRight, BookOpen, Loader2 } from "lucide-react";

interface BlogPostType {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  read_time: number;
  featured_image: string;
  created_at: string;
}

export default function BlogListing() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback posts for rendering if API is not populated
  const fallbackPosts = [
    {
      id: "b1",
      title: "Complete Guide to Vedic Mathematics: 15 Powerful Techniques for Lightning-Fast Calculations",
      slug: "vedic-mathematics-complete-guide-techniques",
      excerpt: "Master 15 powerful Vedic Mathematics techniques that enable you to solve complex problems 10x faster. Basic multiplication tricks to advanced calculus shortcuts.",
      category: "Vedic Mathematics",
      tags: ["vedic math", "calculation tricks", "exam prep"],
      author: "Aarti Agarwal",
      read_time: 15,
      featured_image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
      created_at: new Date().toISOString(),
    },
    {
      id: "b2",
      title: "CBSE Class 10 Mathematics Board Exam 2026: Complete Preparation Strategy",
      slug: "cbse-class-10-maths-board-exam-preparation-strategy",
      excerpt: "Comprehensive preparation strategy for CBSE Class 10 Mathematics Board Exam 2026. Important questions, chapter-wise breakdown, and marking schemes.",
      category: "Exam Preparation",
      tags: ["CBSE", "class 10", "board exams", "exam strategy"],
      author: "Aarti Agarwal",
      read_time: 12,
      featured_image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60",
      created_at: new Date().toISOString(),
    },
    {
      id: "b3",
      title: "10 Mental Math Tricks Every Student Should Know for Faster Calculations",
      slug: "10-mental-math-tricks-faster-calculations",
      excerpt: "Learn 10 powerful mental math tricks that will help you calculate faster and more accurately. Perfect for students preparing for competitive exams.",
      category: "Mental Math",
      tags: ["mental math", "calculation tricks", "study tips"],
      author: "Aarti Agarwal",
      read_time: 7,
      featured_image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&auto=format&fit=crop&q=60",
      created_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        const postsData = await api.fetchBlogPosts(selectedCategory || undefined);
        const catsData = await api.fetchBlogCategories();

        if (postsData && postsData.length > 0) {
          setPosts(postsData);
        } else {
          // Filter fallback posts client-side if a category is selected
          const filtered = selectedCategory
            ? fallbackPosts.filter((p) => p.category === selectedCategory)
            : fallbackPosts;
          setPosts(filtered);
        }

        if (catsData && catsData.length > 0) {
          setCategories(catsData);
        } else {
          // Count categories from fallbacks
          const counts: Record<string, number> = {};
          fallbackPosts.forEach((p) => {
            counts[p.category] = (counts[p.category] || 0) + 1;
          });
          setCategories(Object.entries(counts).map(([name, count]) => ({ name, count })));
        }
      } catch (err) {
        const filtered = selectedCategory
          ? fallbackPosts.filter((p) => p.category === selectedCategory)
          : fallbackPosts;
        setPosts(filtered);
        
        const counts: Record<string, number> = {};
        fallbackPosts.forEach((p) => {
          counts[p.category] = (counts[p.category] || 0) + 1;
        });
        setCategories(Object.entries(counts).map(([name, count]) => ({ name, count })));
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    loadBlogData();
  }, [selectedCategory]);

  return (
    <>
      <Header />

      <main className="flex-grow pt-32 pb-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold uppercase tracking-wider mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Learning Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Math Tips, Tricks & Strategies
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Boost your speed and master complex formulas with insights from Aarti Agarwal Ma'am.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-cyan p-6 rounded-2xl border border-cyan/15">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 text-cyan">
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                      selectedCategory === null
                        ? "bg-cyan text-slate-950 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    All Posts
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                        selectedCategory === cat.name
                          ? "bg-cyan text-slate-950 font-semibold"
                          : "text-gray-400 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        selectedCategory === cat.name ? "bg-slate-900/20 text-slate-950" : "bg-slate-900 text-gray-400"
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan mb-2" />
                  <span>Loading posts...</span>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-24 text-gray-500 glass-cyan rounded-2xl border border-cyan/10">
                  <p>No blog posts found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="glass-cyan border border-cyan/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg transition-transform hover:-translate-y-1 hover:border-cyan/20"
                    >
                      {/* Featured Image */}
                      <div className="relative h-48 w-full bg-slate-900">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="object-cover h-full w-full opacity-80"
                        />
                        <div className="absolute top-4 left-4 bg-cyan text-slate-950 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                          {post.category}
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4 text-[11px] text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(post.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {post.read_time} min read
                            </span>
                          </div>
                          
                          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 hover:text-cyan transition-colors">
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>

                          <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="border-t border-gray-800 pt-4 mt-4 flex items-center justify-between">
                          <span className="text-[11px] text-gray-500 flex items-center">
                            <User className="h-3 w-3 mr-1 text-gold" />
                            {post.author}
                          </span>
                          
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-xs font-semibold text-cyan hover:text-white flex items-center"
                          >
                            <span>Read Article</span>
                            <ChevronRight className="h-4 w-4 ml-0.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
