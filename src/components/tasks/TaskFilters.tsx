import { cn } from "@/lib/cn";

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
    <div
      className="mb-[18px] flex gap-2"
      role="tablist"
      aria-label="Task filter"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={opt.value === value}
          className={cn(
            "rounded-full px-[18px] py-[9px] text-sm font-semibold transition duration-150",
            opt.value === value
              ? "bg-(--surface-2) text-(--foreground)"
              : "text-(--muted-fg)",
          )}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
