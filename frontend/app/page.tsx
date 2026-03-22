"use client";

import { useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = "learn" | "practice" | "leaderboard" | "profile";

// ── Helpers ──────────────────────────────────────────────────────────────────

function ProgressRing({ pct, size = 64, stroke = 6, color = "#22c55e" }: {
  pct: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
    </svg>
  );
}

function XpBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000"
        style={{ width: `${pct}%` }}
      />
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

// ── Components ───────────────────────────────────────────────────────────────

function StreakCard({ streak }: { streak: number }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;
  return (
    <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl p-5 shadow-[0_8px_32px_rgba(249,115,22,0.4)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-white/80 text-xs font-semibold uppercase tracking-widest">Current Streak</div>
          <div className="text-white text-4xl font-black mt-0.5">{streak} <span className="text-2xl">🔥</span></div>
          <div className="text-orange-100/70 text-xs mt-0.5">days in a row</div>
        </div>
        <div className="text-6xl opacity-20 font-black">🔥</div>
      </div>
      <div className="flex gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="text-orange-100/60 text-[10px] font-bold">{d}</div>
            <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
              i < adjustedToday
                ? "bg-white/30 text-white"
                : i === adjustedToday
                ? "bg-white text-orange-500 shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                : "bg-white/10 text-white/30"
            }`}>
              {i <= adjustedToday ? "✓" : "·"}
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
    <div className={`rounded-3xl p-5 border transition-all ${
      done
        ? "bg-green-500/20 border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
        : "bg-white/5 border-white/10"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-white/60 text-xs font-semibold uppercase tracking-widest">Daily Goal</div>
          <div className="text-white text-2xl font-black mt-0.5">
            {xp} <span className="text-white/40 text-lg font-medium">/ {goal} XP</span>
          </div>
          {done
            ? <div className="text-green-400 text-xs font-bold mt-1">✓ Goal reached! Come back tomorrow</div>
            : <div className="text-white/40 text-xs mt-1">{goal - xp} XP to reach your goal</div>
          }
        </div>
        <div className="relative ml-4">
          <ProgressRing pct={pct} size={72} stroke={7} color={done ? "#22c55e" : "#a855f7"} />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
            {Math.round(pct * 100)}%
          </div>
        </div>
      </div>
      {!done && (
        <div className="mt-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-full transition-all duration-1000"
              style={{ width: `${pct * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LevelCard({ level, xp, nextXp }: { level: number; xp: number; nextXp: number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-white/60 text-xs font-semibold uppercase tracking-widest">Level</div>
          <div className="text-white text-2xl font-black">{level} <span className="text-yellow-400">⭐</span></div>
        </div>
        <div className="text-right">
          <div className="text-white/40 text-xs">{xp} / {nextXp} XP</div>
          <div className="text-white/60 text-xs">to level {level + 1}</div>
        </div>
      </div>
      <XpBar current={xp} max={nextXp} />
    </div>
  );
}

function LessonUnit({
  unit, section, icon, color, glow, lessons, progress,
}: {
  unit: number; section: string; icon: string; color: string; glow: string;
  lessons: { title: string; type: string; locked?: boolean; done?: boolean }[];
  progress: number;
}) {
  const [open, setOpen] = useState(unit === 1);
  return (
    <div className="space-y-2">
      {/* Unit header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full text-left rounded-2xl p-4 border transition-all ${color} ${glow}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">{icon}</div>
            <div>
              <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{section}</div>
              <div className="text-white font-bold text-sm">Unit {unit}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-white/60 text-xs">{progress}% done</div>
              <div className="w-20 h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-white/60 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <span className={`text-white/60 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
          </div>
        </div>
      </button>

      {/* Lessons */}
      {open && (
        <div className="pl-4 space-y-2">
          {lessons.map((lesson, i) => (
            <button
              key={i}
              disabled={lesson.locked}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                ${lesson.done ? "bg-green-500/10 border-green-500/20" : ""}
                ${lesson.locked ? "bg-white/2 border-white/5 opacity-40 cursor-not-allowed" : ""}
                ${!lesson.done && !lesson.locked ? "bg-white/5 border-white/10 hover:bg-white/10 active:scale-[0.98]" : ""}
              `}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0
                ${lesson.done ? "bg-green-500" : lesson.locked ? "bg-white/10" : "bg-white/15"}
              `}>
                {lesson.locked ? "🔒" : lesson.done ? "✓" : "▶"}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${lesson.done ? "text-white/60" : lesson.locked ? "text-white/30" : "text-white"}`}>
                  {lesson.title}
                </div>
                <div className="text-white/30 text-xs">{lesson.type}</div>
              </div>
              {!lesson.locked && !lesson.done && (
                <div className="text-white/30 text-xs font-bold">+10 XP</div>
              )}
              {lesson.done && <div className="text-green-400 text-xs font-bold">+10 XP</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({ rank, name, xp, isYou }: { rank: number; name: string; xp: number; isYou?: boolean }) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
      isYou ? "bg-purple-500/20 border border-purple-500/30" : "hover:bg-white/5"
    }`}>
      <div className="w-7 text-center">
        {medal
          ? <span className="text-lg">{medal}</span>
          : <span className="text-white/40 text-sm font-bold">{rank}</span>
        }
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
        {name[0]}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-semibold ${isYou ? "text-purple-300" : "text-white"}`}>
          {name} {isYou && <span className="text-[10px] bg-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded-full ml-1">You</span>}
        </div>
        <div className="text-white/30 text-xs">{xp.toLocaleString()} XP</div>
      </div>
      <XpBar current={xp} max={5000} />
    </div>
  );
}

function AchievementBadge({ icon, name, desc, unlocked }: { icon: string; name: string; desc: string; unlocked: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all ${
      unlocked ? "bg-yellow-500/10 border-yellow-500/30" : "bg-white/3 border-white/5 opacity-40"
    }`}>
      <div className={`text-2xl ${!unlocked ? "grayscale" : ""}`}>{icon}</div>
      <div className={`text-xs font-bold ${unlocked ? "text-yellow-300" : "text-white/30"}`}>{name}</div>
      <div className="text-white/30 text-[10px] leading-tight">{desc}</div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

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

  const units = [
    {
      unit: 1, section: "Section 1", icon: "📝", progress: 40,
      color: "bg-green-600/30 border border-green-500/30",
      glow: "shadow-[0_4px_20px_rgba(34,197,94,0.15)]",
      lessons: [
        { title: "Basic greetings", type: "Vocabulary", done: true },
        { title: "Say hello & goodbye", type: "Speaking", done: true },
        { title: "Introduce yourself", type: "Conversation" },
        { title: "Ask simple questions", type: "Grammar", locked: true },
        { title: "Answer about yourself", type: "Listening", locked: true },
      ],
    },
    {
      unit: 2, section: "Section 1", icon: "🔢", progress: 0,
      color: "bg-blue-600/20 border border-blue-500/20",
      glow: "shadow-[0_4px_20px_rgba(59,130,246,0.1)]",
      lessons: [
        { title: "Numbers 1–10", type: "Vocabulary", locked: true },
        { title: "Count objects", type: "Practice", locked: true },
        { title: "Tell the time", type: "Conversation", locked: true },
        { title: "Dates & calendar", type: "Grammar", locked: true },
      ],
    },
    {
      unit: 3, section: "Section 2", icon: "🍎", progress: 0,
      color: "bg-rose-600/20 border border-rose-500/20",
      glow: "shadow-[0_4px_20px_rgba(244,63,94,0.1)]",
      lessons: [
        { title: "Food & drinks", type: "Vocabulary", locked: true },
        { title: "Order at a restaurant", type: "Conversation", locked: true },
        { title: "Express preferences", type: "Speaking", locked: true },
      ],
    },
  ];

  const leaderboard = [
    { name: "Sophia", xp: 4820 },
    { name: "Marcus", xp: 4210 },
    { name: "Yuki", xp: 3950 },
    { name: "Andriy", xp: 3400, isYou: true },
    { name: "Pablo", xp: 2980 },
    { name: "Emma", xp: 2650 },
    { name: "Ivan", xp: 1990 },
  ];

  const achievements = [
    { icon: "🔥", name: "On Fire", desc: "7-day streak", unlocked: true },
    { icon: "⚡", name: "Quick Start", desc: "First lesson done", unlocked: true },
    { icon: "🌙", name: "Night Owl", desc: "Learn after 10pm", unlocked: true },
    { icon: "💎", name: "Gem Collector", desc: "Earn 500 gems", unlocked: false },
    { icon: "🏆", name: "Champion", desc: "Top 3 leaderboard", unlocked: false },
    { icon: "🎯", name: "Sharp Shooter", desc: "100% accuracy", unlocked: false },
  ];

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "learn", icon: "🏠", label: "Learn" },
    { id: "practice", icon: "⚔️", label: "Practice" },
    { id: "leaderboard", icon: "🏆", label: "Ranks" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0d0d1f] text-white">

      {/* ── Ambient background ───────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-900/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-900/20 rounded-full blur-[100px]" />
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d0d1f]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Owl size={28} />
            <span className="font-black text-lg text-white hidden sm:block">iLearn</span>
          </div>

          {/* Desktop nav */}
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

          {/* Quick stats */}
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

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 pb-28 md:pb-10">

        {/* ══ LEARN TAB ══════════════════════════════════════════════ */}
        {tab === "learn" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-5">

              {/* Greeting + CTA */}
              <div className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-3xl p-5">
                <div>
                  <div className="text-white/50 text-sm">Good day, Andriy 👋</div>
                  <div className="text-white text-xl font-black mt-0.5">Keep your streak alive!</div>
                  <div className="text-white/40 text-xs mt-1">You have <span className="text-yellow-400 font-bold">{dailyGoal - dailyXp} XP</span> left for today&apos;s goal</div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => {}}
                    className="bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all text-sm whitespace-nowrap"
                  >
                    Continue ▶
                  </button>
                </div>
              </div>

              {/* Daily goal */}
              <DailyGoalCard xp={dailyXp} goal={dailyGoal} />

              {/* Lesson units */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest">Learning Path</h2>
                  <span className="text-white/30 text-xs">Section 1 of 5</span>
                </div>
                <div className="space-y-3">
                  {units.map(u => <LessonUnit key={u.unit} {...u} />)}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">
              <StreakCard streak={streak} />
              <LevelCard level={level} xp={totalXp} nextXp={nextLevelXp} />

              {/* Mini leaderboard */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold text-sm">Leaderboard</h3>
                  <button onClick={() => setTab("leaderboard")} className="text-purple-400 text-xs font-semibold hover:text-purple-300">See all →</button>
                </div>
                <div className="space-y-1">
                  {leaderboard.slice(0, 4).map((r, i) => (
                    <LeaderboardRow key={i} rank={i + 1} {...r} />
                  ))}
                </div>
              </div>

              {/* Tip of the day */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-4">
                <div className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">💡 Tip of the day</div>
                <div className="text-white/70 text-sm leading-relaxed">
                  Learning 10 minutes daily beats 2 hours once a week. Consistency is the key!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ PRACTICE TAB ══════════════════════════════════════════ */}
        {tab === "practice" && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="text-center py-4">
              <div className="text-2xl font-black text-white">Practice Mode ⚔️</div>
              <div className="text-white/40 text-sm mt-1">Sharpen your skills without losing progress</div>
            </div>
            {[
              { icon: "🗣️", title: "Speaking", desc: "Practice pronunciation with AI feedback", color: "from-violet-600/30 to-violet-800/20", border: "border-violet-500/30", xp: 15 },
              { icon: "👂", title: "Listening", desc: "Train your ear with native recordings", color: "from-blue-600/30 to-blue-800/20", border: "border-blue-500/30", xp: 10 },
              { icon: "✍️", title: "Writing", desc: "Build sentences from memory", color: "from-emerald-600/30 to-emerald-800/20", border: "border-emerald-500/30", xp: 12 },
              { icon: "🃏", title: "Flashcards", desc: "Review vocabulary with spaced repetition", color: "from-rose-600/30 to-rose-800/20", border: "border-rose-500/30", xp: 8 },
              { icon: "⚡", title: "Speed Round", desc: "Answer 20 questions in 60 seconds", color: "from-yellow-600/30 to-yellow-800/20", border: "border-yellow-500/30", xp: 20 },
              { icon: "🤖", title: "AI Conversation", desc: "Chat with our AI language partner", color: "from-cyan-600/30 to-cyan-800/20", border: "border-cyan-500/30", xp: 25 },
            ].map((m, i) => (
              <button key={i} className={`w-full flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r ${m.color} border ${m.border} hover:brightness-110 active:scale-[0.98] transition-all text-left`}>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">{m.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-black text-base">{m.title}</div>
                  <div className="text-white/50 text-sm mt-0.5">{m.desc}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-yellow-400 font-black text-sm">+{m.xp}</div>
                  <div className="text-white/30 text-xs">XP</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ══ LEADERBOARD TAB ═══════════════════════════════════════ */}
        {tab === "leaderboard" && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="text-center py-4">
              <div className="text-2xl font-black text-white">Weekly Rankings 🏆</div>
              <div className="text-white/40 text-sm mt-1">Resets every Monday · Top 3 get bonus gems 💎</div>
            </div>
            {/* Top 3 podium */}
            <div className="flex items-end justify-center gap-3 pb-2">
              {[leaderboard[1], leaderboard[0], leaderboard[2]].map((r, i) => {
                const heights = ["h-20", "h-28", "h-16"];
                const colors = ["bg-gray-500/30 border-gray-400/30", "bg-yellow-500/30 border-yellow-400/40", "bg-orange-500/20 border-orange-400/30"];
                const realRanks = [2, 1, 3];
                const medal = ["🥈", "🥇", "🥉"];
                return (
                  <div key={i} className={`flex-1 flex flex-col items-center gap-2 ${heights[i]} rounded-2xl border ${colors[i]} justify-end pb-3 pt-2`}>
                    <div className="text-lg">{medal[i]}</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">{r.name[0]}</div>
                    <div className="text-white text-xs font-bold">{r.name}</div>
                    <div className="text-white/40 text-[10px]">{r.xp.toLocaleString()} XP</div>
                  </div>
                );
              })}
            </div>
            {/* Full list */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-1">
              {leaderboard.map((r, i) => (
                <LeaderboardRow key={i} rank={i + 1} name={r.name} xp={r.xp} isYou={(r as any).isYou} />
              ))}
            </div>
          </div>
        )}

        {/* ══ PROFILE TAB ══════════════════════════════════════════ */}
        {tab === "profile" && (
          <div className="max-w-xl mx-auto space-y-5">
            {/* Profile card */}
            <div className="bg-gradient-to-br from-purple-600/30 to-indigo-600/20 border border-purple-500/30 rounded-3xl p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-black text-white mx-auto shadow-[0_0_30px_rgba(139,92,246,0.5)]">A</div>
              <div className="text-white text-xl font-black mt-3">Andriy</div>
              <div className="text-white/40 text-sm">Joined March 2026</div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="bg-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">🇺🇦 Ukrainian</span>
                <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">Learning 🇬🇧 English</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "🔥", val: streak, label: "Day streak", color: "text-orange-400" },
                { icon: "⭐", val: totalXp, label: "Total XP", color: "text-yellow-400" },
                { icon: "📚", val: 12, label: "Lessons done", color: "text-green-400" },
                { icon: "🏆", val: 4, label: "Rank", color: "text-purple-400" },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-1">
                  <span className="text-2xl">{s.icon}</span>
                  <span className={`text-xl font-black ${s.color}`}>{s.val}</span>
                  <span className="text-white/40 text-xs text-center">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Level */}
            <LevelCard level={level} xp={totalXp} nextXp={nextLevelXp} />

            {/* Achievements */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <h3 className="text-white font-bold mb-4">Achievements</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {achievements.map((a, i) => <AchievementBadge key={i} {...a} />)}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              {[
                { icon: "🎯", label: "Daily goal", val: `${dailyGoal} XP` },
                { icon: "🔔", label: "Reminders", val: "8:00 PM" },
                { icon: "🌙", label: "Dark mode", val: "On" },
                { icon: "🌍", label: "Interface language", val: "English" },
              ].map((s, i) => (
                <button key={i} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-white/70 text-sm font-medium">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-sm">{s.val}</span>
                    <span className="text-white/20 text-sm">›</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile bottom nav ────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/5 bg-[#0d0d1f]/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-3 pb-6">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className="flex flex-col items-center gap-1 px-3 py-1 transition-all active:scale-90">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all ${
                tab === n.id ? "bg-white/15 shadow-[0_0_12px_rgba(139,92,246,0.3)]" : ""
              }`}>
                {n.icon}
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${tab === n.id ? "text-white" : "text-white/30"}`}>
                {n.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
