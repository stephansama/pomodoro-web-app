import { useLiveQuery } from "dexie-react-hooks";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { thisWeekTaskSplit } from "@/db/sessions";
import { formatDurationShort } from "@/lib/time";

const PALETTE = [
  "#BA4949",
  "#38858A",
  "#397097",
  "#C77A2E",
  "#3E8E5A",
  "#7556C8",
  "#9E4A8E",
  "#5A8FB5",
];

export function PerTaskDonut() {
  const data =
    useLiveQuery(async () => {
      const split = await thisWeekTaskSplit();
      return split.map((s, i) => ({
        ...s,
        minutes: Math.round(s.focusMs / 60_000),
        color: PALETTE[i % PALETTE.length],
      }));
    }, []) ?? [];

  return (
    <div className="chartcard">
      <div className="ch">
        <span className="t">This week by task</span>
        <span className="c">Focus split</span>
      </div>
      {data.length === 0 ? (
        <div className="empty" style={{ padding: "16px 0" }}>
          <div className="ed">No focused time this week yet.</div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-[26px]">
          <ResponsiveContainer width={170} height={170}>
            <PieChart>
              <Pie
                data={data}
                dataKey="minutes"
                nameKey="title"
                innerRadius={48}
                outerRadius={78}
                stroke="var(--surface)"
                strokeWidth={2}
                paddingAngle={1}
              >
                {data.map((d) => (
                  <Cell key={d.taskId} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: 13,
                }}
                formatter={(v: number) => [`${v} min`, "Focused"]}
                labelStyle={{ color: "var(--muted-fg)", fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex min-w-[160px] flex-1 flex-col gap-[11px] text-sm">
            {data.slice(0, 6).map((d) => (
              <div key={d.taskId} className="flex items-center gap-[9px]">
                <span
                  className="size-3 shrink-0 rounded-[3px]"
                  style={{ background: d.color }}
                />
                <span className="flex-1 truncate">{d.title}</span>
                <span className="text-(--muted-fg) mono">
                  {formatDurationShort(d.focusMs)}
                </span>
              </div>
            ))}
            {data.length > 6 && (
              <div className="flex items-center gap-[9px] text-(--muted-fg) text-xs">
                +{data.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
