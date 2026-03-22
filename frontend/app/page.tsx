"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { getUnits, getUnitWithLessons, mapUnitToCard, type ApiUnit, loginWithGoogle, getMe, clearToken, setToken, getUserStats, getLeaderboard, type AuthUser, type UserStats, type LeaderboardEntry } from "@/lib/api";

type Tab = "learn" | "practice" | "leaderboard" | "profile";

// ── Helpers ───────────────────────────────────────────────────────────────────

function XpBar({ current, max, color = "from-yellow-400 to-orange-400" }: {
  current: number; max: number; color?: string;
}) {
  return (
    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
        style={{ width: `${Math.min((current / max) * 100, 100)}%` }} />
    </div>
  );
}

function ProgressRing({ pct, size = 64, stroke = 6, color = "#22c55e" }: {
  pct: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }} />
    </svg>
  );
}

// ── Owl ───────────────────────────────────────────────────────────────────────
function Owl({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 120 140" fill="none">
      <ellipse cx="60" cy="90" rx="38" ry="42" fill="#4B5563" />
      <ellipse cx="60" cy="92" rx="32" ry="36" fill="#6B7280" />
      <ellipse cx="60" cy="100" rx="20" ry="24" fill="#D1D5DB" />
      <ellipse cx="28" cy="95" rx="14" ry="22" fill="#374151" transform="rotate(-15 28 95)" />
      <ellipse cx="92" cy="95" rx="14" ry="22" fill="#374151" transform="rotate(15 92 95)" />
      <ellipse cx="60" cy="58" rx="30" ry="28" fill="#6B7280" />
      <ellipse cx="43" cy="33" rx="7" ry="10" fill="#4B5563" transform="rotate(-20 43 33)" />
      <ellipse cx="77" cy="33" rx="7" ry="10" fill="#4B5563" transform="rotate(20 77 33)" />
      <ellipse cx="60" cy="60" rx="22" ry="20" fill="#E5E7EB" />
      <circle cx="50" cy="56" r="10" fill="white" /><circle cx="50" cy="56" r="7" fill="#2563EB" />
      <circle cx="50" cy="56" r="3" fill="#1E3A8A" /><circle cx="47" cy="53" r="1.5" fill="white" />
      <circle cx="70" cy="56" r="10" fill="white" /><circle cx="70" cy="56" r="7" fill="#2563EB" />
      <circle cx="70" cy="56" r="3" fill="#1E3A8A" /><circle cx="67" cy="53" r="1.5" fill="white" />
      <polygon points="60,65 54,72 66,72" fill="#F59E0B" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE COMPONENTS (Duolingo map)
// ─────────────────────────────────────────────────────────────────────────────

type NodeStatus = "done" | "active" | "locked";

function MapNode({
  status, icon, label, circleRef, onStart,
}: {
  status: NodeStatus; icon: string; label: string;
  circleRef?: React.RefCallback<HTMLDivElement>;
  onStart?: () => void;
}) {
  const [tip, setTip] = useState(false);
  return (
    <div className="relative flex flex-col items-center">
      {tip && status !== "locked" && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap z-50">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
        </div>
      )}
      <button
        disabled={status === "locked"}
        onClick={status !== "locked" ? onStart : undefined}
        onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}
        className={`relative transition-all ${status !== "locked" ? "hover:scale-105 active:scale-90" : "cursor-not-allowed"}`}
      >
        {status === "active" && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping scale-150" />
            <div className="absolute inset-0 rounded-full border-4 border-green-400/40 scale-125" />
          </>
        )}
        {/* circleRef чіпляємо прямо до кружка */}
        <div
          ref={circleRef}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl relative z-10
            ${status === "done"   ? "bg-green-500 shadow-[0_6px_0_#15803d]" : ""}
            ${status === "active" ? "bg-green-400 shadow-[0_6px_0_#16a34a] ring-4 ring-white/25" : ""}
            ${status === "locked" ? "bg-[#374151] shadow-[0_6px_0_#1f2937]" : ""}
          `}>
          {status === "done"   && <span className="text-white font-black text-2xl">★</span>}
          {status === "active" && <span>{icon}</span>}
          {status === "locked" && <span className="opacity-40 text-xl">🔒</span>}
        </div>
      </button>
      {status === "done" && (
        <div className="flex gap-0.5 mt-1.5">{[0,1,2].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
      )}
      {status === "active" && (
        <div className="mt-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">СТАРТ</div>
      )}
    </div>
  );
}

// ── MobileMap colour mapping (from gradient string) ─────────────────────────
const bannerColorMap: Record<string, string> = {
  green:  "bg-green-700/90",
  blue:   "bg-blue-700/90",
  rose:   "bg-rose-700/90",
  violet: "bg-violet-700/90",
  yellow: "bg-yellow-700/90",
  indigo: "bg-indigo-700/90",
  pink:   "bg-pink-700/90",
  emerald:"bg-emerald-700/90",
};

function bannerColorFromGradient(color: string) {
  const key = Object.keys(bannerColorMap).find(k => color.includes(k));
  return bannerColorMap[key ?? "blue"];
}

// Zigzag column pattern for mobile map nodes
const COL_PATTERN = [2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3];

function MobileMap({ units }: { units: ApiUnit[] }) {
  type MapItem =
    | { type: "banner"; label: string; title: string; color: string; icon: string }
    | { type: "node";   status: NodeStatus; icon: string; label: string; col: number; lessonId: number }
    | { type: "chest";  locked?: boolean };

  // Build items dynamically from API units
  const items: MapItem[] = [];
  if (units.length === 0) {
    // Fallback skeleton while loading
    items.push({ type: "banner", label: "Завантаження...", title: "", color: "bg-white/10", icon: "⏳" });
  } else {
    for (const u of units) {
      const sectionLabel = `${u.sectionName} · Юніт ${u.id}`;
      items.push({
        type: "banner",
        label: sectionLabel,
        title: u.title,
        color: bannerColorFromGradient(u.color),
        icon: u.icon,
      });
      const lessons = u.lessons ?? [];
      const allDone = lessons.length > 0 && lessons.every(l => l.isDone);
      lessons.forEach((l, idx) => {
        const status: NodeStatus = l.isDone ? "done" : l.isActive ? "active" : "locked";
        items.push({ type: "node", status, icon: u.icon, label: l.title, col: COL_PATTERN[idx % COL_PATTERN.length], lessonId: l.id });
      });
      items.push({ type: "chest", locked: !allDone });
    }
  }

  const colPad: Record<number, string> = { 0: "28px", 1: "68px", 2: "116px", 3: "164px", 4: "204px" };

  // ── Measure real node positions ─────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  // Only nodes and chests are "connectable" — collect their indices among items
  const connectableIndices = items.reduce<number[]>((acc, item, i) => {
    if (item.type === "node" || item.type === "chest") acc.push(i);
    return acc;
  }, []);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pathD, setPathD] = useState("");
  const [svgH, setSvgH] = useState(0);

  function buildPath(pts: [number, number][]) {
    if (pts.length < 2) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
      const dy = y2 - y1;
      // Контрольні точки виходять вертикально з кожного вузла —
      // дає плавну S-подібну криву незалежно від відстані
      const tension = dy * 0.55;
      const cp1x = x1, cp1y = y1 + tension;
      const cp2x = x2, cp2y = y2 - tension;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
    }
    return d;
  }

  function measure() {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pts: [number, number][] = [];
    for (const el of nodeRefs.current) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      // center of the element relative to container
      const cx = r.left - containerRect.left + r.width / 2;
      const cy = r.top  - containerRect.top  + r.height / 2;
      pts.push([cx, cy]);
    }
    if (pts.length) {
      setPathD(buildPath(pts));
      setSvgH(containerRef.current.scrollHeight);
    }
  }

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  });

  // Assign refs to connectable items in render order
  let refIdx = 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs mx-auto">
      {/* Items — рендеримо ПЕРШИМИ, SVG поверх них */}
      <div className="relative flex flex-col pt-4">
        {items.map((item, i) => {
          if (item.type === "banner") return (
            <div key={i} className="py-4 px-3 relative" style={{ zIndex: 4 }}>
              <div className={`${item.color} rounded-2xl px-4 py-3 flex items-center justify-between border border-white/10`}>
                <div>
                  <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{item.label}</div>
                  <div className="text-white font-black text-sm mt-0.5">{item.title}</div>
                </div>
                <span className="text-2xl">{item.icon}</span>
              </div>
            </div>
          );

          if (item.type === "node") {
            const rIdx = refIdx++;
            return (
              <div key={i} className="py-3 flex relative" style={{ paddingLeft: colPad[item.col], zIndex: 10 }}>
                {/* circleRef іде прямо на кружок всередині MapNode */}
                <MapNode
                  status={item.status}
                  icon={item.icon}
                  label={item.label}
                  circleRef={el => { nodeRefs.current[rIdx] = el; }}
                  onStart={() => { window.location.href = `/lesson?id=${item.lessonId}`; }}
                />
              </div>
            );
          }

          if (item.type === "chest") {
            const rIdx = refIdx++;
            return (
              <div key={i} className="py-4 flex justify-center relative" style={{ zIndex: 10 }}>
                <div
                  ref={el => { nodeRefs.current[rIdx] = el; }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-[0_6px_0_rgba(0,0,0,0.3)] transition-all
                    ${item.locked
                      ? "bg-[#374151] opacity-40"
                      : "bg-gradient-to-b from-yellow-400 to-orange-500 shadow-[0_6px_0_#b45309] cursor-pointer hover:scale-105"
                    }`}
                >
                  🎁
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* SVG поверх банерів, але pointer-events-none щоб не блокувати кліки */}
      {pathD && (
        <svg
          className="absolute inset-0 w-full pointer-events-none"
          style={{ height: svgH, zIndex: 5 }}
          viewBox={`0 0 ${containerRef.current?.clientWidth ?? 320} ${svgH}`}
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="roadglow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Тінь */}
          <path d={pathD} stroke="#052e16"  strokeWidth="22" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Основна суцільна лінія */}
          <path d={pathD} stroke="#16a34a"  strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#roadglow)" />
          {/* Світлий центр — ефект об'єму */}
          <path d={pathD} stroke="#4ade80"  strokeWidth="8"  fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          <path d={pathD} stroke="#dcfce7"  strokeWidth="3"  fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        </svg>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function UnitCard({ unit, section, title, icon, color, border, glow, progress, lessons, image }: {
  unit: number; section: string; title: string; icon: string; color: string; border: string; glow: string;
  progress: number; image: string;
  lessons: { id: number; title: string; type: string; xp: number; done?: boolean; locked?: boolean; active?: boolean }[];
}) {
  const nextLesson = lessons.find(l => !l.done && !l.locked);

  function goLesson(id: number) {
    window.location.href = `/lesson?id=${id}`;
  }

  return (
    <div className={`rounded-3xl border ${border} overflow-hidden ${glow}`}>
      {/* Header з фоновою картинкою */}
      <div className="relative h-36 overflow-hidden">
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className={`absolute inset-0 ${color} opacity-75`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="relative z-10 h-full flex items-end justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20">{icon}</div>
            <div>
              <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{section}</div>
              <div className="text-white font-black text-lg drop-shadow-lg">{title}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/70 text-xs mb-1">{progress}% виконано</div>
            <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons grid */}
      <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-2">
        {lessons.map((l, i) => (
          <button key={i} disabled={l.locked}
            onClick={() => !l.locked && goLesson(l.id)}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all
              ${l.done   ? "bg-green-500/10 border border-green-500/20 hover:bg-green-500/15" : ""}
              ${l.active ? "bg-white/10 border border-white/20 hover:bg-white/15" : ""}
              ${l.locked ? "bg-white/3 border border-white/5 opacity-40 cursor-not-allowed" : ""}
              ${!l.done && !l.active && !l.locked ? "bg-white/5 border border-white/10 hover:bg-white/10" : ""}
            `}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0
              ${l.done ? "bg-green-500" : l.active ? "bg-white/20" : "bg-white/10"}`}>
              {l.done ? "✓" : l.locked ? "🔒" : "▶"}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold truncate ${l.done ? "text-white/60" : l.locked ? "text-white/25" : "text-white"}`}>
                {l.title}
              </div>
              <div className="text-white/30 text-xs">{l.type}</div>
            </div>
            {!l.locked && (
              <div className={`text-xs font-bold flex-shrink-0 ${l.done ? "text-green-400" : "text-white/30"}`}>
                {l.done ? `+${l.xp} XP ✓` : `+${l.xp} XP`}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      {nextLesson && (
        <div className="px-4 pb-4">
          <button
            onClick={() => goLesson(nextLesson.id)}
            className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-black py-3 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] text-sm">
            Продовжити: {nextLesson.title} ▶
          </button>
        </div>
      )}
    </div>
  );
}

function StatWidget({ icon, value, label, sub, color }: {
  icon: string; value: string | number; label: string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-xl flex-shrink-0`}>{icon}</div>
      <div>
        <div className="text-white font-black text-xl leading-none">{value}</div>
        <div className="text-white/50 text-xs mt-0.5">{label}</div>
        {sub && <div className="text-white/30 text-[10px]">{sub}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const validTabs: Tab[] = ["learn", "practice", "leaderboard", "profile"];

  const tabFromPath = (): Tab => {
    if (typeof window === "undefined") return "learn";
    const seg = window.location.pathname.replace("/", "") as Tab;
    return validTabs.includes(seg) ? seg : "learn";
  };

  const [tab, setTab] = useState<Tab>(tabFromPath);

  // Handle browser back/forward without reload
  useEffect(() => {
    function onPop() { setTab(tabFromPath()); }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function switchTab(t: Tab) {
    const url = t === "learn" ? "/" : `/${t}`;
    history.pushState(null, "", url);
    setTab(t);
    // Reset scroll position on all main containers
    document.querySelectorAll("main").forEach(el => { el.scrollTop = 0; });
    if (t === "leaderboard" && leaderboard.length === 0) {
      setLeaderboardLoading(true);
      getLeaderboard().then(d => { setLeaderboard(d); setLeaderboardLoading(false); });
    }
  }

  // Load leaderboard if landing directly on /leaderboard
  useEffect(() => {
    if (tab === "leaderboard") {
      setLeaderboardLoading(true);
      getLeaderboard().then(d => { setLeaderboard(d); setLeaderboardLoading(false); });
    }
  }, []);
  const [mounted, setMounted] = useState(false);
  const [units, setUnits] = useState<ReturnType<typeof mapUnitToCard>[]>([]);
  const [rawUnits, setRawUnits] = useState<ApiUnit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  // mounted is set after auth check

  // Restore session on mount
  useEffect(() => {
    // Check if just came from login page
    const stored = sessionStorage.getItem("ilearn_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
      sessionStorage.removeItem("ilearn_user");
    }
    getMe().then(u => {
      if (u) {
        setUser(u);
        getUserStats().then(s => setStats(s));
        setMounted(true);
      } else {
        // Not logged in — redirect to login
        sessionStorage.setItem("login_redirect", window.location.pathname);
        window.location.href = "/login";
      }
    });
  }, []);

  async function handleGoogleLogin(credential: string) {
    setAuthLoading(true);
    try {
      const data = await loginWithGoogle(credential);
      setToken(data.token);
      setUser({ name: data.name, email: data.email, picture: data.picture });
      getUserStats().then(s => setStats(s));
    } catch { /* ignore */ } finally { setAuthLoading(false); }
  }

  function logout() { clearToken(); window.location.href = "/login"; }

  // Fetch units + their lessons from API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadingUnits(true);
        const list = await getUnits();
        // Fetch full unit data (with lessons) in parallel
        const full = await Promise.all(list.map(u => getUnitWithLessons(u.id)));
        if (!cancelled) {
          setRawUnits(full);
          setUnits(full.map(mapUnitToCard));
        }
      } catch (err) {
        console.error("Failed to load units:", err);
      } finally {
        if (!cancelled) setLoadingUnits(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const streak    = stats?.streak        ?? 0;
  const totalXp   = stats?.totalXp       ?? 0;
  const level     = stats?.level         ?? 1;
  const nextLvlXp = stats?.nextLevelXp   ?? 100;
  const dailyXp   = stats?.currentLevelXp ?? 0;
  const dailyGoal = stats?.nextLevelXp   ?? 100;

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "learn",       icon: "🏠", label: "Вчити"    },
    { id: "practice",    icon: "⚔️", label: "Практика" },
    { id: "leaderboard", icon: "🏆", label: "Рейтинг"    },
    { id: "profile",     icon: "👤", label: "Профіль"  },
  ];

  // Show loading spinner while checking auth
  if (!mounted) return (
    <div className="min-h-screen bg-[#0d0d1f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl animate-bounce">🦉</div>
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d1f] text-white">

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-900/25 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-900/20 rounded-full blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-900/15 rounded-full blur-[100px]" />
      </div>

      {/* ── DESKTOP LAYOUT (md+) ─────────────────────────────────────────── */}
      <div className="hidden md:flex min-h-screen">

        {/* Left sidebar nav */}
        <aside className="w-56 xl:w-64 flex-shrink-0 sticky top-0 h-screen flex flex-col border-r border-white/5 bg-[#0b0b1a]/80 backdrop-blur-xl z-40">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <Owl size={32} />
              <span className="font-black text-xl">iLearn</span>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(n => (
              <button key={n.id} onClick={() => switchTab(n.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left
                  ${tab === n.id
                    ? "bg-green-500/20 text-green-300 border border-green-500/25"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}>
                <span className="text-xl">{n.icon}</span>
                <span>{n.label}</span>
                {tab === n.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />}
              </button>
            ))}
          </nav>

          {/* User mini profile */}
          <div className="p-3 border-t border-white/5">
            {user ? (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/5">
                <img src={user.picture} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-bold truncate">{user.name}</div>
                  <button onClick={logout} className="text-white/30 text-[10px] hover:text-red-400 transition-colors">Вийти</button>
                </div>
                <div className="text-orange-400 text-xs font-black">{streak}🔥</div>
              </div>
            ) : (
              <div className="px-2">
                <div className="text-white/30 text-[10px] mb-2 text-center">Увійди щоб зберігати прогрес</div>
                <GoogleLogin
                  onSuccess={r => r.credential && handleGoogleLogin(r.credential)}
                  onError={() => {}}
                  theme="filled_black"
                  shape="pill"
                  size="medium"
                  text="signin_with"
                />
              </div>
            )}
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0d0d1f]/90 backdrop-blur-xl px-6 h-14 flex items-center justify-between">
            <div>
              <h1 className="text-white font-black text-lg capitalize">{tab}</h1>
            </div>
            <div className="flex items-center gap-2">
              {[
                { icon: "🔥", val: streak,   color: "bg-orange-500/15 border-orange-500/20 text-orange-400" },
                { icon: "⭐", val: dailyXp,  color: "bg-yellow-500/15 border-yellow-500/20 text-yellow-400" },
                { icon: "💎", val: 520,       color: "bg-blue-500/15 border-blue-500/20 text-blue-400"       },
                { icon: "❤️", val: 5,         color: "bg-rose-500/15 border-rose-500/20 text-rose-400"       },
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-1 border rounded-full px-2.5 py-1 ${s.color}`}>
                  <span className="text-sm">{s.icon}</span>
                  <span className={`text-xs font-black`}>{s.val}</span>
                </div>
              ))}
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-scroll" style={{ scrollbarGutter: "stable" }}>
            <div className="max-w-6xl mx-auto px-6 py-6">

              {/* ── LEARN ───────────────────────────────────────────── */}
              {tab === "learn" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                  {/* Units */}
                  <div className="xl:col-span-2 space-y-5">
                    {/* Hero */}
                    <div className="bg-gradient-to-r from-green-600/40 to-emerald-600/30 border border-green-500/25 rounded-3xl p-6 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-white/60 text-sm">Привіт, Андрій 👋</div>
                        <div className="text-white text-2xl font-black mt-0.5">Тримай серію!</div>
                        <div className="text-white/40 text-sm mt-1">
                          <span className="text-yellow-400 font-bold">{dailyGoal - dailyXp} XP</span> до денної цілі
                        </div>
                      </div>
                      <button className="flex-shrink-0 bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black px-7 py-3.5 rounded-2xl shadow-[0_0_24px_rgba(34,197,94,0.4)] transition-all">
                        Продовжити ▶
                      </button>
                    </div>

                    {loadingUnits
                      ? [1, 2, 3].map(i => (
                          <div key={i} className="rounded-3xl border border-white/10 overflow-hidden animate-pulse">
                            <div className="h-36 bg-white/5" />
                            <div className="p-4 space-y-2">
                              {[1, 2, 3].map(j => <div key={j} className="h-12 bg-white/5 rounded-xl" />)}
                            </div>
                          </div>
                        ))
                      : units.map(u => <UnitCard key={u.unit} {...u} />)
                    }
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    {/* Daily goal */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                      <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3">Денна ціль</div>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <ProgressRing pct={dailyXp / dailyGoal} size={72} stroke={7} color="#a855f7" />
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
                            {Math.round((dailyXp / dailyGoal) * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-white text-2xl font-black">{dailyXp} <span className="text-white/30 text-base font-medium">/ {dailyGoal}</span></div>
                          <div className="text-white/40 text-xs">XP сьогодні</div>
                          <div className="text-white/30 text-xs mt-0.5">{dailyGoal - dailyXp} XP залишилось</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <StatWidget icon="🔥" value={streak}                         label="Серія днів"     sub={streak > 0 ? "Так тримати!" : "Почни сьогодні"} color="bg-orange-500/20" />
                      <StatWidget icon="⭐" value={totalXp}                        label="Всього XP"      sub={`Lvl ${level} → ${level+1}`} color="bg-yellow-500/20" />
                      <StatWidget icon="📚" value={stats?.completedLessons ?? 0}   label="Уроків пройдено" sub={user ? "Твій прогрес" : "Увійди для статистики"} color="bg-green-500/20" />
                      <StatWidget icon="🏆" value={stats ? `#${stats.rank}` : "—"} label="Рейтинг"        sub={user ? "Серед гравців" : "Увійди для рейтингу"} color="bg-purple-500/20" />
                    </div>

                    {/* Level */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-black">Рівень {level} ⭐</div>
                        <div className="text-white/30 text-xs">{totalXp}/{nextLvlXp} XP</div>
                      </div>
                      <XpBar current={totalXp} max={nextLvlXp} />
                      <div className="text-white/30 text-xs mt-1.5">{nextLvlXp - totalXp} XP до Рівня {level+1}</div>
                    </div>

                    {/* Leaderboard mini */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-white font-bold text-sm">Рейтинг</div>
                        <button onClick={() => switchTab("leaderboard")} className="text-purple-400 text-xs hover:text-purple-300">Всі →</button>
                      </div>
                      <div className="space-y-1">
                        {leaderboard.length === 0 ? (
                          <div className="text-white/30 text-xs text-center py-3">Ще немає гравців</div>
                        ) : leaderboard.slice(0, 5).map((r, i) => (
                          <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${r.isYou ? "bg-purple-500/15 border border-purple-500/20" : "hover:bg-white/5"}`}>
                            <div className="w-5 text-center text-xs">
                              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="text-white/30 font-bold">{i+1}</span>}
                            </div>
                            {r.picture
                              ? <img src={r.picture} alt="" className="w-6 h-6 rounded-full object-cover" />
                              : <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] font-black">{r.name[0]}</div>
                            }
                            <div className="flex-1 text-xs font-semibold truncate">
                              {r.name} {r.isYou && <span className="text-purple-400">(ти)</span>}
                            </div>
                            <div className="text-white/30 text-[10px]">{r.xp.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                      <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">💡 Порада дня</div>
                      <div className="text-white/60 text-xs leading-relaxed">10 хвилин щодня краще ніж 2 години раз на тиждень. Регулярність — все!</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRACTICE ─────────────────────────────────────────── */}
              {tab === "practice" && (
                <div className="max-w-3xl mx-auto">
                  <div className="mb-6">
                    <div className="text-2xl font-black">Режим практики ⚔️</div>
                    <div className="text-white/40 mt-1">Вдосконалюй навички будь-коли</div>
                  </div>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                      { icon: "🗣️", title: "Мовлення",    desc: "ІІ зворотній зв'язок",   color: "from-violet-600/30 to-violet-800/20", border: "border-violet-500/20", xp: 15 },
                      { icon: "👂", title: "Аудіювання",   desc: "Тренуйся з носіями",      color: "from-blue-600/30 to-blue-800/20",   border: "border-blue-500/20",   xp: 10 },
                      { icon: "✍️", title: "Письмо",     desc: "Будуй речення з пам'яті",  color: "from-emerald-600/30 to-emerald-800/20", border: "border-emerald-500/20", xp: 12 },
                      { icon: "🃏", title: "Флеш-картки",  desc: "Інтервальне повторення",      color: "from-rose-600/30 to-rose-800/20",   border: "border-rose-500/20",   xp:  8 },
                      { icon: "⚡", title: "Швидкий раунд", desc: "20 питань за 60 секунд",     color: "from-yellow-600/30 to-yellow-800/20", border: "border-yellow-500/20", xp: 20 },
                      { icon: "🤖", title: "ІІ Чат",     desc: "Чат з ІІ партнером",         color: "from-cyan-600/30 to-cyan-800/20",   border: "border-cyan-500/20",   xp: 25 },
                    ].map((m, i) => (
                      <button key={i} className={`flex flex-col gap-4 p-5 rounded-2xl bg-gradient-to-br ${m.color} border ${m.border} hover:brightness-110 active:scale-[0.98] transition-all text-left`}>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">{m.icon}</div>
                        <div>
                          <div className="text-white font-black">{m.title}</div>
                          <div className="text-white/50 text-sm mt-0.5">{m.desc}</div>
                        </div>
                        <div className="mt-auto">
                          <span className="text-yellow-400 font-black text-sm">+{m.xp} XP</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── LEADERBOARD ───────────────────────────────────────── */}
              {tab === "leaderboard" && (
                <div className="max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="text-2xl font-black">Рейтинг гравців 🏆</div>
                    <div className="text-white/40 mt-1">Загальний рейтинг · Топ-3 отримують бонус 💎</div>
                  </div>

                  {leaderboardLoading ? (
                    <div className="flex justify-center py-20">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="text-center py-20 text-white/30">
                      <div className="text-4xl mb-3">🏆</div>
                      <div>Ще немає гравців у рейтингу</div>
                      <div className="text-sm mt-1">Пройди перший урок щоб потрапити сюди!</div>
                    </div>
                  ) : (
                    <>
                      {/* Podium — top 3 */}
                      {leaderboard.length >= 3 && (
                        <div className="flex items-end justify-center gap-4 mb-6">
                          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((r, i) => {
                            const h = ["h-24","h-32","h-20"];
                            const c = ["bg-gray-500/20 border-gray-400/20","bg-yellow-500/20 border-yellow-400/30","bg-orange-500/15 border-orange-400/20"];
                            const m = ["🥈","🥇","🥉"];
                            return (
                              <div key={i} className={`flex-1 flex flex-col items-center gap-2 ${h[i]} rounded-2xl border ${c[i]} justify-end pb-4 ${r.isYou ? "ring-2 ring-purple-400/40" : ""}`}>
                                <span className="text-2xl">{m[i]}</span>
                                {r.picture
                                  ? <img src={r.picture} alt="" className="w-10 h-10 rounded-full object-cover" />
                                  : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold">{r.name[0]}</div>
                                }
                                <div className="text-white text-xs font-bold text-center px-1 truncate w-full text-center">{r.name.split(" ")[0]}</div>
                                <div className="text-white/40 text-xs">{r.xp.toLocaleString()} XP</div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Full list */}
                      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                        {leaderboard.map((r, i) => (
                          <div key={i} className={`flex items-center gap-3 px-5 py-3.5 border-b border-white/5 last:border-0 transition-all
                            ${r.isYou ? "bg-purple-500/15" : "hover:bg-white/5"}`}>
                            <div className="w-6 text-center">{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span className="text-white/30 text-sm font-bold">{i+1}</span>}</div>
                            {r.picture
                              ? <img src={r.picture} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                              : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold flex-shrink-0">{r.name[0]}</div>
                            }
                            <div className="flex-1 min-w-0">
                              <div className={`font-semibold text-sm truncate ${r.isYou ? "text-purple-300" : "text-white"}`}>
                                {r.name} {r.isYou && <span className="text-xs bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded-full ml-1">ти</span>}
                              </div>
                              <div className="text-white/30 text-xs">{r.completedLessons} уроків · {r.xp.toLocaleString()} XP</div>
                            </div>
                            <div className="w-24 hidden sm:block">
                              <XpBar current={r.xp} max={Math.max(...leaderboard.map(x => x.xp), 1)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── PROFILE ───────────────────────────────────────────── */}
              {tab === "profile" && (
                <div className="max-w-2xl mx-auto space-y-5">
                  <div className="bg-gradient-to-br from-purple-600/30 to-indigo-600/20 border border-purple-500/25 rounded-3xl p-6 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-black flex-shrink-0 shadow-[0_0_30px_rgba(139,92,246,0.5)]">A</div>
                    <div>
                      <div className="text-white text-2xl font-black">Andriy</div>
                      <div className="text-white/40 text-sm">Приєднався у березні 2026</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">🇺🇦 Українська</span>
                        <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">🇬🇧 Англійська</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { icon:"🔥", val: streak,  label:"Серія",  color:"text-orange-400" },
                      { icon:"⭐", val: totalXp, label:"Всього XP", color:"text-yellow-400" },
                      { icon:"📚", val: 12,       label:"Уроки", color:"text-green-400"  },
                      { icon:"🏆", val: "#4",     label:"Місце",    color:"text-purple-400" },
                    ].map((s,i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-1">
                        <span className="text-2xl">{s.icon}</span>
                        <span className={`text-xl font-black ${s.color}`}>{s.val}</span>
                        <span className="text-white/40 text-xs">{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-black">Рівень {level} ⭐</div>
                      <div className="text-white/30 text-xs">{totalXp}/{nextLvlXp} XP</div>
                    </div>
                    <XpBar current={totalXp} max={nextLvlXp} />
                    <div className="text-white/30 text-xs mt-1.5">{nextLvlXp - totalXp} XP до Рівня {level+1}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                    <h3 className="text-white font-bold mb-4">Досягнення</h3>
                    <div className="grid grid-cols-6 gap-3">
                      {[
                        { icon:"🔥", name:"У вогні",      desc:"Серія 7 днів",      unlocked:true  },
                        { icon:"⚡", name:"Швидкий старт",  desc:"Перший урок пройдено", unlocked:true  },
                        { icon:"🌙", name:"Нічна сова",    desc:"Вчись після 22:00",  unlocked:true  },
                        { icon:"💎", name:"Збирач самоцвітів",desc:"Зароби 500 самоцвітів",     unlocked:false },
                        { icon:"🏆", name:"Чемпіон",     desc:"Топ-3 рейтингу", unlocked:false },
                        { icon:"🎯", name:"Влучний стрілець",        desc:"100% точність",     unlocked:false },
                      ].map((a,i) => (
                        <div key={i} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center ${a.unlocked ? "bg-yellow-500/10 border-yellow-500/25" : "bg-white/3 border-white/5 opacity-40"}`}>
                          <div className={`text-2xl ${!a.unlocked?"grayscale":""}`}>{a.icon}</div>
                          <div className={`text-[10px] font-bold ${a.unlocked?"text-yellow-300":"text-white/30"}`}>{a.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (< md) ──────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col min-h-screen">

        {/* Mobile header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d0d1f]/95 backdrop-blur-xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Owl size={24} />
            <span className="font-black text-base">iLearn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/20 rounded-full px-2 py-0.5">
              <span className="text-sm">🔥</span><span className="text-orange-400 text-xs font-black">{streak}</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/15 border border-yellow-500/20 rounded-full px-2 py-0.5">
              <span className="text-sm">⭐</span><span className="text-yellow-400 text-xs font-black">{dailyXp}</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-500/15 border border-blue-500/20 rounded-full px-2 py-0.5">
              <span className="text-sm">💎</span><span className="text-blue-400 text-xs font-black">520</span>
            </div>
          </div>
        </header>

        {/* Mobile content */}
        <main className="flex-1 overflow-y-scroll pb-24" style={{ scrollbarGutter: "stable" }}>

          {/* LEARN — map */}
          {tab === "learn" && (
            <div className="px-4 py-4 space-y-4">
              {/* Continue banner */}
              <div className="flex items-center justify-between gap-3 bg-green-500/15 border border-green-500/25 rounded-2xl px-4 py-3">
                <div>
                  <div className="text-white font-black text-sm">Познайомся 🗣️</div>
                  <div className="text-white/40 text-xs">{dailyGoal - dailyXp} XP залишилось сьогодні</div>
                </div>
                <button className="bg-green-500 text-white font-black px-4 py-2 rounded-xl text-sm shadow-[0_0_16px_rgba(34,197,94,0.4)] active:scale-95 transition-all whitespace-nowrap">
                  Вперед ▶
                </button>
              </div>

              {/* Daily progress */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="relative">
                  <ProgressRing pct={dailyXp / dailyGoal} size={44} stroke={5} color="#a855f7" />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                    {Math.round((dailyXp / dailyGoal) * 100)}%
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-bold">Денна ціль: {dailyXp}/{dailyGoal} XP</div>
                  <XpBar current={dailyXp} max={dailyGoal} color="from-purple-500 to-violet-400" />
                </div>
              </div>

              {/* The map */}
              <MobileMap units={rawUnits} />
            </div>
          )}

          {/* PRACTICE */}
          {tab === "practice" && (
            <div className="px-4 py-4 space-y-3">
              <div className="text-xl font-black pt-2 pb-1">Практика ⚔️</div>
              {[
                { icon:"🗣️", title:"Мовлення",    desc:"ІІ фідбек",       color:"from-violet-600/30 to-violet-800/20", border:"border-violet-500/20", xp:15 },
                { icon:"👂", title:"Аудіювання",   desc:"Аудіо з носіями",      color:"from-blue-600/30 to-blue-800/20",   border:"border-blue-500/20",   xp:10 },
                { icon:"✍️", title:"Письмо",     desc:"Речення з пам'яті", color:"from-emerald-600/30 to-emerald-800/20", border:"border-emerald-500/20", xp:12 },
                { icon:"🃏", title:"Флеш-картки",  desc:"Інтервальне повторення", color:"from-rose-600/30 to-rose-800/20",   border:"border-rose-500/20",   xp: 8 },
                { icon:"⚡", title:"Швидкий раунд", desc:"60 секунд",        color:"from-yellow-600/30 to-yellow-800/20", border:"border-yellow-500/20", xp:20 },
                { icon:"🤖", title:"ІІ Чат",     desc:"Розмова з ІІ",   color:"from-cyan-600/30 to-cyan-800/20",   border:"border-cyan-500/20",   xp:25 },
              ].map((m,i) => (
                <button key={i} className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${m.color} border ${m.border} active:scale-[0.98] transition-all text-left`}>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">{m.icon}</div>
                  <div className="flex-1">
                    <div className="text-white font-black text-sm">{m.title}</div>
                    <div className="text-white/50 text-xs">{m.desc}</div>
                  </div>
                  <div className="text-yellow-400 font-black text-sm flex-shrink-0">+{m.xp}</div>
                </button>
              ))}
            </div>
          )}

          {/* LEADERBOARD */}
          {tab === "leaderboard" && (
            <div className="px-4 py-4 space-y-3">
              <div className="text-xl font-black pt-2 pb-1">Рейтинг 🏆</div>
              {leaderboardLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-7 h-7 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  <div className="text-4xl mb-3">🏆</div>
                  <div className="text-sm">Ще немає гравців</div>
                  <div className="text-xs mt-1">Пройди урок щоб потрапити сюди!</div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                  {leaderboard.map((r,i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 ${r.isYou?"bg-purple-500/15":""}`}>
                      <div className="w-6 text-center text-sm">{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span className="text-white/30 font-bold text-xs">{i+1}</span>}</div>
                      {r.picture
                        ? <img src={r.picture} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{r.name[0]}</div>
                      }
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold truncate ${r.isYou?"text-purple-300":"text-white"}`}>
                          {r.name} {r.isYou&&<span className="text-[10px] text-purple-400">(ти)</span>}
                        </div>
                        <div className="text-white/30 text-xs">{r.completedLessons} уроків · {r.xp.toLocaleString()} XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="px-4 py-4 space-y-4">
              {!user ? (
                <div className="bg-gradient-to-br from-purple-600/30 to-indigo-600/20 border border-purple-500/25 rounded-3xl p-8 text-center space-y-4">
                  <div className="text-4xl">👤</div>
                  <div className="text-white font-black text-lg">Увійди в акаунт</div>
                  <div className="text-white/40 text-sm">Зберігай прогрес і змагайся з іншими</div>
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={r => r.credential && handleGoogleLogin(r.credential)}
                      onError={() => {}}
                      theme="filled_black"
                      shape="pill"
                        />
                  </div>
                </div>
              ) : (
              <div className="bg-gradient-to-br from-purple-600/30 to-indigo-600/20 border border-purple-500/25 rounded-3xl p-5 text-center">
                <img src={user.picture} alt="" className="w-16 h-16 rounded-full object-cover mx-auto" />
                <div className="text-white text-lg font-black mt-2">{user.name}</div>
                <div className="text-white/40 text-xs">{user.email}</div>
                <button onClick={logout} className="mt-3 text-red-400/70 text-xs hover:text-red-400 transition-colors">Вийти з акаунту</button>
              </div>
              )}
              {user && (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon:"🔥", val: streak,                           label:"Серія",  color:"text-orange-400" },
                      { icon:"⭐", val: totalXp,                          label:"XP",     color:"text-yellow-400" },
                      { icon:"📚", val: stats?.completedLessons ?? 0,     label:"Уроки",  color:"text-green-400"  },
                      { icon:"🏆", val: stats ? `#${stats.rank}` : "—",   label:"Місце",  color:"text-purple-400" },
                    ].map((s,i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1">
                        <span className="text-lg">{s.icon}</span>
                        <span className={`text-base font-black ${s.color}`}>{s.val}</span>
                        <span className="text-white/40 text-[10px]">{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white font-bold">Рівень {level}</span>
                      <span className="text-white/30">{dailyXp}/{nextLvlXp} XP</span>
                    </div>
                    <XpBar current={dailyXp} max={nextLvlXp} />
                    <div className="text-white/30 text-[10px] mt-1">{nextLvlXp - dailyXp} XP до Рівня {level + 1}</div>
                  </div>
                </>
              )}
            </div>
          )}

        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0d0d1f]/95 backdrop-blur-xl">
          <div className="flex items-center justify-around px-2 pt-2 pb-6">
            {navItems.map(n => (
              <button key={n.id} onClick={() => switchTab(n.id)}
                className="flex flex-col items-center gap-1 px-3 py-1 transition-all active:scale-90">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all
                  ${tab === n.id ? "bg-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.3)]" : ""}`}>
                  {n.icon}
                </div>
                <span className={`text-[10px] font-semibold ${tab === n.id ? "text-green-400" : "text-white/30"}`}>{n.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
