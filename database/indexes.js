// MongoDB Index Definitions for Mathematics Geek
// Run this script against your MongoDB instance:
//   mongosh < indexes.js
// or load it in MongoDB Atlas Index Manager

const db = db.getSiblingDB("mathematics_geek");

// === leads (demo_inquiries) ===
db.leads.createIndex({ email: 1 }, { unique: true, sparse: true });
db.leads.createIndex({ phone: 1 });
db.leads.createIndex({ status: 1, created_at: -1 });
db.leads.createIndex({ source: 1 });
db.leads.createIndex({ created_at: -1 });

// === users ===
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { unique: true, sparse: true });
db.users.createIndex({ role: 1 });

// === blog_posts ===
db.blog_posts.createIndex({ slug: 1 }, { unique: true });
db.blog_posts.createIndex({ status: 1, created_at: -1 });
db.blog_posts.createIndex({ category: 1 });
db.blog_posts.createIndex({ tags: 1 });
db.blog_posts.createIndex(
  { title: "text", content: "text", excerpt: "text" },
  { weights: { title: 10, excerpt: 5, content: 1 }, name: "blog_text_search" }
);

// === testimonials ===
db.testimonials.createIndex({ approved: 1, created_at: -1 });
db.testimonials.createIndex({ rating: -1 });

// === game_templates ===
db.game_templates.createIndex({ active: 1, topic: 1 });
db.game_templates.createIndex({ type: 1 });
db.game_templates.createIndex({ class_range: 1 });

// === game_sessions ===
db.game_sessions.createIndex({ user_id: 1, completed_at: -1 });
db.game_sessions.createIndex({ template_id: 1 });
db.game_sessions.createIndex({ score: -1 }); // For leaderboard
db.game_sessions.createIndex({ completed_at: -1 });
db.game_sessions.createIndex({ player_name: 1, score: -1 }); // Leaderboard by name

// === questions ===
db.questions.createIndex({ topic: 1, difficulty: 1, class_level: 1 });
db.questions.createIndex({ type: 1 });

// === user_progress ===
db.user_progress.createIndex({ user_id: 1 }, { unique: true });
db.user_progress.createIndex({ total_xp: -1 }); // Global XP leaderboard
db.user_progress.createIndex({ level: -1 });

// === whatsapp_conversations ===
db.whatsapp_conversations.createIndex({ phone: 1 }, { unique: true });
db.whatsapp_conversations.createIndex({ state: 1 });
db.whatsapp_conversations.createIndex({ lead_id: 1 }, { sparse: true });
db.whatsapp_conversations.createIndex({ updated_at: -1 });

print("✅ All indexes created successfully for mathematics_geek database");
