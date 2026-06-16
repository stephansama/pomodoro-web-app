import { useLiveQuery } from "dexie-react-hooks";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dailyFocusBuckets } from "@/db/sessions";

export function DailyBarsChart() {
  const data =
    useLiveQuery(async () => {
      const buckets = await dailyFocusBuckets(14);
      return buckets.map((b) => ({
        label: b.label,
        date: b.date.getTime(),
        minutes: Math.round(b.focusMs / 60_000),
      }));
    }, []) ?? [];

  return (
    <div className="chartcard">
      <div className="ch">
        <span className="t">Daily focus</span>
        <span className="c">Last 14 days</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 6, right: 8, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-fg)" }}
            interval={1}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-fg)" }}
            width={36}
            allowDecimals={false}
            tickFormatter={(v: number) => (v ? `${v}m` : "")}
          />
          <Tooltip
            cursor={{ fill: "var(--surface-2)" }}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 13,
            }}
            formatter={(v: number) => [`${v} min`, "Focused"]}
            labelStyle={{ color: "var(--muted-fg)", fontWeight: 600 }}
          />
          <Bar dataKey="minutes" fill="var(--focus)" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
