import {
  endOfDay,
  endOfWeek,
  format,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";

export const MIN = 60_000;

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function formatDurationShort(ms: number): string {
  const totalMin = Math.round(ms / MIN);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatHoursLong(ms: number): string {
  const totalMin = Math.round(ms / MIN);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

export function dayBucketLabel(d: Date): string {
  return format(d, "MMM d");
}

export function weekBucketLabel(d: Date): string {
  return format(d, "MMM d");
}

export function dayRange(d: Date): [number, number] {
  return [startOfDay(d).getTime(), endOfDay(d).getTime()];
}

export function weekRange(d: Date): [number, number] {
  return [
    startOfWeek(d, { weekStartsOn: 1 }).getTime(),
    endOfWeek(d, { weekStartsOn: 1 }).getTime(),
  ];
}

export function lastNDays(n: number, now: Date = new Date()): Date[] {
  const out: Date[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(startOfDay(subDays(now, i)));
  return out;
}

export function lastNWeeks(n: number, now: Date = new Date()): Date[] {
  const out: Date[] = [];
  const thisWeek = startOfWeek(now, { weekStartsOn: 1 });
  for (let i = n - 1; i >= 0; i--) {
    out.push(new Date(thisWeek.getTime() - i * 7 * 24 * 60 * 60 * 1000));
  }
  return out;
}
