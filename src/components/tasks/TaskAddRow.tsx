import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTask } from "@/db/tasks";

export function TaskAddRow() {
  const [value, setValue] = useState("");

  return (
    <form
      className="addrow"
      onSubmit={async (e) => {
        e.preventDefault();
        const title = value.trim();
        if (!title) return;
        await createTask({ title });
        setValue("");
      }}
    >
      <Input
        placeholder="Add a task…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Add a task"
      />
      <Button type="submit" variant="add" disabled={!value.trim()}>
        <Plus size={18} /> Add
      </Button>
    </form>
  );
}
