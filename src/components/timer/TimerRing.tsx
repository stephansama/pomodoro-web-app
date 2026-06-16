import { useTimer } from "@/stores/timer-store";
import { formatClock } from "@/lib/time";

const SIZE = 360;
const STROKE = 14;
const RADIUS = SIZE / 2 - STROKE;
const CIRC = 2 * Math.PI * RADIUS;

interface Props {
  remainingMs: number;
  fullbleed: boolean;
}

export function TimerRing({ remainingMs, fullbleed }: Props) {
  const plannedMs = useTimer((s) => s.plannedMs);
  const progress = plannedMs > 0 ? Math.max(0, Math.min(1, remainingMs / plannedMs)) : 0;
  const dashOffset = CIRC * (1 - progress);

  const trackColor = fullbleed ? "rgba(255,255,255,0.22)" : "var(--border)";
  const progColor = fullbleed ? "#ffffff" : "var(--accent)";

  return (
    <div
      className="relative aspect-square w-[clamp(260px,42vmin,380px)]"
      role="img"
      aria-label={`${formatClock(remainingMs)} remaining`}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-full w-full">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={trackColor}
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={progColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ transition: "stroke-dashoffset 0.35s var(--ease)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[clamp(64px,13vmin,128px)] font-semibold leading-none tracking-[-0.03em] tabular-nums">
          {formatClock(remainingMs)}
        </span>
      </div>
    </div>
  );
}
