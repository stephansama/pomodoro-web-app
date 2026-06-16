import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Task } from "@/db/dexie";
import { TaskAddRow } from "@/components/tasks/TaskAddRow";
import { TaskFilters, type TaskFilter } from "@/components/tasks/TaskFilters";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskEmpty } from "@/components/tasks/TaskEmpty";
import { TaskEditSheet } from "@/components/tasks/TaskEditSheet";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

function TasksPage() {
  const [filter, setFilter] = useState<TaskFilter>("active");
  const [editing, setEditing] = useState<Task | null>(null);

  const tasks =
    useLiveQuery(() => db.tasks.toArray(), [], undefined as Task[] | undefined) ??
    [];

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) => {
      if (filter === "active") return !t.archivedAt;
      if (filter === "archived") return !!t.archivedAt;
      return true;
    });
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, filter]);

  return (
    <div className="container narrow">
      <div className="pagehead">
        <h1 className="h1">Tasks</h1>
      </div>
      <TaskAddRow />
      <TaskFilters value={filter} onChange={setFilter} />

      {visible.length === 0 ? (
        <TaskEmpty filter={filter} />
      ) : (
        <ul className="flex flex-col gap-0 list-none p-0 m-0">
          {visible.map((t) => (
            <li key={t.id}>
              <TaskCard task={t} onEdit={setEditing} />
            </li>
          ))}
        </ul>
      )}

      <TaskEditSheet
        task={editing}
        onOpenChange={(open) => !open && setEditing(null)}
      />
    </div>
  );
}
