import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/dexie";
import { useTimer } from "@/stores/timer-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createTask } from "@/db/tasks";

export function ActiveTaskPicker() {
  const activeTaskId = useTimer((s) => s.activeTaskId);
  const setActiveTask = useTimer((s) => s.setActiveTask);
  const tasks =
    useLiveQuery(
      () =>
        db.tasks
          .filter((t) => !t.archivedAt)
          .reverse()
          .sortBy("createdAt"),
      [],
    ) ?? [];

  const activeTitle = activeTaskId
    ? tasks.find((t) => t.id === activeTaskId)?.title
    : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="activepick">
          <div className="lab">Active task</div>
          <div className={`val${activeTitle ? "" : " empty"}`}>
            {activeTitle ?? "Choose a task"}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel>Link this session to</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={activeTaskId ?? "__none"}
          onValueChange={(v) =>
            setActiveTask(v === "__none" ? null : v)
          }
        >
          <DropdownMenuRadioItem value="__none">No task</DropdownMenuRadioItem>
          {tasks.map((t) => (
            <DropdownMenuRadioItem key={t.id} value={t.id}>
              {t.title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async (e) => {
            e.preventDefault();
            const title = prompt("New task title")?.trim();
            if (!title) return;
            const t = await createTask({ title });
            setActiveTask(t.id);
          }}
        >
          + New task…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
