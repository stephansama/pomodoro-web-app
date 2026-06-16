import { BarChart3 } from "lucide-react";

export function StatsEmpty() {
  return (
    <div className="empty">
      <BarChart3 size={36} aria-hidden="true" />
      <div className="et">No focus history yet</div>
      <div className="ed">
        Finish your first focus session to see your stats here.
      </div>
    </div>
  );
}
