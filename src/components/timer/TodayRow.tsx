import { useLiveQuery } from "dexie-react-hooks";
import { startOfDay } from "date-fns";
import { db } from "@/db/dexie";
import { formatHoursLong } from "@/lib/time";

export function TodayRow() {
  const data = useLiveQuery(async () => {
    const startMs = startOfDay(new Date()).getTime();
    const sessions = await db.sessions
      .where("startedAt")
      .aboveOrEqual(startMs)
      .toArray();
    const focus = sessions.filter((s) => s.type === "focus" && s.completed);
    const focusMs = focus.reduce((a, s) => a + s.actualDurationMs, 0);
    return { count: focus.length, focusMs };
  }, []);

  const count = data?.count ?? 0;
  const focusMs = data?.focusMs ?? 0;

  return (
    <div className="todayrow">
      <span>
        Today · <b>{count}</b> {count === 1 ? "session" : "sessions"}
      </span>
      <span>
        Focused · <b>{focusMs > 0 ? formatHoursLong(focusMs) : "0m"}</b>
      </span>
    </div>
  );
}
