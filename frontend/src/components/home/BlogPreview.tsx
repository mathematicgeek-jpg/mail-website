"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Calendar, Clock, ChevronRight, BookOpen } from "lucide-react";

interface BlogPost {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  read_time: string;
  featured_image: string;
  created_at: string;
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    title: "How to Check Your Math Answers: Verification Techniques",
    slug: "how-to-check-math-answers-verification-techniques",
    category: "Study Tips",
    excerpt: "Avoid silly calculation mistakes. Learn back-substitution, digit sums, estimation, and range checking to verify answers instantly.",
    read_time: "7 min read",
    featured_image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80",
    created_at: "2026-07-10T12:00:00Z",
  },
  {
    title: "Time Management Tips for Math Exams",
    slug: "time-management-tips-for-math-exams",
    category: "Study Tips",
    excerpt: "Learn how to allocate time across Sections A to E in math papers. Maximize your score by planning reading and buffer revision slots.",
    read_time: "7 min read",
    featured_image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=80",
    created_at: "2026-07-09T12:00:00Z",
  },
  {
    title: "CBSE Class 9 Maths: Chapter-wise Important Questions",
    slug: "cbse-class-9-maths-chapter-wise-important-questions",
    category: "Exam Preparation",
    excerpt: "A comprehensive compilation of must-practice questions for CBSE Class 9 Mathematics. Ensure your foundational topics are secure.",
    read_time: "9 min read",
    featured_image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
    created_at: "2026-07-11T12:00:00Z",
  },
];

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await api.fetchBlogPosts();
        if (data && data.length > 0) {
          // Sort by date (descending) and take top 3
          const sorted = [...data]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
          setPosts(sorted);
        } else {
          setPosts(FALLBACK_POSTS);
        }
      } catch (err) {
        console.error("Error loading blog posts for homepage preview, using fallbacks:", err);
        setPosts(FALLBACK_POSTS);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  return (
    <section className="py-24 bg-slate-900 border-y border-slate-200/60 relative">
      <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold uppercase tracking-widest mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Articles & Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Math Board Guides & Vedic Secrets
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Stay ahead with weekly tips, test-taking strategies, and mental calculations tutorials.
            </p>
          </div>
          
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-cyan/20 text-sm font-semibold rounded-2xl text-cyan bg-slate-900/50 hover:bg-slate-900 transition-all hover:scale-105"
          >
            Explore Full Blog
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            // Skeletons
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#ffffff] border border-slate-200 rounded-3xl h-[420px] animate-pulse flex flex-col justify-between p-6 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="bg-slate-200 h-40 rounded-2xl"></div>
                  <div className="bg-slate-200 h-6 rounded-lg w-3/4"></div>
                  <div className="bg-slate-200 h-4 rounded-lg w-full"></div>
                  <div className="bg-slate-200 h-4 rounded-lg w-2/3"></div>
                </div>
                <div className="bg-slate-200 h-8 rounded-xl w-1/3"></div>
              </div>
            ))
          ) : (
            posts.map((post) => {
              const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <article
                  key={post.slug}
                  className="bg-[#ffffff] border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group hover:scale-[1.02] hover:border-cyan/35 transition-all duration-300 h-[460px]"
                >
                  <div>
                    {/* Featured Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-4 left-4 bg-cyan text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                        {post.category}
                      </span>
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center space-x-4 text-slate-400 text-xs font-semibold">
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {post.read_time}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#111827] line-clamp-2 group-hover:text-cyan transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mt-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Read Link */}
                  <div className="px-6 pb-6 pt-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-cyan hover:text-gold flex items-center group/link transition-colors border-t border-slate-100 pt-4"
                    >
                      Read Full Article
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
