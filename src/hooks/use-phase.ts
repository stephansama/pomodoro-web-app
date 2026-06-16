import { useEffect } from "react";
import { useTimer } from "@/stores/timer-store";
import { useSettings } from "@/stores/settings-store";

export function usePhase() {
  const phase = useTimer((s) => s.phase);
  // We also subscribe to theme + palette so the meta tag re-reads the resolved
  // --accent whenever the palette swaps.
  const theme = useSettings((s) => s.theme);
  const palette = useSettings((s) => s.themePalette);

  useEffect(() => {
    document.documentElement.setAttribute("data-phase", phase);
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!meta) return;
    // Read the resolved --accent from the now-updated computed style so we
    // pick up Catppuccin Latte/Mocha variants without a hardcoded lookup.
    requestAnimationFrame(() => {
      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      if (accent) meta.content = accent;
    });
  }, [phase, theme, palette]);
}
