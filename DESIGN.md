# DESIGN.md — Pomodoro PWA

> Companion to `PLAN.md`. This file is the single source of visual truth for the app. Hand it to a design-focused Claude session (e.g. the `frontend-design` skill) and it should be able to produce on-brand, distinctive UI without further direction.

---

## 1. Product & North Star

- **Working name:** Tomato (placeholder — final name TBD)
- **Tagline:** *Focus, in slices.*
- **Who it's for:** Solo knowledge workers, students, makers who want to track focused time per task without a SaaS account.
- **Design promise:** *The whole interface is one big "now."* Whatever you're meant to be doing — focus, rest, plan — the screen makes it unmistakable in one glance.

---

## 2. Design Principles

1. **The timer is the hero.** It owns the largest visual weight on every screen it appears on. Everything else recedes.
2. **The phase changes the world.** When you switch from Focus to Break, the entire background shifts color. The app *becomes* the phase — no small badge in the corner.
3. **Calm by default, urgent only when earned.** No notification dots, no streak guilt, no red badges. Color is information, not decoration.
4. **One accent at a time.** Each surface has at most one saturated color. The phase color *is* the accent — don't layer more on top.
5. **Earn motion.** Animate phase transitions, session completion, and task-complete checks. Don't animate hover states, page mounts, or list reorders unless they communicate something.
6. **Local-first feel.** No spinners for data that lives on the device. Reads from IndexedDB are instant — render them that way.

---

## 3. Brand Identity

- **Voice:** quiet, encouraging, never gamified. Copy is sentence-case. No exclamation marks except for completion ("Nice — break time.").
- **Logo mark:** a single tomato glyph reduced to a tilted circle + leaf — readable at 16px. Built from two arcs and one triangle. Monochrome.
- **App icon (PWA):** solid tomato-red square, centered white logo mark, maskable safe area at the standard 80% radius. Generate 192, 512, and 512 maskable PNGs.
- **OG / social card:** off-white background, large left-aligned timer numerals `25:00` in `Focus` red, the wordmark beneath. No screenshot collage.

---

## 4. Color System

### Neutrals

| Token            | Light          | Dark           |
|------------------|----------------|----------------|
| `--background`   | `#FAFAF7`      | `#0F0F10`      |
| `--surface`      | `#FFFFFF`      | `#18181B`      |
| `--surface-2`    | `#F4F4F0`      | `#1F1F23`      |
| `--border`       | `#E7E5E0`      | `#27272A`      |
| `--foreground`   | `#1A1A1A`      | `#F4F4F5`      |
| `--muted-fg`     | `#6B6B6B`      | `#A1A1AA`      |

### Phase palettes

Each phase has a **dominant** color (full-bleed background when timer is the focal point) and a **soft** variant (used for surfaces and chips on neutral pages).

| Phase            | Dominant   | Soft (light bg) | Soft (dark bg) | On-color text |
|------------------|------------|-----------------|----------------|---------------|
| **Focus**        | `#BA4949`  | `#F7E8E5`       | `#3A1F1F`      | `#FFFFFF`     |
| **Short Break**  | `#38858A`  | `#E1F0F0`       | `#1A3536`      | `#FFFFFF`     |
| **Long Break**   | `#397097`  | `#E4EDF4`       | `#1B2D3D`      | `#FFFFFF`     |

Lineage: dominant hexes nod to pomofocus.io's well-known phase trio (tomato red / teal / indigo). We evolve them by adding paired soft tints for non-Timer pages so the rest of the app doesn't have to live in full-bleed color.

### Semantic

| Token          | Light       | Dark        |
|----------------|-------------|-------------|
| `--success`    | `#3E8E5A`   | `#5BB07C`   |
| `--warning`    | `#C77A2E`   | `#E0995B`   |
| `--danger`     | `#B23B3B`   | `#D26565`   |
| `--info`       | `#3565A5`   | `#6E96C7`   |

### Mapping to shadcn

Map the active phase's dominant + on-color into shadcn's `--primary` / `--primary-foreground` at runtime via a `data-phase="focus|short-break|long-break"` attribute on `<html>`. Neutrals map to `--background`, `--card`, `--border`, `--foreground`, `--muted-foreground`. Semantic tokens map 1:1.

### Contrast notes

- All dominant phase colors hit ≥ 4.5:1 against white for body, ≥ 3:1 for large display type.
- On soft phase backgrounds, body text uses `--foreground` (not the dominant color) to keep contrast.
- Verify with a contrast tool before locking; if `--warning` on light fails AA, deepen to `#A8651C`.

---

## 5. Typography

- **Display (timer numerals):** Geist Mono or JetBrains Mono — **must be tabular / monospaced** so digits don't jiggle as the seconds tick. Weight 600. Tracking -0.02em.
- **UI sans:** Inter Variable. Weights 400 (body), 500 (UI labels), 600 (headings).
- **Stat numbers in dashboards:** Geist Mono, weight 500. Lets eyes scan columns.

### Scale (rem)

| Token        | Size | Use                                  |
|--------------|------|--------------------------------------|
| `text-xs`    | 0.75 | Captions, axis labels                |
| `text-sm`    | 0.875| Secondary body, table cells          |
| `text-base`  | 1.0  | Body                                 |
| `text-lg`    | 1.125| Card titles                          |
| `text-xl`    | 1.375| Page headers                         |
| `text-2xl`   | 1.75 | Section headers                      |
| `display-sm` | 4.5  | `/` Timer when nested inside a card  |
| `display-lg` | 9.0  | `/` Timer hero numerals (desktop)    |

Timer hero shrinks to `display-sm` below 480px width. Line-height for display is always 1.0.

---

## 6. Spacing, Radius, Elevation

- **Spacing base:** 4px scale (`0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24` in Tailwind units).
- **Page gutter:** `24px` mobile, `48px` desktop. Content max-width `720px` for Timer/Settings, `960px` for Tasks/Stats.
- **Radius tokens:** `--radius-sm: 6px`, `--radius: 10px`, `--radius-lg: 16px`, `--radius-pill: 9999px`.
- **Elevation:** keep it soft and short. Two shadows only:
  - `shadow-card`: `0 1px 2px rgba(15, 15, 16, 0.04), 0 1px 1px rgba(15, 15, 16, 0.03)`
  - `shadow-pop`: `0 8px 24px rgba(15, 15, 16, 0.10), 0 2px 4px rgba(15, 15, 16, 0.04)` — used on the primary timer button when active.
- No glassmorphism, no inner shadows, no gradients (except the OG image).

---

## 7. Iconography & Illustration

- **Icon set:** Lucide. Stroke width **1.75**, size **20px** by default, **16px** in chips.
- **Active-state icons** never fill — keep the line look. Selection is communicated by background and color, not by switching to a filled glyph.
- **Empty-state illustration style:** single-line strokes on a soft phase tint background, one accent dot in the dominant phase color. ~240px wide on desktop, ~180px on mobile.
  - **No tasks yet:** an empty list with a tilted tomato resting on the top line.
  - **No history:** a horizon line with a small sun half-set in dominant color.
  - **First run:** the tomato logo at rest, gentle hand-drawn `tap to start` arrow.
- Illustrations are inline SVG so they pick up `currentColor` and respect dark mode.

---

## 8. Motion

- **Duration tokens:** `fast 120ms`, `base 200ms`, `slow 360ms`, `ceremony 800ms`.
- **Easing:** `--ease-standard: cubic-bezier(0.2, 0, 0, 1)` for entry, `--ease-emphasized: cubic-bezier(0.3, 0, 0, 1)` for phase transitions.
- **When to animate:**
  - Phase change → 360ms crossfade of the background dominant color + 200ms upward slide of the new phase pill.
  - Session completion → 800ms ceremony: timer scales to 1.04 and back, the chime plays, a soft glow expands once from the timer center.
  - Task completion check → 200ms strike-through that runs left-to-right, line color = `--success`.
  - Toasts → 200ms slide-in from bottom-right (desktop), bottom (mobile).
- **prefers-reduced-motion:** disable all transforms and the completion glow. Color transitions still happen but instant.
- **What NOT to animate:** route changes (instant), list reorders (instant), button hover (just color change), chart re-renders.

---

## 9. Component Patterns

For each component below, anatomy is described top-down; states list the visual differences.

### TimerDisplay

- Anatomy: huge tabular-mono numerals `MM:SS`, a thin progress ring (12px stroke, 320px diameter on desktop) hugging the numerals, the active task name in `text-sm` muted color just below.
- States:
  - **Idle (not started):** static numerals, ring at 100%, color = phase dominant.
  - **Running:** ring depletes counter-clockwise, no pulse.
  - **Paused:** ring stays, numerals dim to 70% opacity, pause icon overlays bottom-center at 24px.
  - **Completed:** see Motion §8.

### TimerControls

- One **primary button** + two **icon buttons** (skip / stop) flanking it at smaller weight.
- Primary button: 64px tall, full-width on mobile (max 240px), label switches between `Start` → `Pause` → `Resume`. Background = phase dominant on the soft-tint page, or on-color white pill on full-bleed Timer page. `shadow-pop` when running.
- Icon buttons: ghost style, 40px square, only show when a session is running or paused.

### SessionTypePill / Phase Tabs

- Top of the Timer route: three tabs `Focus · Short Break · Long Break`.
- Active tab: filled pill in the matching dominant color with on-color text.
- Inactive tabs: text in `--muted-fg`, no background.
- On full-bleed Timer page (dominant background fills viewport), invert: active tab is translucent white pill, inactive tabs are white at 60% opacity.

### TaskCard / TaskItem

- 64px tall row, `--surface` background, `shadow-card`, radius `--radius`.
- Left: a 16px circle (checkbox). Hover fills with `--success` at 30%.
- Middle: task title (text-base), one line of secondary metadata (text-sm muted) — `3 / 5 pomodoros · 1h 15m focused`.
- Right: per-task time pill in the soft Focus tint, mono font.
- Active task gets a 3px left border in dominant Focus color and `shadow-pop`.

### ActiveTaskPicker

- Dropdown styled like a button: dotted underline beneath the task title to invite click. No task selected → label reads "Choose a task" in `--muted-fg`.
- Menu: shadcn `DropdownMenu` styling, recent tasks at top, "Create new task…" command at bottom.

### ChartCard

- White card, `shadow-card`, `--radius-lg`.
- Header row: title (text-lg), period selector chip on the right ("Last 14 days" etc.).
- Chart body: Recharts via shadcn `Chart`. Axis labels in `text-xs` muted. Grid lines `--border` at 50%.
- Tomato red is reserved for **focused** minutes. Breaks (if shown) use the Short Break teal at 60%.

### StatScorecard

- Compact card: label (text-sm muted, uppercase, tracking 0.06em), big number (Geist Mono, `text-2xl`), delta below in success/danger color.
- 4 scorecards across desktop, 2×2 grid on mobile.

### SettingsRow

- Two-column row: label (text-base, weight 500) + helper (text-sm muted) on the left, control on the right.
- Sections separated by `--border` hairlines, not cards. Section headings use `text-sm` weight 600 uppercase, tracking 0.08em, muted color.

### AppNav

- Top bar, 56px tall, `--surface` background, hairline bottom border.
- Left: wordmark `Tomato` in Inter 600. Right: `Timer / Tasks / Stats / Settings` text links with the active one in dominant Focus color (or current phase color if a session is running). Theme toggle as a 32px ghost icon button on the far right.
- On mobile: collapses to a bottom tab bar with the same 4 destinations + icons; wordmark stays at the top.

### ThemeToggle

- A single icon button cycling sun → moon → monitor (system). Tooltip names the current mode. Stays neutral — never picks up phase color.

### InstallPrompt

- Sticky bottom-right card on desktop, full-width bottom sheet on mobile, only appears after `beforeinstallprompt` fires AND the user has completed at least 1 focus session.
- Copy: "Install Tomato — your timer, ready in one tap." Two buttons: `Install` (primary, focus color), `Not now` (ghost). Dismissal persists in localStorage for 14 days.

### UpdateToast

- Sonner toast, bottom-right, persists until acted on. Copy: "A new version is ready." Action: `Reload`. Dismiss available.

---

## 10. Page Designs

### `/` Timer (home)

Two presentation modes — pick at runtime based on **session state**:

- **Idle / not started** → use **soft-tint mode**: regular neutral page, phase tabs at top, timer in a centered card with phase dominant as accent on the primary button and progress ring. Tasks-today summary visible below the card.
- **Running / paused** → use **full-bleed mode**: entire viewport background = current phase dominant color. White wordmark top-left. Phase tabs become translucent. Timer numerals in white. Active task name in white at 80%. Only the primary control + skip + stop are visible. Feels like the room dims around the work.

Wireframe (running, mobile):

```
┌───────────────────────────────┐
│ Tomato                        │
│                               │
│   Focus  · S.Break · L.Break  │  ← translucent pills
│                               │
│                               │
│          24:37                │  ← display-lg, white
│      ──────────────           │  ← progress arc
│                               │
│       Write the spec          │  ← active task
│                               │
│      ┌─────────────┐          │
│      │    Pause    │          │  ← white pill button
│      └─────────────┘          │
│        ⤼      ◼               │  ← skip, stop
└───────────────────────────────┘
   background: #BA4949 (Focus)
```

Phase transition (e.g., Focus → Short Break): 360ms crossfade of the background; the timer numerals and pill button retint together.

### `/tasks`

- Page header: `Tasks` (text-2xl), right-aligned "+ New task" primary button (phase Focus color).
- List: stacked TaskCards, 8px gap.
- Filter row above the list: `Active | Archived | All` segmented control. Sort by Recent / Most focused.
- Empty state: illustration (tomato resting on empty list lines), copy "No tasks yet — add one to get started," primary "+ New task."
- Editing a task opens a side sheet (desktop) or full-screen sheet (mobile), not a modal — so the list stays visible.

### `/stats`

- Top row: 4 StatScorecards — Today (focus minutes), This week, Current streak, All-time hours.
- Below: two ChartCards side-by-side on desktop (stacked on mobile):
  - Daily focused minutes — bar chart, last 14 days.
  - Weekly trend — line chart, last 8 weeks.
- Full-width ChartCard below: Per-task split, donut chart for the current week.
- Empty state: friendly horizon illustration, copy "Finish your first focus session to see your stats."

### `/settings`

Sections in this order, separated by hairlines:

1. **Timer durations** — three numeric steppers (Focus / Short / Long break), and "Long break every N sessions" stepper.
2. **Auto-start** — two switches: "Auto-start breaks", "Auto-start pomodoros".
3. **Notifications & sound** — switch for browser notifications (prompts on first enable), switch for chime, chime preview button.
4. **Appearance** — theme radio (System / Light / Dark).
5. **Data** — `Export JSON`, `Clear all data` (destructive — confirm dialog).

Form rhythm: 16px vertical between rows within a section, 32px between sections.

---

## 11. States

- **Empty:** see illustrations in §7 and per-page notes above. Always pair illustration + 1-line headline + 1 primary action.
- **Loading:** avoid spinners. For chart re-renders (when filter changes), show a 1px linear progress sliver under the card header for ≤ 250ms.
- **Error:** inline within the affected card. Headline `Something broke`, helper `Try reloading. Your data is safe on this device.` Action `Reload`.
- **Offline indicator:** when navigator reports offline, show a small `Offline · saving locally` chip at the top of `AppNav` in `--muted-fg`. Disappears on reconnect.
- **Install prompt:** see InstallPrompt in §9.
- **Update toast:** see UpdateToast in §9.

---

## 12. Accessibility

- **Color contrast:** every dominant phase color paired with white meets AA for large text (≥ 3:1) and AA for body where used. Re-verify after any palette change.
- **Focus rings:** 2px solid `--foreground` at 80% opacity, 2px offset, on every interactive element. Never remove. On full-bleed Timer, ring is white.
- **Keyboard shortcuts:**
  - `Space` — start / pause the active timer (only when not focused in an input).
  - `S` — skip current phase.
  - `Esc` — stop and discard the current session (confirm dialog).
  - `1 / 2 / 3` — switch to Focus / Short Break / Long Break.
  - `?` — open shortcut cheat sheet.
- **Reduced motion:** see §8.
- **Screen reader:** phase changes announce via `aria-live="polite"`: "Focus session started — 25 minutes." Timer numerals are *not* in a live region (would be noisy); use `aria-label` on the timer container that updates each minute.
- **Touch targets:** minimum 44×44px for interactive controls.

---

## 13. PWA Surfaces

- **App icon:** see §3. Generate 192, 512, 512-maskable.
- **theme-color meta tag:** set dynamically to the current phase's dominant color so the browser chrome (Android status bar, iOS standalone) matches the app.
- **Splash:** background = `--background` (light) / `#0F0F10` (dark), logo mark centered. Vite-plugin-pwa generates these.
- **Manifest:** `display: standalone`, `start_url: "/"`, `orientation: portrait-primary`, `categories: ["productivity"]`, name `Tomato`, short_name `Tomato`.
- **Install card copy:** see InstallPrompt in §9.

---

## 14. References

- **[pomofocus.io](https://pomofocus.io)** — the source of our three phase hex anchors and the full-bleed-color-per-phase idea. Borrow: the immediate phase legibility, the tab-bar phase switcher, the monospaced timer. Evolve: we add a soft-tint mode for non-timer pages so Tasks/Stats/Settings can breathe in neutral, and we treat motion + empty states as first-class instead of bare HTML.
- **Things 3** — the discipline of soft neutrals + restrained accent + checkbox-led list rhythm. Look at: per-task metadata density, the segmented top filter.
- **Linear** — quiet motion, type rhythm, focus rings done right. Look at: command-menu copy tone, the way active elements pick up a single accent.
- **iA Writer** — typography hierarchy and restraint. Look at: keeping headings small but distinct via weight + tracking instead of size.

---

## Handoff notes (for the design Claude)

- All components named here map 1:1 to files under `src/components/` in `PLAN.md`. Don't rename.
- The four routes (`/`, `/tasks`, `/stats`, `/settings`) come from `PLAN.md` §Routes & UX — keep navigation in that order.
- shadcn primitives to lean on: `Button`, `Card`, `Tabs`, `Switch`, `Select`, `DropdownMenu`, `Dialog`, `Sheet`, `Sonner`, `Chart`, `Progress`, `Separator`, `Tooltip`. If you need a component that isn't shadcn-generated, raise it before building.
- When in doubt, **remove**, don't add. The brief is calm.
