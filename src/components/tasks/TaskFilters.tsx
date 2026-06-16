export type TaskFilter = "active" | "archived" | "all";

const OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "all", label: "All" },
];

interface Props {
  value: TaskFilter;
  onChange: (next: TaskFilter) => void;
}

export function TaskFilters({ value, onChange }: Props) {
  return (
    <div className="filterrow" role="tablist" aria-label="Task filter">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={opt.value === value}
          className={`seg${opt.value === value ? " active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
