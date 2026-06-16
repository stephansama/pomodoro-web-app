import { useLiveQuery } from "dexie-react-hooks";
import IconCheck from "~icons/mdi/check";
import { cn } from "@/lib/cn";
import type { Task } from "@/db/dexie";
import { archiveTask, restoreTask } from "@/db/tasks";
import { totalMsForTask } from "@/db/sessions";
import { formatDurationShort } from "@/lib/time";
import { useTimer } from "@/stores/timer-store";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: Props) {
  const stats = useLiveQuery(() => totalMsForTask(task.id), [task.id]) ?? {
    totalMs: 0,
    count: 0,
  };
  const active = useTimer((s) => s.activeTaskId) === task.id;
  const done = !!task.archivedAt;
  const setActiveTask = useTimer((s) => s.setActiveTask);

  return (
    <div
      className={cn(
        "mb-2.5 flex items-center gap-4 rounded-(--radius) border-l-4 bg-(--surface) px-5 py-4 transition-shadow duration-200",
        active
          ? "border-l-(--focus) shadow-(--shadow-pop)"
          : "border-l-transparent shadow-(--shadow-card)",
      )}
    >
      <button
        type="button"
        className={cn(
          "flex size-[26px] shrink-0 items-center justify-center rounded-full border-2 transition duration-150",
          done
            ? "border-(--success) bg-(--success) text-white"
            : "border-(--border) bg-transparent hover:border-(--success)",
        )}
        aria-label={done ? "Restore task" : "Archive (mark done)"}
        onClick={() => (done ? restoreTask(task.id) : archiveTask(task.id))}
      >
        {done && <IconCheck width={16} height={16} aria-hidden="true" />}
      </button>

      <button
        type="button"
        className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit"
        onClick={() => onEdit(task)}
        onDoubleClick={() => setActiveTask(task.id)}
      >
        <div
          className={cn(
            "truncate text-[17px] font-medium",
            done && "text-(--muted-fg) line-through",
          )}
        >
          {task.title}
        </div>
        <div className="mt-[3px] text-sm text-(--muted-fg)">
          {stats.count === 0
            ? "No focus time yet"
            : `${stats.count} ${stats.count === 1 ? "session" : "sessions"} · ${formatDurationShort(stats.totalMs)} focused`}
          {task.estimatedPomodoros
            ? ` · est. ${task.estimatedPomodoros}`
            : ""}
        </div>
      </button>

      <span
        className={cn(
          "shrink-0 whitespace-nowrap rounded-full px-[13px] py-[7px] font-mono text-sm font-semibold",
          stats.totalMs === 0
            ? "bg-(--surface-2) text-(--muted-fg)"
            : "bg-(--focus-soft) text-(--focus)",
        )}
      >
        {formatDurationShort(stats.totalMs || 0)}
      </span>
    </div>
  );
}
