import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ROWS: Array<{ keys: string[]; label: string }> = [
  { keys: ["Space"], label: "Start, pause, or resume the timer" },
  { keys: ["S"], label: "Skip current phase" },
  { keys: ["Esc"], label: "Stop and discard current session" },
  { keys: ["1"], label: "Switch to Focus" },
  { keys: ["2"], label: "Switch to Short Break" },
  { keys: ["3"], label: "Switch to Long Break" },
  { keys: ["?"], label: "Show this cheat sheet" },
];

export function ShortcutSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Stay on the keyboard when you're heads-down.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-2.5">
          {ROWS.map((r) => (
            <li
              key={r.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="text-(--foreground)">{r.label}</span>
              <span className="flex gap-1">
                {r.keys.map((k) => (
                  <kbd
                    key={k}
                    className="font-mono text-xs rounded-(--radius-sm) border border-(--border) bg-(--surface-2) px-2 py-1 text-(--foreground)"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
