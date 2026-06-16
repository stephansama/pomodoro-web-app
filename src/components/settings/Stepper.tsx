import IconMinus from "~icons/mdi/minus";
import IconPlus from "~icons/mdi/plus";

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
        <IconMinus width={18} height={18} />
      </button>
      <b>{value}</b>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase"
      >
        <IconPlus width={18} height={18} />
      </button>
    </div>
  );
}
