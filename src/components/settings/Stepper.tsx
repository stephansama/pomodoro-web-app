import { Minus, Plus } from "lucide-react";

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
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease"
      >
        <Minus size={18} />
      </button>
      <b>{value}</b>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
