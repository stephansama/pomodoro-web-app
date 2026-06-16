import { useLiveQuery } from "dexie-react-hooks";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { weeklyFocusBuckets } from "@/db/sessions";

export function WeeklyTrendChart() {
  const data =
    useLiveQuery(async () => {
      const buckets = await weeklyFocusBuckets(8);
      return buckets.map((b) => ({
        label: b.label,
        hours: Math.round((b.focusMs / 3_600_000) * 10) / 10,
      }));
    }, []) ?? [];

  return (
    <div className="chartcard">
      <div className="ch">
        <span className="t">Weekly trend</span>
        <span className="c">Last 8 weeks</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 6, right: 12, left: -10, bottom: 0 }}>
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
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-fg)" }}
            width={36}
            allowDecimals={false}
            tickFormatter={(v: number) => (v ? `${v}h` : "")}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 13,
            }}
            formatter={(v: number) => [`${v} h`, "Focused"]}
            labelStyle={{ color: "var(--muted-fg)", fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="var(--accent)"
            strokeWidth={2.5}
            dot={{ fill: "var(--accent)", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
