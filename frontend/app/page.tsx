"use client";

import { useState } from "react";

// ── SVG Owl Components ──────────────────────────────────────────────────────

function BigOwl() {
  return (
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <ellipse cx="60" cy="90" rx="38" ry="42" fill="#6B7280" />
      <ellipse cx="60" cy="92" rx="32" ry="36" fill="#9CA3AF" />
      <ellipse cx="60" cy="100" rx="20" ry="24" fill="#E5E7EB" />
      <ellipse cx="28" cy="95" rx="14" ry="22" fill="#4B5563" transform="rotate(-15 28 95)" />
      <ellipse cx="92" cy="95" rx="14" ry="22" fill="#4B5563" transform="rotate(15 92 95)" />
      <ellipse cx="60" cy="58" rx="30" ry="28" fill="#9CA3AF" />
      <ellipse cx="43" cy="33" rx="7" ry="10" fill="#6B7280" transform="rotate(-20 43 33)" />
      <ellipse cx="77" cy="33" rx="7" ry="10" fill="#6B7280" transform="rotate(20 77 33)" />
      <ellipse cx="60" cy="60" rx="22" ry="20" fill="#F3F4F6" />
      <circle cx="50" cy="56" r="10" fill="white" />
      <circle cx="50" cy="56" r="7" fill="#1E40AF" />
      <circle cx="50" cy="56" r="4" fill="#1E3A8A" />
      <circle cx="50" cy="56" r="2" fill="#111827" />
      <circle cx="47" cy="53" r="1.5" fill="white" />
      <circle cx="70" cy="56" r="10" fill="white" />
      <circle cx="70" cy="56" r="7" fill="#1E40AF" />
      <circle cx="70" cy="56" r="4" fill="#1E3A8A" />
      <circle cx="70" cy="56" r="2" fill="#111827" />
      <circle cx="67" cy="53" r="1.5" fill="white" />
      <polygon points="60,65 54,72 66,72" fill="#F59E0B" />
      <g fill="#F59E0B">
        <ellipse cx="50" cy="130" rx="8" ry="4" />
        <ellipse cx="70" cy="130" rx="8" ry="4" />
        <rect x="43" y="126" width="4" height="8" rx="2" />
        <rect x="50" y="126" width="4" height="8" rx="2" />
        <rect x="63" y="126" width="4" height="8" rx="2" />
        <rect x="70" y="126" width="4" height="8" rx="2" />
      </g>
      <circle cx="85" cy="45" r="2" fill="white" opacity="0.8" />
      <circle cx="88" cy="40" r="1" fill="white" opacity="0.6" />
      <circle cx="35" cy="42" r="1.5" fill="white" opacity="0.7" />
    </svg>
  );
}

function TinyOwl({ color = "#F59E0B" }: { color?: string }) {
  return (
    <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="20" cy="32" rx="13" ry="13" fill={color} opacity="0.9" />
      <ellipse cx="20" cy="34" rx="9" ry="10" fill={color} />
      <ellipse cx="20" cy="38" rx="6" ry="7" fill="white" opacity="0.3" />
      <ellipse cx="20" cy="19" rx="11" ry="10" fill={color} />
      <ellipse cx="14" cy="11" rx="3" ry="4" fill={color} transform="rotate(-20 14 11)" />
      <ellipse cx="26" cy="11" rx="3" ry="4" fill={color} transform="rotate(20 26 11)" />
      <ellipse cx="20" cy="20" rx="8" ry="7" fill="white" opacity="0.25" />
      <circle cx="16.5" cy="18" r="3.5" fill="white" />
      <circle cx="16.5" cy="18" r="2" fill="#1E293B" />
      <circle cx="15.5" cy="17" r="0.7" fill="white" />
      <circle cx="23.5" cy="18" r="3.5" fill="white" />
      <circle cx="23.5" cy="18" r="2" fill="#1E293B" />
      <circle cx="22.5" cy="17" r="0.7" fill="white" />
      <polygon points="20,22 17.5,25.5 22.5,25.5" fill="#F59E0B" />
    </svg>
  );
}

function Sparkle({ size = 4, opacity = 0.8 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size * 4} height={size * 4} viewBox="0 0 16 16" fill="none">
      <path d="M8 0L9.2 6.8L16 8L9.2 9.2L8 16L6.8 9.2L0 8L6.8 6.8Z" fill="white" opacity={opacity} />
    </svg>
  );
}

// ── Lesson Card ─────────────────────────────────────────────────────────────

function LessonCard({
  title,
  subtitle,
  icon,
  active = false,
  completed = false,
  locked = false,
}: {
  title: string;
  subtitle: string;
  icon: string;
  active?: boolean;
  completed?: boolean;
  locked?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer
        ${active ? "bg-green-500/20 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]" : ""}
        ${completed ? "bg-white/5 border-white/10" : ""}
        ${locked ? "bg-white/3 border-white/5 opacity-50" : ""}
        ${!active && !completed && !locked ? "bg-white/8 border-white/10 hover:bg-white/12" : ""}
      `}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0
          ${active ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : ""}
          ${completed ? "bg-white/15" : ""}
          ${locked ? "bg-white/5" : ""}
          ${!active && !completed && !locked ? "bg-white/10" : ""}
        `}
      >
        {locked ? "🔒" : icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm truncate ${active ? "text-green-300" : completed ? "text-white/70" : "text-white"}`}>
          {title}
        </p>
        <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>
      </div>
      {completed && <span className="text-green-400 text-lg flex-shrink-0">✓</span>}
      {active && (
        <div className="flex-shrink-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          START
        </div>
      )}
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10`}>
      <span className="text-2xl">{icon}</span>
      <span className={`text-lg font-black ${color}`}>{value}</span>
      <span className="text-white/40 text-xs">{label}</span>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  const lessons = [
    { title: "Form basic sentences", subtitle: "Section 1 · Unit 1", icon: "📝", active: true, completed: false, locked: false },
    { title: "Greetings & introductions", subtitle: "Section 1 · Unit 2", icon: "👋", active: false, completed: false, locked: false },
    { title: "Numbers & counting", subtitle: "Section 1 · Unit 3", icon: "🔢", active: false, completed: false, locked: true },
    { title: "Colors & shapes", subtitle: "Section 1 · Unit 4", icon: "🎨", active: false, completed: false, locked: true },
    { title: "Food & drinks", subtitle: "Section 2 · Unit 1", icon: "🍎", active: false, completed: false, locked: true },
    { title: "Family & people", subtitle: "Section 2 · Unit 2", icon: "👨‍👩‍👧", active: false, completed: false, locked: true },
  ];

  const navItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "lessons", icon: "📖", label: "Learn" },
    { id: "owl", icon: "🦉", label: "Owl" },
    { id: "hearts", icon: "💖", label: "Hearts" },
    { id: "gems", icon: "💎", label: "Gems" },
    { id: "more", icon: "⋯", label: "More" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d2b] via-[#0f0a1f] to-[#050510]">

      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[
          [5, 5], [15, 12], [28, 3], [42, 8], [55, 15], [68, 4], [82, 10], [92, 6],
          [10, 25], [35, 20], [60, 28], [78, 22], [95, 18],
          [3, 45], [22, 38], [48, 42], [70, 35], [88, 48],
          [12, 65], [38, 58], [62, 70], [80, 60], [96, 68],
          [7, 82], [25, 78], [50, 85], [72, 80], [90, 88],
        ].map(([x, y], i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white star-twinkle"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: (i % 3 === 0) ? 3 : (i % 3 === 1) ? 2 : 1.5,
              height: (i % 3 === 0) ? 3 : (i % 3 === 1) ? 2 : 1.5,
              opacity: 0.3 + (i % 5) * 0.1,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <div className="absolute top-0 left-0 w-1/3 h-1/3 rounded-full bg-purple-900/20 blur-[80px]" />
        <div className="absolute top-1/4 right-0 w-1/4 h-1/4 rounded-full bg-indigo-900/20 blur-[60px]" />
        <div className="absolute bottom-1/3 left-1/4 w-1/3 h-1/3 rounded-full bg-violet-900/15 blur-[100px]" />
      </div>

      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/5 backdrop-blur-sm bg-[#0d0d2b]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <TinyOwl color="#A78BFA" />
              </div>
              <span className="text-white font-black text-lg hidden sm:block">iLearn</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id
                      ? "bg-white/15 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                      : "text-white/50 hover:text-white/80 hover:bg-white/8"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Stats */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-orange-500/20 rounded-full px-2.5 py-1">
                <span className="text-sm">🔥</span>
                <span className="text-orange-300 text-xs font-bold">1</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-500/20 rounded-full px-2.5 py-1">
                <span className="text-sm">💎</span>
                <span className="text-blue-300 text-xs font-bold">520</span>
              </div>
              <div className="flex items-center gap-1 bg-yellow-500/20 rounded-full px-2.5 py-1">
                <span className="text-sm">⚡</span>
                <span className="text-yellow-300 text-xs font-bold">∞</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left / Main Column ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Section Banner */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-6 shadow-[0_4px_40px_rgba(34,197,94,0.3)] overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100/80 text-xs font-semibold tracking-widest uppercase mb-1">Section 1, Unit 1</p>
                  <p className="text-white text-2xl sm:text-3xl font-black">Form basic sentences</p>
                  <p className="text-green-100/70 text-sm mt-2">Master the fundamentals of English communication</p>
                </div>
                <div className="hidden sm:block w-24 h-28 flex-shrink-0 owl-bob">
                  <BigOwl />
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-green-100/70 mb-1.5">
                  <span>Progress</span>
                  <span>0 / 6 lessons</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-white rounded-full" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "🎤", label: "Speak", color: "from-violet-900/80 to-violet-800/60", border: "border-violet-500/20" },
                { icon: "📹", label: "Watch", color: "from-blue-900/80 to-blue-800/60", border: "border-blue-500/20" },
                { icon: "🎮", label: "Play", color: "from-emerald-900/80 to-emerald-800/60", border: "border-emerald-500/20" },
                { icon: "🔒", label: "Locked", color: "from-gray-800/80 to-gray-700/60", border: "border-gray-500/10" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  className={`relative bg-gradient-to-b ${btn.color} rounded-2xl p-4 flex flex-col items-center gap-2 border ${btn.border} active:scale-95 transition-transform hover:brightness-110`}
                >
                  <span className="text-3xl">{btn.icon}</span>
                  <span className="text-xs text-white/60 font-semibold tracking-wide">{btn.label}</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
                </button>
              ))}
            </div>

            {/* Lessons List */}
            <div>
              <h2 className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">All Lessons</h2>
              <div className="space-y-2">
                {lessons.map((lesson, i) => (
                  <LessonCard key={i} {...lesson} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Owl mascot */}
            <div className="hidden lg:flex flex-col items-center bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="w-32 h-36 owl-float">
                <BigOwl />
              </div>
              <p className="text-white font-bold text-center mt-3">Ready to learn?</p>
              <p className="text-white/40 text-sm text-center mt-1">Your owl is waiting for you!</p>
              <button className="mt-4 w-full bg-green-500 hover:bg-green-400 text-white font-black py-3 rounded-2xl transition-colors shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                Continue Learning
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <h3 className="text-white font-bold mb-4">Your Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon="🔥" value="1" label="Day streak" color="text-orange-400" />
                <StatCard icon="⭐" value="0" label="XP today" color="text-yellow-400" />
                <StatCard icon="💎" value="520" label="Gems" color="text-blue-400" />
                <StatCard icon="🏆" value="0" label="Trophies" color="text-purple-400" />
              </div>
            </div>

            {/* Sparkle decorations */}
            <div className="hidden lg:flex items-center justify-around px-4">
              <div className="sparkle-float"><Sparkle size={5} opacity={0.7} /></div>
              <div className="w-10 h-12"><TinyOwl color="#34D399" /></div>
              <div className="sparkle-float-delay"><Sparkle size={4} opacity={0.6} /></div>
              <div className="w-10 h-12"><TinyOwl color="#FB923C" /></div>
              <div className="sparkle-float"><Sparkle size={3} opacity={0.8} /></div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Mobile Bottom Navigation ──────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0820] via-[#0a0820]/95 to-transparent" />
        <div className="relative flex items-center justify-around px-2 pt-2 pb-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all active:scale-90"
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  activeTab === item.id
                    ? "bg-white/15 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    : ""
                }`}
              >
                <span className="text-xl">{item.icon}</span>
              </div>
              <span className={`text-[9px] font-semibold transition-colors ${activeTab === item.id ? "text-white" : "text-white/40"}`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="w-1 h-1 rounded-full bg-purple-400 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}
