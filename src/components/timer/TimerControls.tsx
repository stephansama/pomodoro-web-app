import { useTimer } from "@/stores/timer-store";
import { useSettings } from "@/stores/settings-store";
import { skipPhase, stopTimer } from "@/hooks/use-timer";
import { Button } from "@/components/ui/button";
import { Pause, Play, SkipForward, Square } from "lucide-react";

function plannedFor(
  phase: ReturnType<typeof useTimer.getState>["phase"],
  s: ReturnType<typeof useSettings.getState>,
) {
  if (phase === "focus") return s.focusMin * 60_000;
  if (phase === "short") return s.shortBreakMin * 60_000;
  return s.longBreakMin * 60_000;
}

export function TimerControls({ fullbleed }: { fullbleed: boolean }) {
  const status = useTimer((s) => s.status);

  return (
    <div className="herobtns">
      <Button
        variant={fullbleed ? "onwhite" : "primary"}
        running={status === "running"}
        onClick={() => {
          const t = useTimer.getState();
          if (t.status === "idle") {
            const plannedMs = plannedFor(t.phase, useSettings.getState());
            t.start(plannedMs);
          } else if (t.status === "running") {
            t.pause();
          } else {
            t.resume();
          }
        }}
      >
        {status === "running" ? (
          <>
            <Pause size={18} /> Pause
          </>
        ) : status === "paused" ? (
          <>
            <Play size={18} /> Resume
          </>
        ) : (
          <>
            <Play size={18} /> Start
          </>
        )}
      </Button>

      {status !== "idle" && (
        <div className="ctrlrow" role="group" aria-label="Session controls">
          <button
            type="button"
            className="ctrlbtn"
            onClick={() => void skipPhase()}
            aria-label="Skip phase"
            title="Skip"
          >
            <SkipForward size={20} />
          </button>
          <button
            type="button"
            className="ctrlbtn"
            onClick={() => {
              if (confirm("Stop and discard this session?"))
                void stopTimer(false);
            }}
            aria-label="Stop and discard"
            title="Stop"
          >
            <Square size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
