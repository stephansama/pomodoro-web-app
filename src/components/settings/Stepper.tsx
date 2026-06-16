import IconMinus from "~icons/mdi/minus";
import IconPlus from "~icons/mdi/plus";
import { cn } from "@/lib/cn";

const stepBtn =
  "w-[46px] py-2.5 text-[21px] text-(--muted-fg) transition duration-150 hover:bg-(--surface-2) hover:text-(--foreground) disabled:cursor-not-allowed disabled:opacity-40";

interface Props {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
  label?: string;
}

export function Stepper({
  value,
  min = 1,
  max = 999,
  step = 1,
  onChange,
  label,
}: Props) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <div
      className="flex shrink-0 items-center overflow-hidden rounded-(--radius) border-[1.5px] border-(--border)"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={cn(stepBtn, "border-r-[1.5px] border-(--border)")}
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease"
      >
        <IconMinus width={18} height={18} />
      </button>
      <b className="w-[58px] py-2.5 text-center font-mono text-[17px] font-semibold">
        {value}
      </b>
      <button
        type="button"
        className={cn(stepBtn, "border-l-[1.5px] border-(--border)")}
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase"
      >
        <IconPlus width={18} height={18} />
      </button>
    </div>
  );
}
