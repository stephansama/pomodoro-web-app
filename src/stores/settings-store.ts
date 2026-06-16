import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";
export type ThemePalette = "default" | "catppuccin";

export interface SettingsState {
  focusMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  theme: ThemeMode;
  themePalette: ThemePalette;
  set: <K extends keyof Omit<SettingsState, "set">>(
    key: K,
    value: SettingsState[K],
  ) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      focusMin: 25,
      shortBreakMin: 5,
      longBreakMin: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      notificationsEnabled: false,
      soundEnabled: true,
      theme: "system",
      themePalette: "default",
      set: (key, value) => set({ [key]: value } as Partial<SettingsState>),
    }),
    {
      name: "tomato-settings",
      version: 2,
      migrate: (persisted, version) => {
        const s = (persisted ?? {}) as Partial<SettingsState>;
        if (version < 2 && !s.themePalette) s.themePalette = "default";
        return s as SettingsState;
      },
    },
  ),
);
