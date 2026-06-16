import { useLiveQuery } from "dexie-react-hooks";
import { statTotals } from "@/db/sessions";

function formatMin(ms: number): { num: string; suf: string } {
  const min = Math.round(ms / 60_000);
  if (min < 60) return { num: String(min), suf: "min" };
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m
    ? { num: String(h), suf: `h ${m}m` }
    : { num: String(h), suf: "h" };
}

export function StatScoreCards() {
  const totals = useLiveQuery(() => statTotals(), [], undefined);

  const today = formatMin(totals?.todayMs ?? 0);
  const week = formatMin(totals?.weekMs ?? 0);
  const allTime = formatMin(totals?.totalMs ?? 0);

  const items: Array<{ label: string; num: string; suf: string }> = [
    { label: "Today", num: today.num, suf: today.suf },
    { label: "This week", num: week.num, suf: week.suf },
    {
      label: "Current streak",
      num: String(totals?.streak ?? 0),
      suf: totals?.streak === 1 ? "day" : "days",
    },
    {
      label: "All-time sessions",
      num: String(totals?.totalSessions ?? 0),
      suf: `· ${allTime.num}${allTime.suf}`,
    },
  ];

  return (
    <div className="mb-[18px] grid grid-cols-4 gap-4 max-[680px]:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-(--radius) bg-(--surface) px-5 py-[18px] shadow-(--shadow-card)"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.06em] text-(--muted-fg)">
            {it.label}
          </div>
          <div className="mt-1.5 font-mono text-[34px] font-semibold leading-none">
            {it.num} <small className="text-base text-(--muted-fg)">{it.suf}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
