import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTimer, remainingMs } from "@/stores/timer-store";
import { useSettings } from "@/stores/settings-store";
import { recordSession } from "@/db/sessions";
import { playChime } from "@/lib/audio";
import { useNotifications } from "@/hooks/use-notifications";
import type { Phase } from "@/db/dexie";

const TICK_MS = 250;

function plannedFor(phase: Phase, s: ReturnType<typeof useSettings.getState>) {
  if (phase === "focus") return s.focusMin * 60_000;
  if (phase === "short") return s.shortBreakMin * 60_000;
  return s.longBreakMin * 60_000;
}

function nextPhaseAfter(
  finished: Phase,
  focusStreak: number,
  longBreakInterval: number,
): Phase {
  if (finished !== "focus") return "focus";
  return focusStreak >= longBreakInterval ? "long" : "short";
}

/** Global heartbeat — mounted once in __root. Records completions, fires
 * notifications, advances phases. Does not drive any UI re-render. */
export function useTimerHeartbeat() {
  const { notify } = useNotifications();
  const handlingRef = useRef(false);

  const handleCompletion = useCallback(async () => {
    if (handlingRef.current) return;
    const t = useTimer.getState();
    if (t.status !== "running" || t.startedAt == null) return;
    handlingRef.current = true;

    try {
      const settings = useSettings.getState();
      const endedAt = Date.now();
      const actualDurationMs = Math.min(
        t.plannedMs,
        endedAt - t.startedAt - t.accumulatedPausedMs,
      );

      await recordSession({
        taskId: t.activeTaskId ?? undefined,
        type: t.phase,
        startedAt: t.startedAt,
        endedAt,
        plannedDurationMs: t.plannedMs,
        actualDurationMs,
        completed: true,
      });

      if (settings.soundEnabled) void playChime();

      const finishedPhase = t.phase;
      let next: Phase;
      if (finishedPhase === "focus") {
        const nextStreak = t.focusStreak + 1;
        next = nextStreak >= settings.longBreakInterval ? "long" : "short";
        useTimer.setState({ focusStreak: next === "long" ? 0 : nextStreak });
      } else {
        next = "focus";
      }

      const nextPlanned = plannedFor(next, settings);
      const autoStart =
        next === "focus"
          ? settings.autoStartPomodoros
          : settings.autoStartBreaks;

      useTimer.setState({
        phase: next,
        status: autoStart ? "running" : "idle",
        startedAt: autoStart ? Date.now() : null,
        plannedMs: nextPlanned,
        pausedAt: null,
        accumulatedPausedMs: 0,
      });

      toast(
        finishedPhase === "focus"
          ? "Nice — break time."
          : "Break done. Ready when you are.",
      );
      notify(
        finishedPhase === "focus" ? "Focus session complete" : "Break complete",
        finishedPhase === "focus"
          ? "Time for a break."
          : "Back to focus when you're ready.",
      );
    } finally {
      handlingRef.current = false;
    }
  }, [notify]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const s = useTimer.getState();
      if (s.status === "running" && remainingMs(s) <= 0) {
        void handleCompletion();
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [handleCompletion]);
}

/** Lightweight tick for UI display. Returns ms remaining, updated every
 * 250ms. Mount on routes that show the running timer. */
export function useRemaining(): number {
  const status = useTimer((s) => s.status);
  const plannedMs = useTimer((s) => s.plannedMs);
  const [val, setVal] = useState<number>(() =>
    remainingMs(useTimer.getState()),
  );

  useEffect(() => {
    if (status === "idle") {
      setVal(plannedMs);
      return;
    }
    let raf = 0;
    const loop = () => {
      setVal(remainingMs(useTimer.getState()));
      raf = window.setTimeout(loop, TICK_MS) as unknown as number;
    };
    loop();
    return () => window.clearTimeout(raf);
  }, [status, plannedMs]);

  return val;
}

// Imperative helpers callable from any component without re-renders.

export function startPhase(phase: Phase) {
  const settings = useSettings.getState();
  const planned = plannedFor(phase, settings);
  useTimer.setState({
    phase,
    status: "running",
    startedAt: Date.now(),
    plannedMs: planned,
    pausedAt: null,
    accumulatedPausedMs: 0,
  });
}

export function selectPhase(phase: Phase) {
  const settings = useSettings.getState();
  useTimer.setState({
    phase,
    status: "idle",
    startedAt: null,
    plannedMs: plannedFor(phase, settings),
    pausedAt: null,
    accumulatedPausedMs: 0,
  });
}

export async function stopTimer(completed = false): Promise<void> {
  const t = useTimer.getState();
  if (t.status === "idle" || t.startedAt == null) return;
  const endedAt = Date.now();
  const pausedExtra =
    t.status === "paused" && t.pausedAt != null ? endedAt - t.pausedAt : 0;
  const actualDurationMs = Math.max(
    0,
    endedAt - t.startedAt - t.accumulatedPausedMs - pausedExtra,
  );

  if (actualDurationMs > 1500) {
    await recordSession({
      taskId: t.activeTaskId ?? undefined,
      type: t.phase,
      startedAt: t.startedAt,
      endedAt,
      plannedDurationMs: t.plannedMs,
      actualDurationMs,
      completed,
    });
  }
  useTimer.setState({
    status: "idle",
    startedAt: null,
    pausedAt: null,
    accumulatedPausedMs: 0,
  });
}

export async function skipPhase(): Promise<void> {
  const t = useTimer.getState();
  const settings = useSettings.getState();
  await stopTimer(false);
  const next = nextPhaseAfter(t.phase, t.focusStreak, settings.longBreakInterval);
  if (t.phase === "focus" && next === "long") {
    useTimer.setState({ focusStreak: 0 });
  }
  selectPhase(next);
}
