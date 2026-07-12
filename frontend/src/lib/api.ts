import { API_BASE_URL } from "./constants";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMsg = "API request failed";
    try {
      const err = await response.json();
      errorMsg = err.detail || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json() as Promise<T>;
}

// Admin Token Storage Helpers
const TOKEN_KEY = "math_geek_admin_token";

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API Services
export const api = {
  // Leads & Contact
  submitInquiry: async (data: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    state?: string;
    country?: string;
    studentClass: string;
    board: string;
    preferredMode: string;
    message?: string;
    source?: string;
  }) => {
    return request<any>("/api/demo-inquiry", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  fetchInquiries: async () => {
    return request<any[]>("/api/demo-inquiries", {
      headers: getAuthHeaders(),
    });
  },

  updateInquiryStatus: async (id: string, status: string) => {
    return request<any>(`/api/admin/inquiry/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
  },

  deleteInquiry: async (id: string) => {
    return request<any>(`/api/admin/inquiry/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  },

  fetchInquiryStats: async () => {
    return request<any>("/api/demo-inquiries/stats");
  },

  // Testimonials
  submitTestimonial: async (data: {
    name: string;
    studentClass: string;
    board: string;
    rating: number;
    testimonial: string;
    improvement?: string;
  }) => {
    return request<any>("/api/testimonial", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  fetchTestimonials: async (approvedOnly: boolean = true) => {
    return request<any[]>(`/api/testimonials?approved_only=${approvedOnly}`);
  },

  approveTestimonial: async (id: string, approved: boolean) => {
    return request<any>(`/api/admin/testimonial/${id}/approve`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ approved }),
    });
  },

  deleteTestimonial: async (id: string) => {
    return request<any>(`/api/admin/testimonial/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  },

  // Blog
  fetchBlogPosts: async (category?: string, tag?: string) => {
    let path = "/api/blog/posts";
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (tag) params.append("tag", tag);
    const query = params.toString();
    if (query) path += `?${query}`;
    return request<any[]>(path);
  },

  fetchBlogPostBySlug: async (slug: string) => {
    return request<any>(`/api/blog/posts/${slug}`);
  },

  fetchBlogCategories: async () => {
    return request<any[]>("/api/blog/categories");
  },

  fetchRelatedPosts: async (slug: string) => {
    return request<any[]>(`/api/blog/related/${slug}`);
  },

  createBlogPost: async (data: any) => {
    return request<any>("/api/admin/blog/posts", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  updateBlogPost: async (id: string, data: any) => {
    return request<any>(`/api/admin/blog/posts/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteBlogPost: async (id: string) => {
    return request<any>(`/api/admin/blog/posts/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  },

  fetchAllBlogPostsAdmin: async () => {
    return request<any[]>("/api/admin/blog/posts/all", {
      headers: getAuthHeaders(),
    });
  },

  // Games
  fetchGameTemplates: async (topic?: string) => {
    let path = "/api/games/templates";
    if (topic) path += `?topic=${topic}`;
    return request<any[]>(path);
  },

  fetchGameTopics: async () => {
    return request<any[]>("/api/games/topics");
  },

  startGameSession: async (templateId: string, playerName: string) => {
    return request<any>("/api/games/start", {
      method: "POST",
      body: JSON.stringify({ template_id: templateId, player_name: playerName }),
    });
  },

  submitAnswer: async (sessionId: string, questionId: string, answer: string, timeTaken: number) => {
    return request<any>(`/api/games/answer?session_id=${sessionId}&question_id=${questionId}&answer=${encodeURIComponent(answer)}&time_taken=${timeTaken}`, {
      method: "POST",
    });
  },

  completeGameSession: async (sessionId: string) => {
    return request<any>(`/api/games/complete/${sessionId}`, {
      method: "POST",
    });
  },

  fetchLeaderboard: async (limit: number = 20) => {
    return request<any[]>(`/api/games/leaderboard?limit=${limit}`);
  },

  // Admin Auth
  login: async (credentials: any) => {
    return request<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  fetchDashboardStats: async () => {
    return request<any>("/api/admin/dashboard-stats", {
      headers: getAuthHeaders(),
    });
  },
};
