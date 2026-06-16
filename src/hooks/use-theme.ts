import { useEffect } from "react";
import { useSettings } from "@/stores/settings-store";

function resolve(mode: "system" | "light" | "dark"): "light" | "dark" {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    const apply = () =>
      document.documentElement.setAttribute("data-theme", resolve(theme));
    apply();
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [theme]);
}
