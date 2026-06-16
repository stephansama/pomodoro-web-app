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
      <nav className="navlinks" aria-label="Primary">
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
      <div className="navspace" />
      <OfflineChip />
      <ThemeToggle />
    </header>
  );
}
