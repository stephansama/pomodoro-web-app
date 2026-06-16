import { useLiveQuery } from "dexie-react-hooks";
import { Check } from "lucide-react";
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
    <div className={`tcard${active ? " active" : ""}`}>
      <button
        type="button"
        className={`tcheck${done ? " done" : ""}`}
        aria-label={done ? "Restore task" : "Archive (mark done)"}
        onClick={() => (done ? restoreTask(task.id) : archiveTask(task.id))}
      >
        {done && <Check size={16} aria-hidden="true" />}
      </button>

      <button
        type="button"
        className="tmid"
        onClick={() => onEdit(task)}
        onDoubleClick={() => setActiveTask(task.id)}
      >
        <div className={`ttitle${done ? " done" : ""}`}>{task.title}</div>
        <div className="tmeta">
          {stats.count === 0
            ? "No focus time yet"
            : `${stats.count} ${stats.count === 1 ? "session" : "sessions"} · ${formatDurationShort(stats.totalMs)} focused`}
          {task.estimatedPomodoros
            ? ` · est. ${task.estimatedPomodoros}`
            : ""}
        </div>
      </button>

      <span className={`tpill${stats.totalMs === 0 ? " muted" : ""}`}>
        {formatDurationShort(stats.totalMs || 0)}
      </span>
    </div>
  );
}
