"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  getLessonContent,
  completeLessonAuth,
  ApiWord,
  ApiExercise,
  ApiLessonContent,
  getToken,
} from "@/lib/api";

// ── Flashcard ──────────────────────────────────────────────────────────────────
function Flashcard({ word, onKnow, onAgain }: {
  word: ApiWord;
  onKnow: () => void;
  onAgain: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Card */}
      <div
        className="relative w-full aspect-[3/2] cursor-pointer select-none"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="w-full h-full transition-transform duration-500"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a1a35] to-[#0d0d1f] border border-white/10 flex flex-col items-center justify-center gap-3 p-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs text-white/40 uppercase tracking-widest">Іспанська</span>
            <span className="text-4xl font-bold text-white text-center">{word.es}</span>
            <span className="text-xs text-white/30 mt-4">натисни щоб перекласти</span>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#122212] to-[#0d0d1f] border border-green-500/20 flex flex-col items-center justify-center gap-3 p-6"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-xs text-green-400/60 uppercase tracking-widest">Переклад</span>
            <span className="text-3xl font-bold text-white text-center">{word.uk}</span>
            <div className="mt-4 text-center">
              <p className="text-sm text-white/50 italic">{word.example}</p>
              <p className="text-xs text-white/30 mt-1">{word.exampleUk}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons — always visible, work regardless of flip state */}
      <div className="flex gap-3 w-full">
        <button
          onClick={onAgain}
          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 active:scale-95 transition-all"
        >
          🔁 Ще раз
        </button>
        <button
          onClick={onKnow}
          className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-400 active:scale-95 transition-all"
        >
          Знаю ✓
        </button>
      </div>
    </div>
  );
}

// ── Exercise ───────────────────────────────────────────────────────────────────
function ExerciseCard({ exercise, onNext }: { exercise: ApiExercise; onNext: (correct: boolean) => void }) {
  const options: string[] = JSON.parse(exercise.optionsJson);
  const [selected, setSelected] = useState<string | null>(null);

  function choose(opt: string) {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onNext(opt === exercise.answer), 1200);
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-[#1a1a35] border border-white/10 p-6 text-center">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Запитання</p>
        <p className="text-xl font-semibold text-white">{exercise.question}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map(opt => {
          let cls = "w-full py-4 px-5 rounded-xl border text-left text-sm font-medium transition-all duration-200 ";
          if (!selected) cls += "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20";
          else if (opt === exercise.answer) cls += "bg-green-500/20 border-green-500 text-green-300";
          else if (opt === selected) cls += "bg-red-500/20 border-red-500 text-red-300";
          else cls += "bg-white/5 border-white/5 text-white/30";

          return (
            <button key={opt} className={cls} onClick={() => choose(opt)}>
              {opt}
              {selected && opt === exercise.answer && " ✓"}
              {selected && opt === selected && opt !== exercise.answer && " ✗"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Video card ─────────────────────────────────────────────────────────────────
// exercise.question = YouTube video ID, exercise.answer = "" (no answer needed)
// exercise.optionsJson = JSON with { title, description }
function VideoCard({ exercise, onNext }: { exercise: ApiExercise; onNext: (correct: boolean) => void }) {
  const videoId = exercise.answer || exercise.question; // video ID stored in answer field
  const meta: { title?: string; description?: string } = (() => {
    try { return JSON.parse(exercise.optionsJson); } catch { return {}; }
  })();

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {/* Title */}
      <div className="text-center">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Відео</p>
        <h2 className="text-lg font-bold text-white">{meta.title ?? exercise.question}</h2>
        {meta.description && <p className="text-sm text-white/50 mt-1">{meta.description}</p>}
      </div>

      {/* YouTube embed */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/10"
           style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Continue button */}
      <button
        onClick={() => onNext(true)}
        className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-base hover:bg-green-400 active:scale-95 transition-all"
      >
        Продовжити ▶
      </button>
    </div>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500 rounded-full transition-all duration-500"
        style={{ width: `${total > 0 ? Math.round((current / total) * 100) : 0}%` }}
      />
    </div>
  );
}

// ── Inner component (uses useSearchParams) ─────────────────────────────────────
type Step =
  | { kind: "word"; word: ApiWord }
  | { kind: "ex"; exercise: ApiExercise };

function LessonInner() {
  const searchParams = useSearchParams();
  const lessonId = Number(searchParams.get("id") ?? "0");

  const [content, setContent] = useState<ApiLessonContent | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0); // original total for progress bar
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { window.location.href = "/login"; return; }
    if (!lessonId) { window.location.href = "/"; return; }
    getLessonContent(lessonId).then(c => {
      if (!c) { window.location.href = "/"; return; }
      setContent(c);
      const initial: Step[] = [
        ...c.words.map(w => ({ kind: "word" as const, word: w })),
        ...c.exercises.map(e => ({ kind: "ex" as const, exercise: e })),
      ];
      setSteps(initial);
      setTotalSteps(initial.length);
      setLoading(false);
    });
  }, [lessonId]);

  // "Знаю" or correct exercise → advance
  const handleNext = useCallback((correct?: boolean) => {
    if (correct === true) setCorrectCount(c => c + 1);
    setStepIndex(i => {
      const next = i + 1;
      if (next >= steps.length) {
        completeLessonAuth(lessonId);
        setDone(true);
      }
      return next;
    });
  }, [steps.length, lessonId]);

  // "Ще раз" → push current word to the end of the queue
  const handleAgain = useCallback(() => {
    setSteps(prev => {
      const current = prev[stepIndex];
      const next = [...prev];
      next.push(current); // re-add at end
      setTotalSteps(t => t + 1);
      return next;
    });
    setStepIndex(i => i + 1);
  }, [stepIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl animate-bounce">📖</div>
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (done) {
    const totalEx = steps.filter(s => s.kind === "ex").length;
    const accuracy = totalEx > 0 ? Math.round((correctCount / totalEx) * 100) : 100;
    return (
      <div className="min-h-screen bg-[#0d0d1f] flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center flex flex-col items-center gap-6">
          <div className="text-7xl">🎉</div>
          <h1 className="text-3xl font-bold text-white">Урок завершено!</h1>
          <p className="text-white/50 text-sm">{content?.lesson.title}</p>

          <div className="w-full grid grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-yellow-400">+{content?.lesson.xpReward ?? 0}</span>
              <span className="text-xs text-white/40">XP</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-green-400">{accuracy}%</span>
              <span className="text-xs text-white/40">Точність</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-blue-400">{steps.filter(s => s.kind === "word").length}</span>
              <span className="text-xs text-white/40">Слів</span>
            </div>
          </div>

          <button
            onClick={() => window.location.href = "/"}
            className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-lg hover:bg-green-400 transition-colors"
          >
            Продовжити
          </button>
        </div>
      </div>
    );
  }

  const step = steps[stepIndex];
  if (!step) return null;

  // ── Active lesson ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0d1f] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 pt-4 pb-2">
        <button
          onClick={() => window.location.href = "/"}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors text-sm"
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar current={stepIndex} total={totalSteps} />
        </div>
        <span className="text-xs text-white/40 min-w-fit">
          {stepIndex + 1} / {steps.length}
        </span>
      </div>

      {/* Lesson title */}
      <div className="px-4 pb-4">
        <p className="text-xs text-white/40 uppercase tracking-widest">
          {step.kind === "word" ? "Словник" : step.exercise.type === "video" ? "Відео" : "Вправа"} · {content?.lesson.xpReward} XP
        </p>
        <h1 className="text-lg font-bold text-white">{content?.lesson.title}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center px-4 pb-8">
        {step.kind === "word" ? (
          <Flashcard key={stepIndex} word={step.word} onKnow={() => handleNext()} onAgain={handleAgain} />
        ) : step.exercise.type === "video" ? (
          <VideoCard key={stepIndex} exercise={step.exercise} onNext={handleNext} />
        ) : (
          <ExerciseCard key={stepIndex} exercise={step.exercise} onNext={handleNext} />
        )}
      </div>
    </div>
  );
}

// ── Export (wrapped in Suspense for useSearchParams) ──────────────────────────
export default function LessonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d1f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
      </div>
    }>
      <LessonInner />
    </Suspense>
  );
}
