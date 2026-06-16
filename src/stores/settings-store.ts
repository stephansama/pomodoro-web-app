import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";

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
      set: (key, value) => set({ [key]: value } as Partial<SettingsState>),
    }),
    {
      name: "tomato-settings",
      version: 1,
    },
  ),
);
