import { useEffect, useState } from "react";
import { Archive, ArchiveRestore, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  archiveTask,
  deleteTaskHard,
  restoreTask,
  updateTask,
} from "@/db/tasks";
import type { Task } from "@/db/dexie";

interface Props {
  task: Task | null;
  onOpenChange: (open: boolean) => void;
}

export function TaskEditSheet({ task, onOpenChange }: Props) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [estimate, setEstimate] = useState<number | "">("");

  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setNotes(task.notes ?? "");
    setEstimate(task.estimatedPomodoros ?? "");
  }, [task]);

  if (!task) return null;

  const isArchived = !!task.archivedAt;

  return (
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit task</SheetTitle>
          <SheetDescription>Update details or archive when done.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Title
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="rounded-(--radius) border-[1.5px] border-(--border) bg-(--surface) p-3 text-sm text-(--foreground) outline-none focus:border-(--accent)"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Estimated pomodoros
            <Input
              type="number"
              min={0}
              value={estimate}
              onChange={(e) =>
                setEstimate(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="max-w-32"
            />
          </label>

          <div className="mt-2 flex flex-wrap gap-2">
            {isArchived ? (
              <Button
                variant="ghost"
                onClick={async () => {
                  await restoreTask(task.id);
                  onOpenChange(false);
                }}
              >
                <ArchiveRestore size={16} /> Restore
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={async () => {
                  await archiveTask(task.id);
                  onOpenChange(false);
                }}
              >
                <Archive size={16} /> Archive
              </Button>
            )}
            <Button
              variant="danger"
              onClick={async () => {
                if (
                  confirm(
                    "Delete this task permanently? Sessions stay in your history but lose their link.",
                  )
                ) {
                  await deleteTaskHard(task.id);
                  onOpenChange(false);
                }
              }}
            >
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              await updateTask(task.id, {
                title: title.trim() || task.title,
                notes: notes.trim() || undefined,
                estimatedPomodoros:
                  estimate === "" ? undefined : Number(estimate),
              });
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
