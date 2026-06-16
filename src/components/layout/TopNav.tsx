import { Link } from "@tanstack/react-router";
import { Brand } from "./Brand";
import { ThemeToggle } from "./ThemeToggle";
import { OfflineChip } from "./OfflineChip";

const LINKS = [
  { to: "/", label: "Timer" },
  { to: "/tasks", label: "Tasks" },
  { to: "/stats", label: "Stats" },
  { to: "/settings", label: "Settings" },
] as const;

export function TopNav() {
  return (
    <header className="topnav">
      <Brand />
      <nav className="ml-[14px] flex gap-1 max-md:hidden" aria-label="Primary">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="navlink"
            activeProps={{ className: "navlink active" }}
            activeOptions={{ exact: l.to === "/" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1" />
      <OfflineChip />
      <ThemeToggle />
    </header>
  );
}
