import { db, type Task } from "./dexie";
import { uuid } from "@/lib/uuid";

export async function createTask(input: {
  title: string;
  notes?: string;
  estimatedPomodoros?: number;
}): Promise<Task> {
  const t: Task = {
    id: uuid(),
    title: input.title.trim(),
    notes: input.notes?.trim() || undefined,
    estimatedPomodoros: input.estimatedPomodoros,
    createdAt: Date.now(),
  };
  await db.tasks.add(t);
  return t;
}

export async function updateTask(
  id: string,
  patch: Partial<Pick<Task, "title" | "notes" | "estimatedPomodoros">>,
): Promise<void> {
  await db.tasks.update(id, patch);
}

export async function archiveTask(id: string): Promise<void> {
  await db.tasks.update(id, { archivedAt: Date.now() });
}

export async function restoreTask(id: string): Promise<void> {
  await db.tasks.update(id, { archivedAt: undefined });
}

export async function deleteTaskHard(id: string): Promise<void> {
  await db.tasks.delete(id);
  // Detach sessions so history is preserved without a dangling task reference.
  await db.sessions
    .where("taskId")
    .equals(id)
    .modify((s) => {
      s.taskId = undefined;
    });
}

export async function clearAllData(): Promise<void> {
  await db.transaction("rw", db.tasks, db.sessions, async () => {
    await db.tasks.clear();
    await db.sessions.clear();
  });
}
