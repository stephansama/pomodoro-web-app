import Dexie, { type EntityTable } from "dexie";

export type Phase = "focus" | "short" | "long";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  estimatedPomodoros?: number;
  createdAt: number;
  archivedAt?: number;
}

export interface Session {
  id: string;
  taskId?: string;
  type: Phase;
  startedAt: number;
  endedAt: number;
  plannedDurationMs: number;
  actualDurationMs: number;
  completed: boolean;
}

export const db = new Dexie("tomato") as Dexie & {
  tasks: EntityTable<Task, "id">;
  sessions: EntityTable<Session, "id">;
};

db.version(1).stores({
  tasks: "id, createdAt, archivedAt",
  sessions: "id, taskId, startedAt, [type+startedAt]",
});
