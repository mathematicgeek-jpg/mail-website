"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { api } from "@/lib/api";
import { Calendar, User, Clock, ArrowLeft, Loader2, ChevronRight } from "lucide-react";
import ContactForm from "@/components/home/ContactForm";

// Simple markdown-to-HTML parser to avoid package bloat
function parseMarkdown(md: string): string {
  if (!md) return "";
  
  return md
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl sm:text-4xl font-extrabold text-white mt-8 mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl sm:text-2xl font-bold text-white mt-6 mb-3 border-b border-gray-800 pb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg sm:text-xl font-bold text-white mt-5 mb-2">$1</h3>')
    .replace(/^\* (.*$)/gim, '<li class="text-xs sm:text-sm text-gray-400 list-disc ml-6 py-1">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="text-xs sm:text-sm text-gray-400 list-disc ml-6 py-1">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-900 border border-cyan/15 text-cyan px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .split("\n\n")
    .map((p) => {
      if (p.trim().startsWith("<h") || p.trim().startsWith("<li")) return p;
      return `<p class="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">${p.trim()}</p>`;
    })
    .join("");
}

interface BlogPostType {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  read_time: number;
  featured_image: string;
  created_at: string;
}

export default function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback posts for rendering if API is not populated
  const fallbackPosts: Record<string, BlogPostType> = {
    "vedic-mathematics-complete-guide-techniques": {
      title: "Complete Guide to Vedic Mathematics: 15 Powerful Techniques for Lightning-Fast Calculations",
      slug: "vedic-mathematics-complete-guide-techniques",
      excerpt: "Master 15 powerful Vedic Mathematics techniques that enable you to solve complex problems 10x faster. This comprehensive guide covers basic multiplication tricks to advanced shortcuts.",
      category: "Vedic Mathematics",
      tags: ["vedic math", "calculation tricks", "exam prep"],
      author: "Aarti Agarwal",
      read_time: 15,
      featured_image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      content: `
# Complete Guide to Vedic Mathematics: 15 Powerful Techniques for Lightning-Fast Calculations

Vedic Mathematics is an ancient Indian system of calculation that enables students to solve mathematical problems with remarkable speed and accuracy. In this comprehensive guide, you'll master 15 powerful techniques that can transform your mathematical abilities.

## What is Vedic Mathematics?

Vedic Mathematics is based on 16 Sutras (aphorisms) discovered by Bharati Krishna Tirthaji in the early 20th century. These techniques are not just shortcuts but represent a coherent system of mental calculation that improves problem-solving skills and mathematical confidence.

### Benefits of Vedic Mathematics:
- **10-15x faster calculations** compared to conventional methods
- **Improved mental agility** and concentration
- **Better exam performance** in competitive tests
- **Reduced calculation errors**

## Technique 1: Vertically and Crosswise (Urdhva-Tiryagbhyam)

This is the crown jewel of Vedic Mathematics, used for multiplication of any two numbers.

**Example: 23 × 14**

Step 1: Multiply vertically (units): 3 × 4 = 12 (write 2, carry 1)
Step 2: Cross multiply: (2 × 4) + (3 × 1) = 8 + 3 = 11, plus carry 1 = 12 (write 2, carry 1)
Step 3: Multiply vertically (tens): 2 × 1 = 2, plus carry 1 = 3

**Answer: 322**

## Technique 2: Squaring Numbers Ending in 5

Instant squaring for any number ending in 5!

**Formula:** n5² = n(n+1) | 25

**Example: 75²**
- Take 7, multiply by 8: 7 × 8 = 56
- Append 25: **5625**

## Practice Tips for Mastering Vedic Math

1. **Daily practice**: 15-20 minutes per day for 30 days shows dramatic improvement.
2. **Combine techniques**: Often, multiple sutras work together.
3. **Use real exam problems**: Apply techniques to past papers.
      `,
    },
    "cbse-class-10-maths-board-exam-preparation-strategy": {
      title: "CBSE Class 10 Mathematics Board Exam 2026: Complete Preparation Strategy",
      slug: "cbse-class-10-maths-board-exam-preparation-strategy",
      excerpt: "Comprehensive preparation strategy for CBSE Class 10 Mathematics Board Exam 2026. Important questions, chapter-wise breakdown, and marking schemes.",
      category: "Exam Preparation",
      tags: ["CBSE", "class 10", "board exams", "exam strategy"],
      author: "Aarti Agarwal",
      read_time: 12,
      featured_image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      content: `
# CBSE Class 10 Mathematics Board Exam 2026: Complete Preparation Strategy

The CBSE Class 10 Mathematics Board Exam is a crucial milestone that shapes your academic future. This comprehensive guide provides a proven strategy to score 95%+ based on the latest CBSE pattern and expert analysis.

## Understanding the CBSE Class 10 Maths Paper Pattern 2026

### Section-wise Breakdown:
- **Section A:** 20 MCQs × 1 mark = 20 marks
- **Section B:** 5 VSA questions × 2 marks = 10 marks
- **Section C:** 6 SA questions × 3 marks = 18 marks
- **Section D:** 4 LA questions × 5 marks = 20 marks
- **Section E:** 3 Case Studies × 4 marks = 12 marks

## High Weightage Chapters & Strategy

### 1. Trigonometry (10-12 marks)
- Memorize all identities perfectly.
- Practice identity proofs daily.
- Master word problems on heights and distances.

### 2. Coordinate Geometry (6-8 marks)
- Master the distance formula and section formula.
- Focus on application-based questions.

## Month-wise Preparation Strategy

- **November - December (Syllabus Completion):** Complete entire syllabus, make formula sheets, understand all concepts.
- **January - Early February (Practice Phase):** Solve 10 complete sample papers, identify weak areas.
- **Mid-February - Exam Day (Revision):** Revise entire syllabus twice, mock tests in exam conditions.
      `,
    },
    "10-mental-math-tricks-faster-calculations": {
      title: "10 Mental Math Tricks Every Student Should Know for Faster Calculations",
      slug: "10-mental-math-tricks-faster-calculations",
      excerpt: "Learn 10 powerful mental math tricks that will help you calculate faster and more accurately. Perfect for students preparing for competitive exams.",
      category: "Mental Math",
      tags: ["mental math", "calculation tricks", "study tips"],
      author: "Aarti Agarwal",
      read_time: 7,
      featured_image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1200&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      content: `
# 10 Mental Math Tricks Every Student Should Know

Mental math is a superpower that can transform your performance in exams and daily life. Here are the top tricks every student should master:

## 1. Multiplying by 11
- For a 2-digit number (e.g. 43 × 11), add the two digits: 4 + 3 = 7.
- Place the sum in the middle: **473**.

## 2. Multiplying by 9, 99, 999
- To multiply a number by 99 (e.g. 47 × 99), subtract 1 from the number: 47 - 1 = 46.
- Subtract that result from 99: 99 - 46 = 53.
- Combined answer: **4653**.

## 3. Multiplying large numbers by 5
- Divide the number by 2, then multiply by 10 (add a zero at the end).
- Example: 248 × 5 → 248 / 2 = 124 → add zero: **1240**.
      `,
    },
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await api.fetchBlogPostBySlug(slug);
        const relatedData = await api.fetchRelatedPosts(slug);

        if (data) {
          setPost(data);
        } else {
          setPost(fallbackPosts[slug] || null);
        }
        setRelated(relatedData || []);
      } catch (err) {
        setPost(fallbackPosts[slug] || null);
        
        // Setup simple related posts fallback
        const currentPost = fallbackPosts[slug];
        if (currentPost) {
          const list = Object.values(fallbackPosts).filter(
            (p) => p.slug !== slug && p.category === currentPost.category
          );
          setRelated(list);
        }
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-cyan mb-2" />
        <span>Loading article...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-xl font-bold text-white mb-4">Article Not Found</h2>
        <button
          onClick={() => router.push("/blog")}
          className="flex items-center space-x-2 text-cyan font-semibold hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-grow pt-32 pb-24 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog Listing</span>
          </Link>

          {/* Article Header */}
          <header className="space-y-4 mb-8">
            <span className="bg-cyan text-slate-950 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-5xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-b border-gray-800 pb-6">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-cyan" />
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-cyan" />
                {post.read_time} min read
              </span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1 text-gold" />
                By {post.author} (Merit Score Expert)
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden mb-12 bg-slate-900 border border-cyan/10">
            <img
              src={post.featured_image}
              alt={post.title}
              className="object-cover h-full w-full opacity-80"
            />
          </div>

          {/* Article Content */}
          <article 
            className="prose prose-invert max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-gray-800 pt-6 mb-16">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-900 text-gray-400 text-xs px-3 py-1 rounded-lg border border-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="border-t border-gray-800 pt-12 mb-16">
              <h3 className="text-lg font-bold text-white mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="glass-cyan border border-cyan/10 p-5 rounded-2xl flex items-center justify-between hover:border-cyan/30 transition-colors group"
                  >
                    <div>
                      <span className="text-[10px] text-cyan font-bold uppercase tracking-wider block mb-1">
                        {p.category}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan transition-colors line-clamp-1">
                        {p.title}
                      </h4>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-white shrink-0 ml-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Lead Capture Form */}
          <div className="border-t border-gray-800 pt-16">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-white mb-2">Want to Score 95%+ in Math?</h3>
              <p className="text-xs text-gray-400">
                Book a personalized session with Aarti Agarwal to diagnostic check your learning gaps.
              </p>
            </div>
            <ContactForm />
          </div>

        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
