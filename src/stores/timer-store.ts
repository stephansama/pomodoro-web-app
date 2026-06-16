import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Phase } from "@/db/dexie";

export type TimerStatus = "idle" | "running" | "paused";

export interface TimerState {
  phase: Phase;
  status: TimerStatus;
  startedAt: number | null;
  plannedMs: number;
  pausedAt: number | null;
  accumulatedPausedMs: number;
  activeTaskId: string | null;
  focusStreak: number; // completed focus sessions since the last long break

  setPhase: (phase: Phase) => void;
  setActiveTask: (taskId: string | null) => void;
  start: (plannedMs: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: (phase?: Phase) => void;
  bumpStreak: () => void;
  resetStreak: () => void;
}

const initial = {
  phase: "focus" as Phase,
  status: "idle" as TimerStatus,
  startedAt: null as number | null,
  plannedMs: 25 * 60_000,
  pausedAt: null as number | null,
  accumulatedPausedMs: 0,
  activeTaskId: null as string | null,
  focusStreak: 0,
};

export const useTimer = create<TimerState>()(
  persist(
    (set, get) => ({
      ...initial,
      setPhase: (phase) => set({ phase }),
      setActiveTask: (taskId) => set({ activeTaskId: taskId }),
      start: (plannedMs) =>
        set({
          status: "running",
          startedAt: Date.now(),
          plannedMs,
          pausedAt: null,
          accumulatedPausedMs: 0,
        }),
      pause: () => {
        if (get().status !== "running") return;
        set({ status: "paused", pausedAt: Date.now() });
      },
      resume: () => {
        const s = get();
        if (s.status !== "paused" || s.pausedAt == null) return;
        set({
          status: "running",
          accumulatedPausedMs:
            s.accumulatedPausedMs + (Date.now() - s.pausedAt),
          pausedAt: null,
        });
      },
      stop: () =>
        set({
          status: "idle",
          startedAt: null,
          pausedAt: null,
          accumulatedPausedMs: 0,
        }),
      reset: (phase) =>
        set({
          ...initial,
          phase: phase ?? get().phase,
          activeTaskId: get().activeTaskId,
          focusStreak: get().focusStreak,
        }),
      bumpStreak: () => set({ focusStreak: get().focusStreak + 1 }),
      resetStreak: () => set({ focusStreak: 0 }),
    }),
    {
      name: "tomato-timer",
      version: 1,
      partialize: (state) => ({
        phase: state.phase,
        status: state.status,
        startedAt: state.startedAt,
        plannedMs: state.plannedMs,
        pausedAt: state.pausedAt,
        accumulatedPausedMs: state.accumulatedPausedMs,
        activeTaskId: state.activeTaskId,
        focusStreak: state.focusStreak,
      }),
    },
  ),
);

export function remainingMs(s: TimerState): number {
  if (s.status === "idle" || s.startedAt == null) return s.plannedMs;
  const pausedExtra =
    s.status === "paused" && s.pausedAt != null
      ? Date.now() - s.pausedAt
      : 0;
  const elapsed = Date.now() - s.startedAt - s.accumulatedPausedMs - pausedExtra;
  return Math.max(0, s.plannedMs - elapsed);
}
