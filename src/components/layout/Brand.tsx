import { Link } from "@tanstack/react-router";

export function Brand() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 text-[19px] font-bold tracking-[-0.01em] text-inherit no-underline"
      aria-label="Tomato — home"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M13.4 6.1c0-1.5 1.4-2.5 3.5-2.3-.2 2-1.6 3.1-3.5 3"
          fill="currentColor"
        />
        <path
          d="M13.4 6.6c-.1-1.1-.9-1.9-2.1-2.1"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx="12"
          cy="15"
          r="6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
      <span>Tomato</span>
    </Link>
  );
}
