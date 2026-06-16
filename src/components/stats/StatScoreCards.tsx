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
    <div className="scards">
      {items.map((it) => (
        <div key={it.label} className="scard">
          <div className="lab">{it.label}</div>
          <div className="big">
            {it.num} <small>{it.suf}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
