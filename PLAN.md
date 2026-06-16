# Greenfield: Local-First Pomodoro PWA

## Context

The repo at `/Users/stephanrandle/Developer/pomodoro-web-app` is empty. We need to scaffold a fully client-side Pomodoro web app that:
- Runs as an installable PWA (offline-capable, works on desktop + mobile).
- Lets users manage a task list and link Pomodoro sessions to tasks.
- Tracks time spent per task and surfaces usage with charts/graphs.
- Stores **all** state locally on the user's device — no backend, no auth.

Stack chosen with the user:
- **TanStack Router** (file-based routes) on **Vite + React + TypeScript** (SPA, no SSR).
- **Tailwind CSS v4** + **shadcn/ui** for components and theming (system + manual dark mode).
- **Dexie** (IndexedDB) for tasks and session history.
- **Zustand** for transient timer state + persisted settings.
- **vite-plugin-pwa** for service worker, manifest, install prompt.
- **shadcn Chart** (Recharts) for the stats dashboard.

## Project layout

```
pomodoro-web-app/
├── index.html
├── vite.config.ts            # Vite + TanStack Router plugin + vite-plugin-pwa
├── tsconfig.json
├── components.json           # shadcn config
├── package.json
├── public/
│   ├── icons/                # PWA icons (192, 512, maskable)
│   └── sounds/               # session-end chime
└── src/
    ├── main.tsx              # Router + ThemeProvider bootstrap
    ├── styles.css            # Tailwind v4 + shadcn tokens
    ├── routes/               # TanStack file-based routes
    │   ├── __root.tsx        # Shell: nav, theme, toaster
    │   ├── index.tsx         # Timer (home)
    │   ├── tasks.tsx
    │   ├── stats.tsx
    │   └── settings.tsx
    ├── components/
    │   ├── ui/               # shadcn-generated primitives
    │   ├── timer/            # TimerDisplay, TimerControls, SessionTypePill
    │   ├── tasks/            # TaskList, TaskItem, TaskForm, ActiveTaskPicker
    │   ├── stats/            # DailyFocusChart, WeeklyChart, PerTaskChart, StreakCard
    │   ├── layout/           # AppNav, ThemeToggle
    │   └── pwa/              # InstallPrompt, UpdateToast
    ├── db/
    │   ├── dexie.ts          # Dexie schema + db singleton
    │   ├── tasks.ts          # task CRUD + queries
    │   └── sessions.ts       # session CRUD + aggregations (per-task totals, daily/weekly rollups)
    ├── stores/
    │   ├── timer-store.ts    # Zustand: phase, startedAt, durationMs, activeTaskId, paused
    │   └── settings-store.ts # Zustand persist (localStorage): durations, auto-start, sound, notifications, theme
    ├── hooks/
    │   ├── use-timer.ts      # timestamp-based countdown + transition logic
    │   ├── use-notifications.ts
    │   └── use-pwa-update.ts
    └── lib/
        ├── utils.ts          # shadcn cn() helper
        ├── time.ts           # formatters, date bucketing (day/week)
        └── audio.ts          # chime playback
```

## Data model (Dexie)

```ts
// db/dexie.ts
Task {
  id: string            // uuid
  title: string
  notes?: string
  estimatedPomodoros?: number
  createdAt: number     // ms epoch
  archivedAt?: number
}

Session {
  id: string
  taskId?: string                          // null for break sessions or untagged focus
  type: 'focus' | 'short_break' | 'long_break'
  startedAt: number
  endedAt: number                           // set when completed/aborted
  plannedDurationMs: number
  actualDurationMs: number                  // for partial sessions if user stops early
  completed: boolean                        // true only if ran to zero
}
// Indexes: tasks.createdAt, tasks.archivedAt
//          sessions.startedAt, sessions.taskId, [type+startedAt]
```

Per-task totals and daily/weekly rollups are computed on-demand from `sessions` via Dexie queries in `db/sessions.ts` (no denormalized counters — small data, simple queries).

## Timer design

Timestamp-based, not interval-based — survives tab throttling, sleep, refresh:

- `timer-store` holds `{ phase, startedAt, plannedDurationMs, pausedAt?, activeTaskId }` and is persisted to `localStorage` so a refresh resumes the running session.
- `use-timer` computes `remaining = plannedDurationMs - (Date.now() - startedAt - totalPausedMs)` on a 250ms tick.
- On completion: write a `Session` row, fire notification + chime, advance phase per settings (auto-start breaks / pomodoros), increment focus-count toward long-break interval.
- Stopping early writes a `Session` with `completed: false` and `actualDurationMs`.

## Routes & UX

- **`/` Timer** — large countdown, phase pill (Focus / Short Break / Long Break), Start/Pause/Skip/Stop, active-task picker (dropdown of non-archived tasks + "no task"), today's completed-focus count.
- **`/tasks`** — CRUD list. Each row shows total focused time (sum of completed focus sessions) and session count. Archive (soft delete) rather than hard delete to preserve history.
- **`/stats`** — dashboard of charts (shadcn Chart / Recharts):
  - Daily focused minutes — last 14 days, bar chart.
  - Weekly trend — last 8 weeks, line chart.
  - Per-task split — donut for current week's focus time.
  - Streak / totals scorecards (current streak, all-time focus hours, sessions completed).
- **`/settings`** — durations (focus/short/long, long-break interval), auto-start toggles, sound on/off, notifications enable, theme (system/light/dark), export/clear data.

## PWA

- `vite-plugin-pwa` with `registerType: 'autoUpdate'`, workbox precaching, runtime caching for fonts.
- Web app manifest: name, theme color, icons (192/512/maskable), `display: standalone`, `start_url: /`.
- `components/pwa/UpdateToast.tsx` listens for new SW and prompts reload.
- `components/pwa/InstallPrompt.tsx` captures `beforeinstallprompt` and shows a dismissible CTA.

## Theming

shadcn's standard pattern: a `ThemeProvider` in `__root.tsx` that reads `settings-store.theme` (`'system' | 'light' | 'dark'`), syncs to `<html class>` and `prefers-color-scheme`. `ThemeToggle` in the nav.

## Setup steps (when implementing)

> **Package manager:** use **pnpm** throughout — never `npm` or `npx`. Use `pnpm dlx` for one-off CLI invocations.

1. `pnpm create vite . --template react-ts`, then add the TanStack Router Vite plugin and switch to file-based routes.
2. Install Tailwind v4 + shadcn (`pnpm dlx shadcn@latest init`), generate primitives we'll use: `button`, `card`, `input`, `label`, `dialog`, `dropdown-menu`, `select`, `switch`, `tabs`, `sonner` (toasts), `chart`, `progress`, `separator`, `tooltip`.
3. Add deps with `pnpm add`: `@tanstack/react-router`, `dexie`, `dexie-react-hooks`, `zustand`, `vite-plugin-pwa`, `workbox-window`, `recharts` (peer of shadcn chart), `date-fns`, `uuid`. Dev: `@tanstack/router-plugin`, `@types/uuid`.
4. Wire `vite-plugin-pwa` in `vite.config.ts` + generate icons under `public/icons/`.
5. Build Dexie schema and query helpers in `db/`.
6. Build `timer-store`, `settings-store`, and `use-timer` — unit-test the countdown math.
7. Build routes in order: Timer → Tasks → Settings → Stats.
8. Add notifications + chime, then PWA install/update UI last.

## Verification

- `pnpm dev`, open in browser:
  - Start a 25-min focus session with a selected task, fast-forward by temporarily lowering the duration to 5s in settings, confirm: session ends, notification + chime fire, a `Session` row appears (DevTools → Application → IndexedDB), the task's total time increases on `/tasks`.
  - Refresh mid-session — timer resumes with correct remaining time.
  - Toggle theme — `<html>` class flips, persists across reload.
  - DevTools → Application → Manifest: installable, icons present. Lighthouse PWA audit ≥ 90.
  - Offline: in DevTools throttle to Offline, reload — app shell loads, timer + tasks work, new sessions persist.
  - `/stats` shows non-empty charts after a few sessions.
- `pnpm build && pnpm preview` — confirm SW registers and precaches.
