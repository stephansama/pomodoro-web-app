import { Link } from "@tanstack/react-router";
import IconTimer from "~icons/mdi/timer-outline";
import IconTasks from "~icons/mdi/format-list-checks";
import IconStats from "~icons/mdi/chart-bar";
import IconSettings from "~icons/mdi/cog-outline";

const LINKS = [
  { to: "/", label: "Timer", Icon: IconTimer, exact: true },
  { to: "/tasks", label: "Tasks", Icon: IconTasks, exact: false },
  { to: "/stats", label: "Stats", Icon: IconStats, exact: false },
  { to: "/settings", label: "Settings", Icon: IconSettings, exact: false },
] as const;

export function BottomTabBar() {
  return (
    <nav className="tabbar" aria-label="Primary (mobile)">
      {LINKS.map(({ to, label, Icon, exact }) => (
        <Link
          key={to}
          to={to}
          className="tab"
          activeProps={{ className: "tab active" }}
          activeOptions={{ exact }}
        >
          <Icon width={20} height={20} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
