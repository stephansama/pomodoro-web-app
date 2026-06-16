import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PhaseTabs } from "@/components/timer/PhaseTabs";
import { TimerRing } from "@/components/timer/TimerRing";
import { TimerControls } from "@/components/timer/TimerControls";
import { ActiveTaskPicker } from "@/components/timer/ActiveTaskPicker";
import { TodayRow } from "@/components/timer/TodayRow";
import { useRemaining } from "@/hooks/use-timer";
import { useTimer } from "@/stores/timer-store";
import { useSettings } from "@/stores/settings-store";

export const Route = createFileRoute("/")({ component: TimerPage });

function TimerPage() {
  const remaining = useRemaining();
  const status = useTimer((s) => s.status);
  const phase = useTimer((s) => s.phase);
  const plannedMs = useTimer((s) => s.plannedMs);
  const settings = useSettings();

  // When idle, mirror the configured duration into plannedMs so the ring
  // shows the correct starting value when phase or settings change.
  useEffect(() => {
    if (status !== "idle") return;
    const expected =
      phase === "focus"
        ? settings.focusMin * 60_000
        : phase === "short"
          ? settings.shortBreakMin * 60_000
          : settings.longBreakMin * 60_000;
    if (expected !== plannedMs) useTimer.setState({ plannedMs: expected });
  }, [
    status,
    phase,
    plannedMs,
    settings.focusMin,
    settings.shortBreakMin,
    settings.longBreakMin,
  ]);

  const fullbleed = status !== "idle";

  return (
    <div className="container narrow">
      <section className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-[clamp(24px,4vh,40px)] pt-[clamp(6px,3vh,30px)] max-md:gap-[clamp(18px,3vh,32px)] max-md:pt-0">
        <PhaseTabs />
        <TimerRing remainingMs={remaining} fullbleed={fullbleed} />
        <TimerControls fullbleed={fullbleed} />
        <ActiveTaskPicker />
        <TodayRow />
      </section>
    </div>
  );
}
