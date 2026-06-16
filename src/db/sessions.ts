import { db, type Phase, type Session } from "./dexie";
import { uuid } from "@/lib/uuid";
import { dayRange, lastNDays, lastNWeeks, weekRange } from "@/lib/time";

export async function recordSession(input: {
  taskId?: string;
  type: Phase;
  startedAt: number;
  endedAt: number;
  plannedDurationMs: number;
  actualDurationMs: number;
  completed: boolean;
}): Promise<Session> {
  const s: Session = { id: uuid(), ...input };
  await db.sessions.add(s);
  return s;
}

export async function totalMsForTask(
  taskId: string,
  phase: Phase = "focus",
): Promise<{ totalMs: number; count: number }> {
  let total = 0;
  let count = 0;
  await db.sessions
    .where("taskId")
    .equals(taskId)
    .each((s) => {
      if (s.type === phase && s.completed) {
        total += s.actualDurationMs;
        count += 1;
      }
    });
  return { totalMs: total, count };
}

export async function sessionsForDay(d: Date): Promise<Session[]> {
  const [start, end] = dayRange(d);
  return db.sessions
    .where("startedAt")
    .between(start, end + 1)
    .toArray();
}

export interface DailyBucket {
  date: Date;
  label: string;
  focusMs: number;
  sessions: number;
}

export async function dailyFocusBuckets(n: number): Promise<DailyBucket[]> {
  const days = lastNDays(n);
  const out: DailyBucket[] = [];
  for (const day of days) {
    const sessions = await sessionsForDay(day);
    const focus = sessions.filter((s) => s.type === "focus" && s.completed);
    out.push({
      date: day,
      label: day.toLocaleDateString(undefined, { weekday: "short" }),
      focusMs: focus.reduce((acc, s) => acc + s.actualDurationMs, 0),
      sessions: focus.length,
    });
  }
  return out;
}

export interface WeeklyBucket {
  weekStart: Date;
  label: string;
  focusMs: number;
}

export async function weeklyFocusBuckets(n: number): Promise<WeeklyBucket[]> {
  const weeks = lastNWeeks(n);
  const out: WeeklyBucket[] = [];
  for (const ws of weeks) {
    const [start, end] = weekRange(ws);
    const all = await db.sessions
      .where("startedAt")
      .between(start, end + 1)
      .toArray();
    const focusMs = all
      .filter((s) => s.type === "focus" && s.completed)
      .reduce((acc, s) => acc + s.actualDurationMs, 0);
    out.push({
      weekStart: ws,
      label: ws.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      focusMs,
    });
  }
  return out;
}

export interface TaskSlice {
  taskId: string | "untagged";
  title: string;
  focusMs: number;
}

export async function thisWeekTaskSplit(now: Date = new Date()): Promise<TaskSlice[]> {
  const [start, end] = weekRange(now);
  const sessions = await db.sessions
    .where("startedAt")
    .between(start, end + 1)
    .toArray();
  const focus = sessions.filter((s) => s.type === "focus" && s.completed);

  const map = new Map<string, number>();
  for (const s of focus) {
    const k = s.taskId ?? "untagged";
    map.set(k, (map.get(k) ?? 0) + s.actualDurationMs);
  }

  const allTasks = await db.tasks.toArray();
  const titleFor = new Map(allTasks.map((t) => [t.id, t.title]));

  return [...map.entries()]
    .map(([taskId, focusMs]) => ({
      taskId: taskId as TaskSlice["taskId"],
      title: taskId === "untagged" ? "No task" : (titleFor.get(taskId) ?? "Deleted task"),
      focusMs,
    }))
    .sort((a, b) => b.focusMs - a.focusMs);
}

export interface StatTotals {
  todayMs: number;
  weekMs: number;
  streak: number;
  totalSessions: number;
  totalMs: number;
}

export async function statTotals(now: Date = new Date()): Promise<StatTotals> {
  const all = await db.sessions.toArray();
  const focus = all.filter((s) => s.type === "focus" && s.completed);

  const [todayStart, todayEnd] = dayRange(now);
  const todayMs = focus
    .filter((s) => s.startedAt >= todayStart && s.startedAt <= todayEnd)
    .reduce((a, s) => a + s.actualDurationMs, 0);

  const [weekStart, weekEnd] = weekRange(now);
  const weekMs = focus
    .filter((s) => s.startedAt >= weekStart && s.startedAt <= weekEnd)
    .reduce((a, s) => a + s.actualDurationMs, 0);

  const totalMs = focus.reduce((a, s) => a + s.actualDurationMs, 0);

  // Streak: consecutive days (going back from today) with at least one
  // completed focus session.
  const focusDays = new Set(
    focus.map((s) => new Date(s.startedAt).toDateString()),
  );
  let streak = 0;
  const cursor = new Date(now);
  while (focusDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    todayMs,
    weekMs,
    streak,
    totalSessions: focus.length,
    totalMs,
  };
}

export async function exportData(): Promise<{
  exportedAt: number;
  tasks: unknown[];
  sessions: unknown[];
}> {
  const tasks = await db.tasks.toArray();
  const sessions = await db.sessions.toArray();
  return { exportedAt: Date.now(), tasks, sessions };
}
