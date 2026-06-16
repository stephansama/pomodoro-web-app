import { Link } from "@tanstack/react-router";
import { BarChart3, ListChecks, Settings, Timer } from "lucide-react";

const LINKS = [
  { to: "/", label: "Timer", Icon: Timer, exact: true },
  { to: "/tasks", label: "Tasks", Icon: ListChecks, exact: false },
  { to: "/stats", label: "Stats", Icon: BarChart3, exact: false },
  { to: "/settings", label: "Settings", Icon: Settings, exact: false },
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
          <Icon size={20} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
