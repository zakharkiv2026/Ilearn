const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5084";

// ── Auth ──────────────────────────────────────────────────────────────────────

export type AuthUser = {
  name: string;
  email: string;
  picture: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ilearn_token");
}

export function setToken(token: string) {
  localStorage.setItem("ilearn_token", token);
}

export function clearToken() {
  localStorage.removeItem("ilearn_token");
}

export async function loginWithGoogle(idToken: string): Promise<{ token: string } & AuthUser> {
  const res = await fetch(`${BASE_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Auth failed");
  return res.json();
}

export async function getUserStats(): Promise<UserStats | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${BASE_URL}/api/users/me/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserStats = {
  totalXp: number;
  completedLessons: number;
  streak: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  rank: number;
};

export type ApiLesson = {
  id: number;
  unitId: number;
  title: string;
  type: string;
  order: number;
  isLocked: boolean;
  isDone: boolean;
  isActive: boolean;
  xpReward: number;
};

export type ApiUnit = {
  id: number;
  sectionId: number;
  sectionName: string;
  title: string;
  icon: string;
  imageUrl: string;
  color: string;
  order: number;
  progress: number;
  lessonCount?: number;
  lessons?: ApiLesson[];
};

export type ApiSection = {
  id: number;
  name: string;
  order: number;
};

// ── Colour mapping ────────────────────────────────────────────────────────────
// The backend stores the gradient fragment; we derive border + glow here.

const unitThemes: Record<string, { border: string; glow: string }> = {
  green:  { border: "border-green-500/25",  glow: "shadow-[0_4px_24px_rgba(34,197,94,0.2)]"  },
  blue:   { border: "border-blue-500/20",   glow: "shadow-[0_4px_24px_rgba(59,130,246,0.15)]" },
  rose:   { border: "border-rose-500/20",   glow: "shadow-[0_4px_24px_rgba(244,63,94,0.15)]"  },
  violet: { border: "border-violet-500/20", glow: "shadow-[0_4px_24px_rgba(139,92,246,0.15)]" },
  yellow: { border: "border-yellow-500/20", glow: "shadow-[0_4px_24px_rgba(234,179,8,0.15)]"  },
};

function themeFromColor(color: string) {
  const key = Object.keys(unitThemes).find(k => color.includes(k));
  return unitThemes[key ?? "blue"];
}

// ── API calls ─────────────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export async function getUnits(): Promise<ApiUnit[]> {
  return get<ApiUnit[]>("/api/units");
}

export async function getUnitWithLessons(id: number): Promise<ApiUnit> {
  return get<ApiUnit>(`/api/units/${id}`);
}

export async function getSections(): Promise<ApiSection[]> {
  return get<ApiSection[]>("/api/sections");
}

export async function completeLesson(id: number): Promise<void> {
  await fetch(`${BASE_URL}/api/lessons/${id}/complete`, { method: "PATCH" });
}

// ── Mappers ───────────────────────────────────────────────────────────────────
// Convert API response → props accepted by UnitCard / MobileMap

export function mapUnitToCard(u: ApiUnit) {
  const { border, glow } = themeFromColor(u.color);
  return {
    unit:     u.id,
    section:  u.sectionName,
    title:    u.title,
    icon:     u.icon,
    image:    u.imageUrl,
    color:    `bg-gradient-to-r ${u.color}`,
    border,
    glow,
    progress: u.progress,
    lessons:  (u.lessons ?? []).map(l => ({
      title:  l.title,
      type:   l.type,
      done:   l.isDone,
      active: l.isActive,
      locked: l.isLocked,
    })),
  };
}
