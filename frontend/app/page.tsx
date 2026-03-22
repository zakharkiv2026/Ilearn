"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";

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
  status, icon, label, circleRef,
}: {
  status: NodeStatus; icon: string; label: string;
  circleRef?: React.RefCallback<HTMLDivElement>;
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
        <div className="mt-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">START</div>
      )}
    </div>
  );
}

function MobileMap() {
  type MapItem =
    | { type: "banner"; label: string; title: string; color: string; icon: string }
    | { type: "node";   status: NodeStatus; icon: string; label: string; col: number }
    | { type: "chest";  locked?: boolean };

  const items: MapItem[] = [
    { type: "banner", label: "Section 1 · Unit 1", title: "Form basic sentences", color: "bg-green-700/90", icon: "📝" },
    { type: "node", status: "done",   icon: "📝", label: "Basic greetings",       col: 2 },
    { type: "node", status: "done",   icon: "👋", label: "Say hello & goodbye",   col: 3 },
    { type: "node", status: "active", icon: "🗣️", label: "Introduce yourself",    col: 2 },
    { type: "node", status: "locked", icon: "❓", label: "Ask questions",          col: 1 },
    { type: "node", status: "locked", icon: "💬", label: "Answer about yourself",  col: 0 },
    { type: "chest", locked: false },
    { type: "banner", label: "Section 1 · Unit 2", title: "Numbers & time", color: "bg-blue-700/90", icon: "🔢" },
    { type: "node", status: "locked", icon: "🔢", label: "Numbers 1–10",     col: 2 },
    { type: "node", status: "locked", icon: "⏰", label: "Tell the time",     col: 3 },
    { type: "node", status: "locked", icon: "📅", label: "Dates & calendar",  col: 2 },
    { type: "node", status: "locked", icon: "🧮", label: "Count objects",     col: 1 },
    { type: "chest", locked: true },
    { type: "banner", label: "Section 2 · Unit 1", title: "Food & daily life", color: "bg-rose-700/90", icon: "🍎" },
    { type: "node", status: "locked", icon: "🍎", label: "Food & drinks",           col: 2 },
    { type: "node", status: "locked", icon: "🍽️", label: "Order at restaurant",     col: 3 },
    { type: "node", status: "locked", icon: "🛒", label: "Shopping vocabulary",     col: 2 },
    { type: "node", status: "locked", icon: "💳", label: "Paying & prices",         col: 1 },
    { type: "chest", locked: true },
  ];

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

function UnitCard({ unit, section, icon, color, border, glow, progress, lessons }: {
  unit: number; section: string; icon: string; color: string; border: string; glow: string;
  progress: number;
  lessons: { title: string; type: string; done?: boolean; locked?: boolean; active?: boolean }[];
}) {
  const nextLesson = lessons.find(l => !l.done && !l.locked);
  return (
    <div className={`rounded-3xl border ${border} overflow-hidden`}>
      {/* Header */}
      <div className={`${color} ${glow} p-5 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">{icon}</div>
          <div>
            <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{section}</div>
            <div className="text-white font-black text-base">Unit {unit}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/60 text-xs mb-1">{progress}% complete</div>
          <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/70 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Lessons grid */}
      <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-2">
        {lessons.map((l, i) => (
          <button key={i} disabled={l.locked}
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
                {l.done ? "+10 XP ✓" : "+10 XP"}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      {nextLesson && (
        <div className="px-4 pb-4">
          <button className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] text-white font-black py-3 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] text-sm">
            Continue: {nextLesson.title} ▶
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
  const [tab, setTab] = useState<Tab>("learn");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const streak   = 7;
  const dailyXp  = 30;
  const dailyGoal = 50;
  const level    = 4;
  const totalXp  = 340;
  const nextLvlXp = 500;

  const units = [
    {
      unit: 1, section: "Section 1", icon: "📝", progress: 40,
      color: "bg-gradient-to-r from-green-700/80 to-emerald-700/80",
      border: "border-green-500/25", glow: "shadow-[0_4px_24px_rgba(34,197,94,0.2)]",
      lessons: [
        { title: "Basic greetings",      type: "Vocabulary",   done: true  },
        { title: "Say hello & goodbye",  type: "Speaking",     done: true  },
        { title: "Introduce yourself",   type: "Conversation", active: true },
        { title: "Ask simple questions", type: "Grammar",      locked: true },
        { title: "Answer about yourself",type: "Listening",    locked: true },
      ],
    },
    {
      unit: 2, section: "Section 1", icon: "🔢", progress: 0,
      color: "bg-gradient-to-r from-blue-700/80 to-indigo-700/80",
      border: "border-blue-500/20", glow: "shadow-[0_4px_24px_rgba(59,130,246,0.15)]",
      lessons: [
        { title: "Numbers 1–10",  type: "Vocabulary", locked: true },
        { title: "Tell the time", type: "Conversation", locked: true },
        { title: "Dates & calendar", type: "Grammar", locked: true },
        { title: "Count objects", type: "Practice",   locked: true },
      ],
    },
    {
      unit: 3, section: "Section 2", icon: "🍎", progress: 0,
      color: "bg-gradient-to-r from-rose-700/80 to-pink-700/80",
      border: "border-rose-500/20", glow: "shadow-[0_4px_24px_rgba(244,63,94,0.15)]",
      lessons: [
        { title: "Food & drinks",       type: "Vocabulary",   locked: true },
        { title: "Order at restaurant", type: "Conversation", locked: true },
        { title: "Express preferences", type: "Speaking",     locked: true },
        { title: "Shopping vocab",      type: "Vocabulary",   locked: true },
      ],
    },
  ];

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
              <button key={n.id} onClick={() => setTab(n.id)}
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
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-black">A</div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-bold truncate">Andriy</div>
                <div className="text-white/30 text-[10px]">Level {level} · {totalXp} XP</div>
              </div>
              <div className="text-orange-400 text-xs font-black">{streak}🔥</div>
            </div>
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
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-6">

              {/* ── LEARN ───────────────────────────────────────────── */}
              {tab === "learn" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                  {/* Units */}
                  <div className="xl:col-span-2 space-y-5">
                    {/* Hero */}
                    <div className="bg-gradient-to-r from-green-600/40 to-emerald-600/30 border border-green-500/25 rounded-3xl p-6 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-white/60 text-sm">Good day, Andriy 👋</div>
                        <div className="text-white text-2xl font-black mt-0.5">Keep your streak alive!</div>
                        <div className="text-white/40 text-sm mt-1">
                          <span className="text-yellow-400 font-bold">{dailyGoal - dailyXp} XP</span> left for today&apos;s goal
                        </div>
                      </div>
                      <button className="flex-shrink-0 bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black px-7 py-3.5 rounded-2xl shadow-[0_0_24px_rgba(34,197,94,0.4)] transition-all">
                        Continue ▶
                      </button>
                    </div>

                    {units.map(u => <UnitCard key={u.unit} {...u} />)}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    {/* Daily goal */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                      <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3">Daily Goal</div>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <ProgressRing pct={dailyXp / dailyGoal} size={72} stroke={7} color="#a855f7" />
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
                            {Math.round((dailyXp / dailyGoal) * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-white text-2xl font-black">{dailyXp} <span className="text-white/30 text-base font-medium">/ {dailyGoal}</span></div>
                          <div className="text-white/40 text-xs">XP today</div>
                          <div className="text-white/30 text-xs mt-0.5">{dailyGoal - dailyXp} XP to go</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <StatWidget icon="🔥" value={streak}   label="Day streak"  sub="Personal best: 14" color="bg-orange-500/20" />
                      <StatWidget icon="⭐" value={totalXp}  label="Total XP"    sub={`Lvl ${level} → ${level+1}`} color="bg-yellow-500/20" />
                      <StatWidget icon="📚" value={12}        label="Lessons done" sub="This week: 5" color="bg-green-500/20" />
                      <StatWidget icon="🏆" value="#4"        label="Leaderboard" sub="Top 10%"      color="bg-purple-500/20" />
                    </div>

                    {/* Level */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-black">Level {level} ⭐</div>
                        <div className="text-white/30 text-xs">{totalXp}/{nextLvlXp} XP</div>
                      </div>
                      <XpBar current={totalXp} max={nextLvlXp} />
                      <div className="text-white/30 text-xs mt-1.5">{nextLvlXp - totalXp} XP to Level {level+1}</div>
                    </div>

                    {/* Leaderboard mini */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-white font-bold text-sm">Leaderboard</div>
                        <button onClick={() => setTab("leaderboard")} className="text-purple-400 text-xs hover:text-purple-300">See all →</button>
                      </div>
                      <div className="space-y-1">
                        {leaderboard.slice(0, 5).map((r, i) => (
                          <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${r.isYou ? "bg-purple-500/15 border border-purple-500/20" : "hover:bg-white/5"}`}>
                            <div className="w-5 text-center text-xs">
                              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="text-white/30 font-bold">{i+1}</span>}
                            </div>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] font-black">{r.name[0]}</div>
                            <div className="flex-1 text-xs font-semibold truncate">
                              {r.name} {r.isYou && <span className="text-purple-400">(you)</span>}
                            </div>
                            <div className="text-white/30 text-[10px]">{r.xp.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                      <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">💡 Tip</div>
                      <div className="text-white/60 text-xs leading-relaxed">10 min daily beats 2 hours once a week. Consistency is everything!</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRACTICE ─────────────────────────────────────────── */}
              {tab === "practice" && (
                <div className="max-w-3xl">
                  <div className="mb-6">
                    <div className="text-2xl font-black">Practice Mode ⚔️</div>
                    <div className="text-white/40 mt-1">Sharpen your skills anytime</div>
                  </div>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                      { icon: "🗣️", title: "Speaking",    desc: "AI pronunciation feedback",   color: "from-violet-600/30 to-violet-800/20", border: "border-violet-500/20", xp: 15 },
                      { icon: "👂", title: "Listening",   desc: "Train with native audio",      color: "from-blue-600/30 to-blue-800/20",   border: "border-blue-500/20",   xp: 10 },
                      { icon: "✍️", title: "Writing",     desc: "Build sentences from memory",  color: "from-emerald-600/30 to-emerald-800/20", border: "border-emerald-500/20", xp: 12 },
                      { icon: "🃏", title: "Flashcards",  desc: "Spaced repetition vocab",      color: "from-rose-600/30 to-rose-800/20",   border: "border-rose-500/20",   xp:  8 },
                      { icon: "⚡", title: "Speed Round", desc: "20 questions, 60 seconds",     color: "from-yellow-600/30 to-yellow-800/20", border: "border-yellow-500/20", xp: 20 },
                      { icon: "🤖", title: "AI Chat",     desc: "Chat with AI partner",         color: "from-cyan-600/30 to-cyan-800/20",   border: "border-cyan-500/20",   xp: 25 },
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
                <div className="max-w-2xl">
                  <div className="mb-6">
                    <div className="text-2xl font-black">Weekly Rankings 🏆</div>
                    <div className="text-white/40 mt-1">Resets Monday · Top 3 get bonus 💎</div>
                  </div>
                  {/* Podium */}
                  <div className="flex items-end justify-center gap-4 mb-6">
                    {[leaderboard[1], leaderboard[0], leaderboard[2]].map((r, i) => {
                      const h = ["h-24", "h-32", "h-20"];
                      const c = ["bg-gray-500/20 border-gray-400/20", "bg-yellow-500/20 border-yellow-400/30", "bg-orange-500/15 border-orange-400/20"];
                      const m = ["🥈","🥇","🥉"];
                      return (
                        <div key={i} className={`flex-1 flex flex-col items-center gap-2 ${h[i]} rounded-2xl border ${c[i]} justify-end pb-4`}>
                          <span className="text-2xl">{m[i]}</span>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold">{r.name[0]}</div>
                          <div className="text-white text-sm font-bold">{r.name}</div>
                          <div className="text-white/40 text-xs">{r.xp.toLocaleString()} XP</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    {leaderboard.map((r, i) => (
                      <div key={i} className={`flex items-center gap-3 px-5 py-3.5 border-b border-white/5 last:border-0 transition-all
                        ${r.isYou ? "bg-purple-500/15" : "hover:bg-white/5"}`}>
                        <div className="w-6 text-center">{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span className="text-white/30 text-sm font-bold">{i+1}</span>}</div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold">{r.name[0]}</div>
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${r.isYou ? "text-purple-300" : "text-white"}`}>
                            {r.name} {r.isYou && <span className="text-xs bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded-full ml-1">You</span>}
                          </div>
                          <div className="text-white/30 text-xs">{r.xp.toLocaleString()} XP this week</div>
                        </div>
                        <div className="w-28 hidden sm:block">
                          <XpBar current={r.xp} max={5000} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── PROFILE ───────────────────────────────────────────── */}
              {tab === "profile" && (
                <div className="max-w-2xl space-y-5">
                  <div className="bg-gradient-to-br from-purple-600/30 to-indigo-600/20 border border-purple-500/25 rounded-3xl p-6 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-black flex-shrink-0 shadow-[0_0_30px_rgba(139,92,246,0.5)]">A</div>
                    <div>
                      <div className="text-white text-2xl font-black">Andriy</div>
                      <div className="text-white/40 text-sm">Joined March 2026</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">🇺🇦 Ukrainian</span>
                        <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">🇬🇧 English</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { icon:"🔥", val: streak,  label:"Streak",  color:"text-orange-400" },
                      { icon:"⭐", val: totalXp, label:"Total XP", color:"text-yellow-400" },
                      { icon:"📚", val: 12,       label:"Lessons", color:"text-green-400"  },
                      { icon:"🏆", val: "#4",     label:"Rank",    color:"text-purple-400" },
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
                      <div className="text-white font-black">Level {level} ⭐</div>
                      <div className="text-white/30 text-xs">{totalXp}/{nextLvlXp} XP</div>
                    </div>
                    <XpBar current={totalXp} max={nextLvlXp} />
                    <div className="text-white/30 text-xs mt-1.5">{nextLvlXp - totalXp} XP to Level {level+1}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                    <h3 className="text-white font-bold mb-4">Achievements</h3>
                    <div className="grid grid-cols-6 gap-3">
                      {[
                        { icon:"🔥", name:"On Fire",      desc:"7-day streak",      unlocked:true  },
                        { icon:"⚡", name:"Quick Start",  desc:"First lesson done", unlocked:true  },
                        { icon:"🌙", name:"Night Owl",    desc:"Learn after 10pm",  unlocked:true  },
                        { icon:"💎", name:"Gem Collector",desc:"Earn 500 gems",     unlocked:false },
                        { icon:"🏆", name:"Champion",     desc:"Top 3 leaderboard", unlocked:false },
                        { icon:"🎯", name:"Sharp",        desc:"100% accuracy",     unlocked:false },
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
        <main className="flex-1 overflow-y-auto pb-24">

          {/* LEARN — map */}
          {tab === "learn" && (
            <div className="px-4 py-4 space-y-4">
              {/* Continue banner */}
              <div className="flex items-center justify-between gap-3 bg-green-500/15 border border-green-500/25 rounded-2xl px-4 py-3">
                <div>
                  <div className="text-white font-black text-sm">Introduce yourself 🗣️</div>
                  <div className="text-white/40 text-xs">{dailyGoal - dailyXp} XP left today</div>
                </div>
                <button className="bg-green-500 text-white font-black px-4 py-2 rounded-xl text-sm shadow-[0_0_16px_rgba(34,197,94,0.4)] active:scale-95 transition-all whitespace-nowrap">
                  Go ▶
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
                  <div className="text-white text-sm font-bold">Daily goal: {dailyXp}/{dailyGoal} XP</div>
                  <XpBar current={dailyXp} max={dailyGoal} color="from-purple-500 to-violet-400" />
                </div>
              </div>

              {/* The map */}
              <MobileMap />
            </div>
          )}

          {/* PRACTICE */}
          {tab === "practice" && (
            <div className="px-4 py-4 space-y-3">
              <div className="text-xl font-black pt-2 pb-1">Practice ⚔️</div>
              {[
                { icon:"🗣️", title:"Speaking",    desc:"AI feedback",       color:"from-violet-600/30 to-violet-800/20", border:"border-violet-500/20", xp:15 },
                { icon:"👂", title:"Listening",   desc:"Native audio",      color:"from-blue-600/30 to-blue-800/20",   border:"border-blue-500/20",   xp:10 },
                { icon:"✍️", title:"Writing",     desc:"Sentences from memory", color:"from-emerald-600/30 to-emerald-800/20", border:"border-emerald-500/20", xp:12 },
                { icon:"🃏", title:"Flashcards",  desc:"Spaced repetition", color:"from-rose-600/30 to-rose-800/20",   border:"border-rose-500/20",   xp: 8 },
                { icon:"⚡", title:"Speed Round", desc:"60 seconds",        color:"from-yellow-600/30 to-yellow-800/20", border:"border-yellow-500/20", xp:20 },
                { icon:"🤖", title:"AI Chat",     desc:"AI conversation",   color:"from-cyan-600/30 to-cyan-800/20",   border:"border-cyan-500/20",   xp:25 },
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
              <div className="text-xl font-black pt-2 pb-1">Rankings 🏆</div>
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                {leaderboard.map((r,i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 ${r.isYou?"bg-purple-500/15":""}`}>
                    <div className="w-6 text-center text-sm">{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span className="text-white/30 font-bold text-xs">{i+1}</span>}</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold">{r.name[0]}</div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${r.isYou?"text-purple-300":"text-white"}`}>
                        {r.name} {r.isYou&&<span className="text-[10px] text-purple-400">(you)</span>}
                      </div>
                      <div className="text-white/30 text-xs">{r.xp.toLocaleString()} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="px-4 py-4 space-y-4">
              <div className="bg-gradient-to-br from-purple-600/30 to-indigo-600/20 border border-purple-500/25 rounded-3xl p-5 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-black mx-auto">A</div>
                <div className="text-white text-lg font-black mt-2">Andriy</div>
                <div className="text-white/40 text-xs">Joined March 2026</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon:"🔥", val:streak,  label:"Streak",  color:"text-orange-400" },
                  { icon:"⭐", val:totalXp, label:"XP",      color:"text-yellow-400" },
                  { icon:"📚", val:12,       label:"Lessons", color:"text-green-400"  },
                  { icon:"🏆", val:"#4",     label:"Rank",    color:"text-purple-400" },
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
                  <span className="text-white font-bold">Level {level}</span>
                  <span className="text-white/30">{totalXp}/{nextLvlXp} XP</span>
                </div>
                <XpBar current={totalXp} max={nextLvlXp} />
              </div>
            </div>
          )}
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0d0d1f]/95 backdrop-blur-xl">
          <div className="flex items-center justify-around px-2 pt-2 pb-6">
            {navItems.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)}
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
