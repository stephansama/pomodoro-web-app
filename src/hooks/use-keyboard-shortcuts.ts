import { useEffect } from "react";
import { useTimer } from "@/stores/timer-store";
import { useSettings } from "@/stores/settings-store";
import { selectPhase, skipPhase, startPhase, stopTimer } from "@/hooks/use-timer";
import type { Phase } from "@/db/dexie";

function isTypingInForm(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    t.isContentEditable === true
  );
}

const PHASE_BY_KEY: Record<string, Phase> = {
  "1": "focus",
  "2": "short",
  "3": "long",
};

export function useKeyboardShortcuts(onHelp: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingInForm(e)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.code === "Space") {
        e.preventDefault();
        const t = useTimer.getState();
        if (t.status === "idle") {
          const planned =
            t.phase === "focus"
              ? useSettings.getState().focusMin * 60_000
              : t.phase === "short"
                ? useSettings.getState().shortBreakMin * 60_000
                : useSettings.getState().longBreakMin * 60_000;
          useTimer.setState({
            status: "running",
            startedAt: Date.now(),
            plannedMs: planned,
            pausedAt: null,
            accumulatedPausedMs: 0,
          });
        } else if (t.status === "running") {
          useTimer.getState().pause();
        } else {
          useTimer.getState().resume();
        }
        return;
      }

      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        void skipPhase();
        return;
      }

      if (e.key === "Escape") {
        const t = useTimer.getState();
        if (t.status !== "idle") {
          e.preventDefault();
          if (confirm("Stop and discard this session?")) void stopTimer(false);
        }
        return;
      }

      const target = PHASE_BY_KEY[e.key];
      if (target) {
        e.preventDefault();
        if (useTimer.getState().status === "idle") selectPhase(target);
        else startPhase(target);
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        onHelp();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onHelp]);
}
