import { useEffect } from "react";
import { useTimer } from "@/stores/timer-store";

const THEME_COLOR_BY_PHASE = {
  focus: "#BA4949",
  short: "#38858A",
  long: "#397097",
} as const;

export function usePhase() {
  const phase = useTimer((s) => s.phase);

  useEffect(() => {
    document.documentElement.setAttribute("data-phase", phase);
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (meta) meta.content = THEME_COLOR_BY_PHASE[phase];
  }, [phase]);
}
