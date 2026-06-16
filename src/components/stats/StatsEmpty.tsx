import IconChart from "~icons/mdi/chart-bar";

export function StatsEmpty() {
  return (
    <div className="empty">
      <IconChart width={36} height={36} aria-hidden="true" />
      <div className="et">No focus history yet</div>
      <div className="ed">
        Finish your first focus session to see your stats here.
      </div>
    </div>
  );
}
