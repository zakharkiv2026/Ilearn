"use client";

import { useState, useEffect } from "react";

type Tab = "learn" | "practice" | "leaderboard" | "profile";

// ── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 64, stroke = 6, color = "#22c55e" }: {
  pct: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }} />
    </svg>
  );
}

function XpBar({ current, max }: { current: number; max: number }) {
  return (
    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000"
        style={{ width: `${Math.min((current / max) * 100, 100)}%` }} />
    </div>
  );
}

// ── Owl SVG ──────────────────────────────────────────────────────────────────
function Owl({ size = 80 }: { size?: number }) {
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
      <circle cx="50" cy="56" r="10" fill="white" />
      <circle cx="50" cy="56" r="7" fill="#2563EB" />
      <circle cx="50" cy="56" r="3" fill="#1E3A8A" />
      <circle cx="47" cy="53" r="1.5" fill="white" />
      <circle cx="70" cy="56" r="10" fill="white" />
      <circle cx="70" cy="56" r="7" fill="#2563EB" />
      <circle cx="70" cy="56" r="3" fill="#1E3A8A" />
      <circle cx="67" cy="53" r="1.5" fill="white" />
      <polygon points="60,65 54,72 66,72" fill="#F59E0B" />
    </svg>
  );
}

// ── Map Node ─────────────────────────────────────────────────────────────────
type NodeStatus = "done" | "active" | "locked";

function MapNode({
  status, icon, label, x, isOwl = false,
}: {
  status: NodeStatus; icon: string; label: string; x: string; isOwl?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex flex-col items-center" style={{ marginLeft: x }}>

      {/* Tooltip */}
      {showTooltip && status !== "locked" && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap z-50">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
        </div>
      )}

      {/* Node button */}
      <button
        disabled={status === "locked"}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={`relative transition-all active:scale-90 ${status === "locked" ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
      >
        {/* Pulse rings for active */}
        {status === "active" && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping scale-150" />
            <div className="absolute inset-0 rounded-full border-4 border-green-400/40 scale-125" />
          </>
        )}

        {/* Main circle */}
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center text-2xl relative z-10
          shadow-[0_6px_0px_rgba(0,0,0,0.3)]
          ${status === "done"    ? "bg-green-500 shadow-[0_6px_0px_#15803d]" : ""}
          ${status === "active"  ? "bg-green-400 shadow-[0_6px_0px_#16a34a] ring-4 ring-white/30" : ""}
          ${status === "locked"  ? "bg-[#374151] shadow-[0_6px_0px_#1f2937]" : ""}
        `}>
          {status === "done"   && <span className="text-white text-2xl font-black">★</span>}
          {status === "active" && <span className="text-3xl">{icon}</span>}
          {status === "locked" && <span className="text-xl opacity-40">🔒</span>}
        </div>
      </button>

      {/* Stars below done nodes */}
      {status === "done" && (
        <div className="flex gap-0.5 mt-1.5">
          {[0,1,2].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}
        </div>
      )}

      {/* START label */}
      {status === "active" && !isOwl && (
        <div className="mt-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
          START
        </div>
      )}
    </div>
  );
}

// ── Section Banner ────────────────────────────────────────────────────────────
function SectionBanner({
  section, title, color, glow, icon,
}: {
  section: string; title: string; color: string; glow: string; icon: string;
}) {
  return (
    <div className={`w-full max-w-sm mx-auto rounded-2xl p-4 ${color} ${glow} border border-white/10 flex items-center justify-between`}>
      <div>
        <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{section}</div>
        <div className="text-white font-black text-base mt-0.5">{title}</div>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

// ── Chest (section reward) ───────────────────────────────────────────────────
function ChestNode({ locked }: { locked?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
        shadow-[0_6px_0px_rgba(0,0,0,0.3)] transition-all
        ${locked ? "bg-[#374151] opacity-40" : "bg-gradient-to-b from-yellow-400 to-orange-500 shadow-[0_6px_0px_#b45309] hover:scale-105 cursor-pointer"}
      `}>
        🎁
      </div>
      {!locked && <div className="text-yellow-400 text-[10px] font-bold">+50 gems</div>}
    </div>
  );
}

// ── The Duolingo-style Map ───────────────────────────────────────────────────
function LearningMap() {
  // Node definition: status, icon, label, xOffset from center
  // xOffset: negative = left, positive = right, 0 = center
  // The container is 320px wide, center = 160px

  type MapItem =
    | { type: "banner"; section: string; title: string; color: string; glow: string; icon: string }
    | { type: "node"; status: NodeStatus; icon: string; label: string; col: number; isOwl?: boolean }
    | { type: "chest"; locked?: boolean };

  const mapItems: MapItem[] = [
    { type: "banner", section: "Section 1, Unit 1", title: "Form basic sentences", color: "bg-green-700/80", glow: "shadow-[0_4px_20px_rgba(34,197,94,0.3)]", icon: "📝" },
    { type: "node", status: "done",   icon: "📝", label: "Basic greetings",     col: 2, isOwl: false },
    { type: "node", status: "done",   icon: "👋", label: "Say hello & goodbye", col: 3, isOwl: false },
    { type: "node", status: "active", icon: "🗣️", label: "Introduce yourself",  col: 2, isOwl: true  },
    { type: "node", status: "locked", icon: "❓", label: "Ask simple questions", col: 1, isOwl: false },
    { type: "node", status: "locked", icon: "💬", label: "Answer about yourself", col: 0, isOwl: false },
    { type: "chest", locked: false },

    { type: "banner", section: "Section 1, Unit 2", title: "Numbers & time", color: "bg-blue-700/80", glow: "shadow-[0_4px_20px_rgba(59,130,246,0.3)]", icon: "🔢" },
    { type: "node", status: "locked", icon: "🔢", label: "Numbers 1–10",   col: 2, isOwl: false },
    { type: "node", status: "locked", icon: "⏰", label: "Tell the time",   col: 3, isOwl: false },
    { type: "node", status: "locked", icon: "📅", label: "Dates & calendar", col: 2, isOwl: false },
    { type: "node", status: "locked", icon: "🔢", label: "Count objects",   col: 1, isOwl: false },
    { type: "chest", locked: true },

    { type: "banner", section: "Section 2, Unit 1", title: "Food & daily life", color: "bg-rose-700/80", glow: "shadow-[0_4px_20px_rgba(244,63,94,0.3)]", icon: "🍎" },
    { type: "node", status: "locked", icon: "🍎", label: "Food & drinks",        col: 2, isOwl: false },
    { type: "node", status: "locked", icon: "🍽️", label: "Order at a restaurant", col: 3, isOwl: false },
    { type: "node", status: "locked", icon: "🥗", label: "Express preferences",   col: 2, isOwl: false },
    { type: "node", status: "locked", icon: "🛒", label: "Shopping vocabulary",   col: 1, isOwl: false },
    { type: "chest", locked: true },
  ];

  // Column → left offset mapping (5 columns: 0=far-left, 1=left, 2=center, 3=right, 4=far-right)
  const colToOffset: Record<number, string> = {
    0: "40px",
    1: "80px",
    2: "128px",
    3: "176px",
    4: "216px",
  };

  // Build SVG path connecting node centers
  // We'll compute approximate path based on node sequence
  const nodeItems = mapItems.filter(i => i.type === "node") as Extract<MapItem, { type: "node" }>[];
  const colToCx: Record<number, number> = { 0: 72, 1: 112, 2: 160, 3: 208, 4: 248 };

  // We need to figure out vertical positions. Each group of items between banners takes space.
  // Let's just draw a winding path by connecting node cx values
  // We'll estimate y positions:
  // banners take 80px, nodes take 100px, chests take 80px
  let pathPoints: [number, number][] = [];
  let y = 90; // start below first banner
  for (const item of mapItems) {
    if (item.type === "banner") { y += 80; }
    else if (item.type === "node") {
      const n = item as Extract<MapItem, { type: "node" }>;
      pathPoints.push([colToCx[n.col], y]);
      y += 100;
    } else if (item.type === "chest") {
      y += 80;
    }
  }

  // Build smooth SVG path through points
  function buildPath(pts: [number, number][]) {
    if (pts.length < 2) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1];
      const [x2, y2] = pts[i];
      const cy = (y1 + y2) / 2;
      d += ` C${x1},${cy} ${x2},${cy} ${x2},${y2}`;
    }
    return d;
  }

  const pathD = buildPath(pathPoints);
  const totalH = y + 40;

  return (
    <div className="relative w-full max-w-xs mx-auto" style={{ minHeight: totalH }}>
      {/* SVG path behind everything */}
      <svg
        className="absolute inset-0 w-full pointer-events-none"
        style={{ height: totalH }}
        viewBox={`0 0 320 ${totalH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="pathglow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Shadow path */}
        <path d={pathD} stroke="#052e16" strokeWidth="20" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Main green path */}
        <path d={pathD} stroke="#16a34a" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#pathglow)" />
        {/* Light green highlight */}
        <path d={pathD} stroke="#4ade80" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        {/* Dashes */}
        <path d={pathD} stroke="#bbf7d0" strokeWidth="3" fill="none" strokeLinecap="round"
          strokeDasharray="1 20" opacity="0.6" />
      </svg>

      {/* Items */}
      <div className="relative flex flex-col items-stretch gap-0 pt-4">
        {mapItems.map((item, i) => {
          if (item.type === "banner") {
            return (
              <div key={i} className="py-4 px-2">
                <SectionBanner {...item} />
              </div>
            );
          }
          if (item.type === "node") {
            return (
              <div key={i} className="py-4 flex" style={{ paddingLeft: colToOffset[item.col] }}>
                <MapNode
                  status={item.status}
                  icon={item.icon}
                  label={item.label}
                  x={colToOffset[item.col]}
                  isOwl={item.isOwl}
                />
              </div>
            );
          }
          if (item.type === "chest") {
            return (
              <div key={i} className="py-4 flex justify-center">
                <ChestNode locked={item.locked} />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

// ── Sidebar Widgets ───────────────────────────────────────────────────────────
function StreakCard({ streak }: { streak: number }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date().getDay();
  const adj = today === 0 ? 6 : today - 1;
  return (
    <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl p-5 shadow-[0_8px_32px_rgba(249,115,22,0.35)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Current Streak</div>
          <div className="text-white text-3xl font-black mt-0.5">{streak} 🔥</div>
          <div className="text-orange-100/70 text-xs mt-0.5">days in a row</div>
        </div>
        <div className="text-5xl opacity-20">🔥</div>
      </div>
      <div className="flex gap-1">
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="text-orange-100/60 text-[9px] font-bold">{d}</div>
            <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${
              i < adj ? "bg-white/25 text-white" :
              i === adj ? "bg-white text-orange-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]" :
              "bg-white/10 text-white/20"
            }`}>
              {i <= adj ? "✓" : "·"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyGoalCard({ xp, goal }: { xp: number; goal: number }) {
  const pct = Math.min(xp / goal, 1);
  const done = pct >= 1;
  return (
    <div className={`rounded-3xl p-5 border ${done ? "bg-green-500/15 border-green-500/30" : "bg-white/5 border-white/10"}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Daily Goal</div>
          <div className="text-white text-2xl font-black mt-0.5">
            {xp} <span className="text-white/30 text-base font-medium">/ {goal} XP</span>
          </div>
          <div className={`text-xs mt-0.5 ${done ? "text-green-400 font-bold" : "text-white/40"}`}>
            {done ? "✓ Goal reached!" : `${goal - xp} XP to go`}
          </div>
        </div>
        <div className="relative ml-3">
          <ProgressRing pct={pct} size={64} stroke={7} color={done ? "#22c55e" : "#a855f7"} />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
            {Math.round(pct * 100)}%
          </div>
        </div>
      </div>
      <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-full transition-all duration-1000"
          style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}

function LeaderboardRow({ rank, name, xp, isYou }: { rank: number; name: string; xp: number; isYou?: boolean }) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-xl ${isYou ? "bg-purple-500/15 border border-purple-500/25" : "hover:bg-white/5"}`}>
      <div className="w-6 text-center text-sm">
        {medal ?? <span className="text-white/30 font-bold text-xs">{rank}</span>}
      </div>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
        {name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold truncate ${isYou ? "text-purple-300" : "text-white"}`}>{name}</div>
        <div className="text-white/30 text-[10px]">{xp.toLocaleString()} XP</div>
      </div>
    </div>
  );
}

function AchievementBadge({ icon, name, desc, unlocked }: { icon: string; name: string; desc: string; unlocked: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center ${
      unlocked ? "bg-yellow-500/10 border-yellow-500/25" : "bg-white/3 border-white/5 opacity-40"
    }`}>
      <div className={`text-2xl ${!unlocked ? "grayscale" : ""}`}>{icon}</div>
      <div className={`text-[10px] font-bold ${unlocked ? "text-yellow-300" : "text-white/30"}`}>{name}</div>
      <div className="text-white/30 text-[9px] leading-tight">{desc}</div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState<Tab>("learn");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const streak = 7;
  const dailyXp = 30;
  const dailyGoal = 50;
  const level = 4;
  const totalXp = 340;
  const nextLevelXp = 500;

  const leaderboard = [
    { name: "Sophia", xp: 4820 },
    { name: "Marcus", xp: 4210 },
    { name: "Yuki",   xp: 3950 },
    { name: "Andriy", xp: 3400, isYou: true },
    { name: "Pablo",  xp: 2980 },
    { name: "Emma",   xp: 2650 },
  ];

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "learn",       icon: "🏠", label: "Learn"    },
    { id: "practice",    icon: "⚔️", label: "Practice" },
    { id: "leaderboard", icon: "🏆", label: "Ranks"    },
    { id: "profile",     icon: "👤", label: "Profile"  },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0d0d1f] text-white">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-900/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-900/20 rounded-full blur-[100px]" />
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d0d1f]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Owl size={26} />
            <span className="font-black text-lg hidden sm:block">iLearn</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  tab === n.id ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                }`}>
                <span>{n.icon}</span><span>{n.label}</span>
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/20 rounded-full px-2.5 py-1">
              <span className="text-sm">🔥</span>
              <span className="text-orange-400 text-xs font-black">{streak}</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/15 border border-yellow-500/20 rounded-full px-2.5 py-1">
              <span className="text-sm">⭐</span>
              <span className="text-yellow-400 text-xs font-black">{dailyXp}</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-500/15 border border-blue-500/20 rounded-full px-2.5 py-1">
              <span className="text-sm">💎</span>
              <span className="text-blue-400 text-xs font-black">520</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 pb-28 md:pb-8">

        {/* ══ LEARN ══════════════════════════════════════════════════ */}
        {tab === "learn" && (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* MAP COLUMN */}
            <div className="flex-1 min-w-0">
              {/* Continue CTA */}
              <div className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                <div>
                  <div className="text-white/50 text-sm">Good day, Andriy 👋</div>
                  <div className="text-white font-black">Keep your streak alive!</div>
                </div>
                <button className="bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all text-sm whitespace-nowrap">
                  Continue ▶
                </button>
              </div>

              {/* Map scroll area */}
              <div className="overflow-y-auto">
                <LearningMap />
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
              <StreakCard streak={streak} />
              <DailyGoalCard xp={dailyXp} goal={dailyGoal} />

              {/* Level */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Level</div>
                    <div className="text-white text-2xl font-black">{level} <span className="text-yellow-400">⭐</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/30 text-xs">{totalXp} / {nextLevelXp} XP</div>
                    <div className="text-white/40 text-xs">to level {level + 1}</div>
                  </div>
                </div>
                <XpBar current={totalXp} max={nextLevelXp} />
              </div>

              {/* Leaderboard */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold text-sm">Leaderboard</h3>
                  <button onClick={() => setTab("leaderboard")} className="text-purple-400 text-xs hover:text-purple-300">See all →</button>
                </div>
                <div className="space-y-0.5">
                  {leaderboard.slice(0, 4).map((r, i) => <LeaderboardRow key={i} rank={i+1} {...r} />)}
                </div>
              </div>

              {/* Tip */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">💡 Tip of the day</div>
                <div className="text-white/60 text-xs leading-relaxed">
                  10 minutes daily beats 2 hours once a week. Consistency is everything!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ PRACTICE ═══════════════════════════════════════════════ */}
        {tab === "practice" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center py-4">
              <div className="text-2xl font-black">Practice Mode ⚔️</div>
              <div className="text-white/40 text-sm mt-1">Sharpen your skills anytime</div>
            </div>
            {[
              { icon: "🗣️", title: "Speaking",      desc: "Pronunciation with AI feedback",  color: "from-violet-600/30 to-violet-800/20", border: "border-violet-500/25", xp: 15 },
              { icon: "👂", title: "Listening",     desc: "Train your ear with native audio",  color: "from-blue-600/30 to-blue-800/20",   border: "border-blue-500/25",   xp: 10 },
              { icon: "✍️", title: "Writing",       desc: "Build sentences from memory",       color: "from-emerald-600/30 to-emerald-800/20", border: "border-emerald-500/25", xp: 12 },
              { icon: "🃏", title: "Flashcards",    desc: "Spaced repetition vocabulary",      color: "from-rose-600/30 to-rose-800/20",   border: "border-rose-500/25",   xp:  8 },
              { icon: "⚡", title: "Speed Round",   desc: "20 questions in 60 seconds",         color: "from-yellow-600/30 to-yellow-800/20", border: "border-yellow-500/25", xp: 20 },
              { icon: "🤖", title: "AI Chat",       desc: "Conversation with AI partner",       color: "from-cyan-600/30 to-cyan-800/20",   border: "border-cyan-500/25",   xp: 25 },
            ].map((m, i) => (
              <button key={i} className={`w-full flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r ${m.color} border ${m.border} hover:brightness-110 active:scale-[0.98] transition-all text-left`}>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">{m.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-black">{m.title}</div>
                  <div className="text-white/50 text-sm mt-0.5">{m.desc}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-yellow-400 font-black text-sm">+{m.xp}</div>
                  <div className="text-white/30 text-xs">XP</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ══ LEADERBOARD ════════════════════════════════════════════ */}
        {tab === "leaderboard" && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="text-center py-4">
              <div className="text-2xl font-black">Weekly Rankings 🏆</div>
              <div className="text-white/40 text-sm mt-1">Resets Monday · Top 3 get bonus 💎</div>
            </div>
            <div className="flex items-end justify-center gap-3 pb-2">
              {[leaderboard[1], leaderboard[0], leaderboard[2]].map((r, i) => {
                const h = ["h-20", "h-28", "h-16"];
                const c = ["bg-gray-500/20 border-gray-400/20", "bg-yellow-500/20 border-yellow-400/30", "bg-orange-500/15 border-orange-400/20"];
                const m = ["🥈","🥇","🥉"];
                return (
                  <div key={i} className={`flex-1 flex flex-col items-center gap-2 ${h[i]} rounded-2xl border ${c[i]} justify-end pb-3`}>
                    <div className="text-lg">{m[i]}</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold">{r.name[0]}</div>
                    <div className="text-white text-xs font-bold">{r.name}</div>
                    <div className="text-white/40 text-[10px]">{r.xp.toLocaleString()} XP</div>
                  </div>
                );
              })}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-1">
              {leaderboard.map((r, i) => (
                <LeaderboardRow key={i} rank={i+1} name={r.name} xp={r.xp} isYou={(r as any).isYou} />
              ))}
            </div>
          </div>
        )}

        {/* ══ PROFILE ════════════════════════════════════════════════ */}
        {tab === "profile" && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-gradient-to-br from-purple-600/30 to-indigo-600/20 border border-purple-500/30 rounded-3xl p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-black mx-auto shadow-[0_0_30px_rgba(139,92,246,0.5)]">A</div>
              <div className="text-white text-xl font-black mt-3">Andriy</div>
              <div className="text-white/40 text-sm">Joined March 2026</div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="bg-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">🇺🇦 Ukrainian</span>
                <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">🇬🇧 English</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: "🔥", val: streak,   label: "Streak",  color: "text-orange-400" },
                { icon: "⭐", val: totalXp,  label: "Total XP", color: "text-yellow-400" },
                { icon: "📚", val: 12,        label: "Lessons", color: "text-green-400" },
                { icon: "🏆", val: 4,         label: "Rank",    color: "text-purple-400" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1">
                  <span className="text-xl">{s.icon}</span>
                  <span className={`text-lg font-black ${s.color}`}>{s.val}</span>
                  <span className="text-white/40 text-[10px] text-center">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-white/50 text-[10px] uppercase tracking-widest">Level {level}</div>
                  <div className="text-white text-xl font-black">{totalXp} / {nextLevelXp} XP ⭐</div>
                </div>
              </div>
              <XpBar current={totalXp} max={nextLevelXp} />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <h3 className="text-white font-bold mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🔥", name: "On Fire",      desc: "7-day streak",      unlocked: true  },
                  { icon: "⚡", name: "Quick Start",  desc: "First lesson done", unlocked: true  },
                  { icon: "🌙", name: "Night Owl",    desc: "Learn after 10pm",  unlocked: true  },
                  { icon: "💎", name: "Gem Collector", desc: "Earn 500 gems",    unlocked: false },
                  { icon: "🏆", name: "Champion",     desc: "Top 3 leaderboard", unlocked: false },
                  { icon: "🎯", name: "Sharp Shooter", desc: "100% accuracy",    unlocked: false },
                ].map((a, i) => <AchievementBadge key={i} {...a} />)}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              {[
                { icon: "🎯", label: "Daily goal",  val: `${dailyGoal} XP` },
                { icon: "🔔", label: "Reminders",   val: "8:00 PM" },
                { icon: "🌍", label: "Language",    val: "English" },
              ].map((s, i) => (
                <button key={i} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span>{s.icon}</span>
                    <span className="text-white/70 text-sm">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-sm">{s.val}</span>
                    <span className="text-white/20">›</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile bottom nav ────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/5 bg-[#0d0d1f]/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2 pb-6">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className="flex flex-col items-center gap-1 px-3 py-1 transition-all active:scale-90">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all ${
                tab === n.id ? "bg-white/15 shadow-[0_0_12px_rgba(139,92,246,0.3)]" : ""
              }`}>{n.icon}</div>
              <span className={`text-[10px] font-semibold ${tab === n.id ? "text-white" : "text-white/30"}`}>{n.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
