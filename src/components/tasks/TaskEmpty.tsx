import IconList from "~icons/mdi/format-list-checks";

export function TaskEmpty({ filter }: { filter: "active" | "archived" | "all" }) {
  return (
    <div className="empty">
      <IconList width={36} height={36} aria-hidden="true" />
      <div className="et">
        {filter === "archived"
          ? "Nothing archived yet"
          : "No tasks yet"}
      </div>
      <div className="ed">
        {filter === "archived"
          ? "Tasks you archive will land here."
          : "Add one above to start tracking focused time."}
      </div>
    </div>
  );
}
