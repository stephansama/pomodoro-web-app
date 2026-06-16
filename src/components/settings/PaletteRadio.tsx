import type { ThemePalette } from "@/stores/settings-store";

const OPTIONS: { value: ThemePalette; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "catppuccin", label: "Catppuccin" },
];

interface Props {
  value: ThemePalette;
  onChange: (next: ThemePalette) => void;
}

export function PaletteRadio({ value, onChange }: Props) {
  return (
    <div className="radio" role="radiogroup" aria-label="Color palette">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={value === o.value ? "on" : ""}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
