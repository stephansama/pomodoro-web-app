import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/dexie";
import { StatScoreCards } from "@/components/stats/StatScoreCards";
import { DailyBarsChart } from "@/components/stats/DailyBarsChart";
import { WeeklyTrendChart } from "@/components/stats/WeeklyTrendChart";
import { PerTaskDonut } from "@/components/stats/PerTaskDonut";
import { StatsEmpty } from "@/components/stats/StatsEmpty";

export const Route = createFileRoute("/stats")({ component: StatsPage });

function StatsPage() {
  const hasSessions =
    (useLiveQuery(() => db.sessions.count(), [], 0) ?? 0) > 0;

  return (
    <div className="container wide">
      <div className="pagehead">
        <h1 className="h1">Stats</h1>
      </div>

      {hasSessions ? (
        <>
          <StatScoreCards />
          <div className="chartgrid">
            <DailyBarsChart />
            <WeeklyTrendChart />
          </div>
          <PerTaskDonut />
        </>
      ) : (
        <StatsEmpty />
      )}
    </div>
  );
}
