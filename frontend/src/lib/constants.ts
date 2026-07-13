export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const SITE_METADATA = {
  title: "Mathematics Geeks | Merit Score Expert & Vedic Math Coaching",
  siteName: "Mathematics Geeks",
  description: "Expert math coaching for Classes 6-12 (CBSE, ICSE, IB, GCSE, Oxford). Master speed math, Vedic Math tricks, and score 95%+ in board exams with Aarti Agarwal.",
  phone: "+919639351708",
  whatsapp: "919639351708",
  email: "aarti0301@gmail.com",
  teacher: "Aarti Agarwal",
  siteUrl: "https://mathematicsgeek.com",
};

export const CLASSES = [
  { id: "class-6", name: "Class 6", num: 6 },
  { id: "class-7", name: "Class 7", num: 7 },
  { id: "class-8", name: "Class 8", num: 8 },
  { id: "class-9", name: "Class 9", num: 9 },
  { id: "class-10", name: "Class 10", num: 10 },
  { id: "class-11", name: "Class 11", num: 11 },
  { id: "class-12", name: "Class 12", num: 12 },
];

export const BOARDS = [
  { id: "cbse", name: "CBSE (Central Board)" },
  { id: "icse", name: "ICSE / ISC" },
  { id: "ib", name: "IB (International Baccalaureate)" },
  { id: "gcse", name: "GCSE / IGCSE" },
  { id: "cambridge", name: "Cambridge" },
  { id: "oxford", name: "Oxford" },
];

export const TOPICS = [
  { id: "algebra", name: "Algebra" },
  { id: "geometry", name: "Geometry" },
  { id: "trigonometry", name: "Trigonometry" },
  { id: "calculus", name: "Calculus" },
  { id: "statistics", name: "Statistics" },
  { id: "number-theory", name: "Number Theory" },
  { id: "arithmetic", name: "Arithmetic" },
  { id: "vedic-math", name: "Vedic Math" },
];
