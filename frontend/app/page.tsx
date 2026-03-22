"use client";

import { useState } from "react";

// ── SVG Owl Components ──────────────────────────────────────────────────────

function BigOwl() {
  return (
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      {/* Body */}
      <ellipse cx="60" cy="90" rx="38" ry="42" fill="#6B7280" />
      <ellipse cx="60" cy="92" rx="32" ry="36" fill="#9CA3AF" />
      {/* Belly */}
      <ellipse cx="60" cy="100" rx="20" ry="24" fill="#E5E7EB" />
      {/* Wings */}
      <ellipse cx="28" cy="95" rx="14" ry="22" fill="#4B5563" transform="rotate(-15 28 95)" />
      <ellipse cx="92" cy="95" rx="14" ry="22" fill="#4B5563" transform="rotate(15 92 95)" />
      {/* Head */}
      <ellipse cx="60" cy="58" rx="30" ry="28" fill="#9CA3AF" />
      {/* Ear tufts */}
      <ellipse cx="43" cy="33" rx="7" ry="10" fill="#6B7280" transform="rotate(-20 43 33)" />
      <ellipse cx="77" cy="33" rx="7" ry="10" fill="#6B7280" transform="rotate(20 77 33)" />
      {/* Face white patch */}
      <ellipse cx="60" cy="60" rx="22" ry="20" fill="#F3F4F6" />
      {/* Left eye */}
      <circle cx="50" cy="56" r="10" fill="white" />
      <circle cx="50" cy="56" r="7" fill="#1E40AF" />
      <circle cx="50" cy="56" r="4" fill="#1E3A8A" />
      <circle cx="50" cy="56" r="2" fill="#111827" />
      <circle cx="47" cy="53" r="1.5" fill="white" />
      {/* Right eye */}
      <circle cx="70" cy="56" r="10" fill="white" />
      <circle cx="70" cy="56" r="7" fill="#1E40AF" />
      <circle cx="70" cy="56" r="4" fill="#1E3A8A" />
      <circle cx="70" cy="56" r="2" fill="#111827" />
      <circle cx="67" cy="53" r="1.5" fill="white" />
      {/* Beak */}
      <polygon points="60,65 54,72 66,72" fill="#F59E0B" />
      {/* Feet */}
      <g fill="#F59E0B">
        <ellipse cx="50" cy="130" rx="8" ry="4" />
        <ellipse cx="70" cy="130" rx="8" ry="4" />
        <rect x="43" y="126" width="4" height="8" rx="2" />
        <rect x="50" y="126" width="4" height="8" rx="2" />
        <rect x="63" y="126" width="4" height="8" rx="2" />
        <rect x="70" y="126" width="4" height="8" rx="2" />
      </g>
      {/* Sparkle highlights */}
      <circle cx="85" cy="45" r="2" fill="white" opacity="0.8" />
      <circle cx="88" cy="40" r="1" fill="white" opacity="0.6" />
      <circle cx="35" cy="42" r="1.5" fill="white" opacity="0.7" />
    </svg>
  );
}

function SmallOwlLeft() {
  return (
    <svg viewBox="0 0 70 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <ellipse cx="35" cy="55" rx="22" ry="22" fill="#7C3AED" />
      <ellipse cx="35" cy="57" rx="16" ry="18" fill="#8B5CF6" />
      <ellipse cx="35" cy="62" rx="11" ry="13" fill="#EDE9FE" />
      {/* Head */}
      <ellipse cx="35" cy="34" rx="18" ry="17" fill="#8B5CF6" />
      {/* Ear tufts */}
      <ellipse cx="25" cy="19" rx="5" ry="7" fill="#7C3AED" transform="rotate(-20 25 19)" />
      <ellipse cx="45" cy="19" rx="5" ry="7" fill="#7C3AED" transform="rotate(20 45 19)" />
      {/* Face */}
      <ellipse cx="35" cy="36" rx="14" ry="12" fill="#DDD6FE" />
      {/* Eyes */}
      <circle cx="29" cy="33" r="6" fill="white" />
      <circle cx="29" cy="33" r="4" fill="#7C3AED" />
      <circle cx="29" cy="33" r="2" fill="#4C1D95" />
      <circle cx="27.5" cy="31.5" r="1" fill="white" />
      <circle cx="41" cy="33" r="6" fill="white" />
      <circle cx="41" cy="33" r="4" fill="#7C3AED" />
      <circle cx="41" cy="33" r="2" fill="#4C1D95" />
      <circle cx="39.5" cy="31.5" r="1" fill="white" />
      {/* Beak */}
      <polygon points="35,39 31,44 39,44" fill="#F59E0B" />
      {/* Wing peeking */}
      <ellipse cx="16" cy="58" rx="9" ry="14" fill="#6D28D9" transform="rotate(-10 16 58)" />
    </svg>
  );
}

function SmallOwlRight() {
  return (
    <svg viewBox="0 0 70 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <ellipse cx="35" cy="55" rx="22" ry="22" fill="#065F46" />
      <ellipse cx="35" cy="57" rx="16" ry="18" fill="#059669" />
      <ellipse cx="35" cy="62" rx="11" ry="13" fill="#D1FAE5" />
      {/* Head */}
      <ellipse cx="35" cy="34" rx="18" ry="17" fill="#059669" />
      {/* Ear tufts */}
      <ellipse cx="25" cy="19" rx="5" ry="7" fill="#065F46" transform="rotate(-20 25 19)" />
      <ellipse cx="45" cy="19" rx="5" ry="7" fill="#065F46" transform="rotate(20 45 19)" />
      {/* Face */}
      <ellipse cx="35" cy="36" rx="14" ry="12" fill="#A7F3D0" />
      {/* Eyes */}
      <circle cx="29" cy="33" r="6" fill="white" />
      <circle cx="29" cy="33" r="4" fill="#065F46" />
      <circle cx="29" cy="33" r="2" fill="#022C22" />
      <circle cx="27.5" cy="31.5" r="1" fill="white" />
      <circle cx="41" cy="33" r="6" fill="white" />
      <circle cx="41" cy="33" r="4" fill="#065F46" />
      <circle cx="41" cy="33" r="2" fill="#022C22" />
      <circle cx="39.5" cy="31.5" r="1" fill="white" />
      {/* Beak */}
      <polygon points="35,39 31,44 39,44" fill="#F59E0B" />
      {/* Wing peeking */}
      <ellipse cx="54" cy="58" rx="9" ry="14" fill="#047857" transform="rotate(10 54 58)" />
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

// ── Star / Sparkle Components ───────────────────────────────────────────────

function Sparkle({ size = 4, opacity = 0.8 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size * 4} height={size * 4} viewBox="0 0 16 16" fill="none">
      <path d="M8 0L9.2 6.8L16 8L9.2 9.2L8 16L6.8 9.2L0 8L6.8 6.8Z" fill="white" opacity={opacity} />
    </svg>
  );
}

// ── Path Lesson Node ────────────────────────────────────────────────────────

function LessonNode({
  active = false,
  completed = false,
  x,
  y,
}: {
  active?: boolean;
  completed?: boolean;
  x: number;
  y: number;
}) {
  if (active) {
    return (
      <div
        className="absolute flex items-center justify-center"
        style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
      >
        {/* Outer pulse ring */}
        <div className="absolute w-24 h-24 rounded-full border-4 border-green-400/30 animate-ping" />
        <div className="absolute w-20 h-20 rounded-full border-4 border-green-400/50" />
        {/* Progress arc background */}
        <div className="relative w-16 h-16 rounded-full bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.8)] flex items-center justify-center">
          <span className="text-white text-3xl font-black">★</span>
        </div>
        {/* START label */}
        <div className="absolute -top-8 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full shadow-lg">
          START
        </div>
      </div>
    );
  }
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
          completed
            ? "bg-green-500 shadow-green-500/50"
            : "bg-gray-600 border-2 border-gray-500"
        }`}
      >
        <span className={`text-xl ${completed ? "text-white" : "text-gray-400"}`}>★</span>
      </div>
    </div>
  );
}

// ── Curved SVG Path ─────────────────────────────────────────────────────────

function LearningPath() {
  return (
    <svg
      viewBox="0 0 300 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Glow filter */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Main path - wide sinusoidal curve */}
      <path
        d="M150 40 C220 80, 240 120, 190 160 C140 200, 80 220, 90 270 C100 320, 200 340, 210 390 C220 440, 140 470, 150 530"
        stroke="#166534"
        strokeWidth="28"
        strokeLinecap="round"
        filter="url(#glow)"
      />
      <path
        d="M150 40 C220 80, 240 120, 190 160 C140 200, 80 220, 90 270 C100 320, 200 340, 210 390 C220 440, 140 470, 150 530"
        stroke="#22C55E"
        strokeWidth="20"
        strokeLinecap="round"
        filter="url(#glow)"
      />
      <path
        d="M150 40 C220 80, 240 120, 190 160 C140 200, 80 220, 90 270 C100 320, 200 340, 210 390 C220 440, 140 470, 150 530"
        stroke="#4ADE80"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Edge dots */}
      <path
        d="M150 40 C220 80, 240 120, 190 160 C140 200, 80 220, 90 270 C100 320, 200 340, 210 390 C220 440, 140 470, 150 530"
        stroke="#86EFAC"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 18"
        opacity="0.8"
      />
    </svg>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  const lessonNodes = [
    { x: 50, y: 8, active: true, completed: false },
    { x: 65, y: 22, active: false, completed: false },
    { x: 60, y: 36, active: false, completed: false },
    { x: 30, y: 50, active: false, completed: false },
    { x: 32, y: 65, active: false, completed: false },
    { x: 70, y: 77, active: false, completed: false },
    { x: 50, y: 90, active: false, completed: false },
  ];

  const navItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "lessons", icon: "📖", label: "Learn" },
    { id: "owl", icon: "🦉", label: "Owl" },
    { id: "hearts", icon: "💖", label: "Hearts" },
    { id: "gems", icon: "💎", label: "Gems" },
    { id: "more", icon: "⋯", label: "More" },
  ];

  const actionButtons = [
    { icon: "🎤", label: "Speak", color: "from-violet-900/80 to-violet-800/60", glow: "shadow-violet-500/30" },
    { icon: "📹", label: "Watch", color: "from-blue-900/80 to-blue-800/60", glow: "shadow-blue-500/30" },
    { icon: "🎮", label: "Play", color: "from-emerald-900/80 to-emerald-800/60", glow: "shadow-emerald-500/30" },
    { icon: "🔒", label: "Locked", color: "from-gray-800/80 to-gray-700/60", glow: "shadow-gray-500/20" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a1a]">
      {/* Phone Frame */}
      <div className="relative w-[390px] h-[844px] overflow-hidden rounded-[48px] shadow-[0_0_80px_rgba(139,92,246,0.4)] border border-purple-900/30">

        {/* ── Cosmic Background ──────────────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d2b] via-[#0f0a1f] to-[#050510]" />
        {/* Nebula clouds */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-purple-900/20 blur-[60px]" />
        <div className="absolute top-20 right-0 w-56 h-56 rounded-full bg-indigo-900/20 blur-[50px]" />
        <div className="absolute bottom-40 left-10 w-64 h-64 rounded-full bg-violet-900/15 blur-[70px]" />
        {/* Stars */}
        {[
          [20, 15], [80, 8], [140, 25], [220, 12], [300, 18],
          [50, 40], [170, 35], [260, 45], [340, 30],
          [30, 70], [120, 80], [200, 65], [320, 75],
          [70, 110], [180, 100], [280, 115], [360, 95],
          [15, 140], [250, 130], [380, 145],
        ].map(([x, y], i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white star-twinkle"
            style={{
              left: x,
              top: y,
              width: (i % 3 === 0) ? 3 : (i % 3 === 1) ? 2 : 1.5,
              height: (i % 3 === 0) ? 3 : (i % 3 === 1) ? 2 : 1.5,
              opacity: 0.4 + (i % 5) * 0.12,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* ── Status Bar ──────────────────────────────────────────── */}
        <div className="relative z-20 flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-3">
            {/* Flag + lessons */}
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
              <span className="text-base">🇬🇧</span>
              <span className="text-white text-xs font-bold">5</span>
            </div>
            {/* Streak */}
            <div className="flex items-center gap-1 bg-orange-500/20 rounded-full px-2.5 py-1">
              <span className="text-sm">🔥</span>
              <span className="text-orange-300 text-xs font-bold">1</span>
            </div>
            {/* Gems */}
            <div className="flex items-center gap-1 bg-blue-500/20 rounded-full px-2.5 py-1">
              <span className="text-sm">💎</span>
              <span className="text-blue-300 text-xs font-bold">520</span>
            </div>
            {/* Energy */}
            <div className="flex items-center gap-1 bg-yellow-500/20 rounded-full px-2.5 py-1">
              <span className="text-sm">⚡</span>
              <span className="text-yellow-300 text-xs font-bold">∞</span>
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-xs font-medium">19:25</span>
            <span className="text-white/60 text-sm">📶</span>
            <span className="text-white/60 text-sm">🔋</span>
          </div>
        </div>

        {/* ── Section Banner ──────────────────────────────────────── */}
        <div className="relative z-20 mx-4 mt-1">
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl px-5 py-3 shadow-[0_4px_24px_rgba(34,197,94,0.35)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100/80 text-xs font-semibold tracking-widest uppercase">Section 1, Unit 1</p>
                <p className="text-white text-base font-black mt-0.5">Form basic sentences</p>
              </div>
              <button className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col gap-1">
                  <div className="w-4 h-0.5 bg-white rounded-full" />
                  <div className="w-4 h-0.5 bg-white rounded-full" />
                  <div className="w-4 h-0.5 bg-white rounded-full" />
                </div>
              </button>
            </div>
            {/* Banner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ── Main Scrollable Area ─────────────────────────────────── */}
        <div className="relative z-10 h-[560px] overflow-hidden">

          {/* Curved Learning Path */}
          <div className="absolute inset-0">
            <LearningPath />
          </div>

          {/* Lesson Nodes */}
          {lessonNodes.map((node, i) => (
            <LessonNode key={i} {...node} />
          ))}

          {/* ── Owl Characters ────────────────────────────────────── */}

          {/* Big center owl */}
          <div className="absolute" style={{ left: "50%", top: "38%", transform: "translate(-50%,-50%)", width: 110, zIndex: 10 }}>
            <BigOwl />
          </div>

          {/* Small left owl */}
          <div
            className="absolute owl-bob"
            style={{ left: "2%", top: "42%", width: 72, zIndex: 8 }}
          >
            <SmallOwlLeft />
          </div>

          {/* Small right owl */}
          <div
            className="absolute owl-bob-delay"
            style={{ right: "2%", top: "50%", width: 72, zIndex: 8 }}
          >
            <SmallOwlRight />
          </div>

          {/* Tiny owl top-right */}
          <div className="absolute owl-float" style={{ right: "8%", top: "8%", width: 44, zIndex: 6 }}>
            <TinyOwl color="#A78BFA" />
          </div>

          {/* Tiny owl bottom-left */}
          <div className="absolute owl-float-delay" style={{ left: "5%", top: "72%", width: 36, zIndex: 6 }}>
            <TinyOwl color="#34D399" />
          </div>

          {/* Tiny owl bottom-right */}
          <div className="absolute owl-bob" style={{ right: "5%", top: "82%", width: 38, zIndex: 6 }}>
            <TinyOwl color="#FB923C" />
          </div>

          {/* ── Floating Sparkles & Stars ──────────────────────────── */}
          <div className="absolute sparkle-float" style={{ left: "15%", top: "15%" }}>
            <Sparkle size={5} opacity={0.9} />
          </div>
          <div className="absolute sparkle-float-delay" style={{ right: "18%", top: "28%" }}>
            <Sparkle size={4} opacity={0.7} />
          </div>
          <div className="absolute sparkle-float" style={{ left: "8%", top: "55%" }}>
            <Sparkle size={3} opacity={0.6} />
          </div>
          <div className="absolute sparkle-float-delay" style={{ right: "12%", top: "68%" }}>
            <Sparkle size={6} opacity={0.8} />
          </div>
          <div className="absolute sparkle-float" style={{ left: "40%", top: "85%" }}>
            <Sparkle size={4} opacity={0.5} />
          </div>

          {/* Floating text stars */}
          <div className="absolute text-yellow-300 text-2xl sparkle-float" style={{ left: "10%", top: "24%" }}>★</div>
          <div className="absolute text-yellow-200 text-sm sparkle-float-delay" style={{ right: "22%", top: "18%" }}>★</div>
          <div className="absolute text-green-400 text-xl sparkle-float" style={{ right: "6%", top: "38%" }}>★</div>
          <div className="absolute text-purple-400 text-lg sparkle-float-delay" style={{ left: "20%", top: "78%" }}>★</div>
        </div>

        {/* ── Action Buttons Row ───────────────────────────────────── */}
        <div className="relative z-20 px-4 pt-1">
          <div className="grid grid-cols-4 gap-2">
            {actionButtons.map((btn) => (
              <button
                key={btn.label}
                className={`relative bg-gradient-to-b ${btn.color} rounded-2xl p-3 flex flex-col items-center gap-1.5 shadow-lg ${btn.glow} border border-white/5 active:scale-95 transition-transform`}
              >
                <span className="text-2xl">{btn.icon}</span>
                <span className="text-[10px] text-white/60 font-semibold tracking-wide">{btn.label}</span>
                {/* Glow rim */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Bottom Navigation ────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          {/* Nav blur backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0820] via-[#0a0820]/95 to-transparent" />
          <div className="relative flex items-center justify-around px-2 pt-2 pb-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-0.5 px-1 py-1 rounded-xl transition-all active:scale-90"
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
                <span
                  className={`text-[9px] font-semibold transition-colors ${
                    activeTab === item.id ? "text-white" : "text-white/40"
                  }`}
                >
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <div className="w-1 h-1 rounded-full bg-purple-400 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
