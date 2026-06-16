import IconMonitor from "~icons/mdi/monitor";
import IconMoon from "~icons/mdi/weather-night";
import IconSun from "~icons/mdi/weather-sunny";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings, type ThemeMode } from "@/stores/settings-store";

const NEXT: Record<ThemeMode, ThemeMode> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const LABEL: Record<ThemeMode, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

export function ThemeToggle() {
  const theme = useSettings((s) => s.theme);
  const set = useSettings((s) => s.set);
  const Icon =
    theme === "light" ? IconSun : theme === "dark" ? IconMoon : IconMonitor;
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="iconbtn"
            onClick={() => set("theme", NEXT[theme])}
            aria-label={LABEL[theme]}
          >
            <Icon width={19} height={19} />
          </button>
        </TooltipTrigger>
        <TooltipContent>{LABEL[theme]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
