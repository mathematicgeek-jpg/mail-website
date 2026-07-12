export interface GamificationProfile {
  playerName: string;
  xp: number;
  level: number;
  streak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  badges: string[];
}

export interface BadgeInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const BADGES: Record<string, BadgeInfo> = {
  geek_pioneer: {
    id: "geek_pioneer",
    title: "Math Pioneer",
    description: "Completed your first interactive math game!",
    icon: "🚀",
  },
  perfect_scorer: {
    id: "perfect_scorer",
    title: "Math Whiz",
    description: "Scored 100% correct answers in a game!",
    icon: "🏆",
  },
  speed_demon: {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Solved a Vedic math calculation step-by-step!",
    icon: "⚡",
  },
  streak_hero: {
    id: "streak_hero",
    title: "Streak Hero",
    description: "Maintained a 3-day consecutive math practice streak!",
    icon: "🔥",
  },
  algebra_ace: {
    id: "algebra_ace",
    title: "Algebra Ace",
    description: "Achieved Level 3 on your learning journey!",
    icon: "📐",
  },
};

const LOCAL_STORAGE_KEY = "math_geek_gamification_profile";
const EVENT_NAME = "gamificationUpdate";

export const DEFAULT_PROFILE: GamificationProfile = {
  playerName: "Math Cadet",
  xp: 0,
  level: 1,
  streak: 0,
  lastPlayedDate: "",
  badges: [],
};

export function getGamificationProfile(): GamificationProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      // Migrate old nickname if it exists
      const oldName = localStorage.getItem("math_geek_player_name");
      const defaultProfile = { ...DEFAULT_PROFILE };
      if (oldName) defaultProfile.playerName = oldName;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    return JSON.parse(stored) as GamificationProfile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveGamificationProfile(profile: GamificationProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    // Also update legacy nickname for compatibility
    localStorage.setItem("math_geek_player_name", profile.playerName);
    
    // Dispatch custom event to trigger live updates in layout header and dashboard
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: profile }));
  } catch (err) {
    console.error("Error saving gamification profile", err);
  }
}

export function addXP(amount: number): GamificationProfile {
  const profile = getGamificationProfile();
  profile.xp += amount;
  
  // Calculate Level: 100 XP per level
  const targetLevel = Math.floor(profile.xp / 100) + 1;
  if (targetLevel > profile.level) {
    profile.level = targetLevel;
    // Check level-up achievement
    if (profile.level >= 3 && !profile.badges.includes("algebra_ace")) {
      profile.badges.push("algebra_ace");
    }
  }
  
  saveGamificationProfile(profile);
  return profile;
}

export function updateStreak(): GamificationProfile {
  const profile = getGamificationProfile();
  const today = new Date().toISOString().split("T")[0];
  
  if (profile.lastPlayedDate === today) {
    // Already played today, no change
    return profile;
  }
  
  if (!profile.lastPlayedDate) {
    profile.streak = 1;
  } else {
    const lastDate = new Date(profile.lastPlayedDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      profile.streak += 1;
      // Streak badge check
      if (profile.streak >= 3 && !profile.badges.includes("streak_hero")) {
        profile.badges.push("streak_hero");
      }
    } else {
      profile.streak = 1; // reset streak if gap is larger than 1 day
    }
  }
  
  profile.lastPlayedDate = today;
  saveGamificationProfile(profile);
  return profile;
}

export function awardBadge(badgeId: string): { profile: GamificationProfile; newlyUnlocked: boolean } {
  const profile = getGamificationProfile();
  if (profile.badges.includes(badgeId)) {
    return { profile, newlyUnlocked: false };
  }
  
  profile.badges.push(badgeId);
  saveGamificationProfile(profile);
  return { profile, newlyUnlocked: true };
}
