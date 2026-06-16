import IconCloudOff from "~icons/mdi/cloud-off-outline";
import { useOnline } from "@/hooks/use-online";

export function OfflineChip() {
  const online = useOnline();
  if (online) return null;
  return (
    <span
      className="inline-flex items-center gap-[7px] rounded-full bg-(--surface-2) px-[11px] py-[5px] font-mono text-xs text-(--muted-fg)"
      role="status"
      aria-live="polite"
    >
      <IconCloudOff width={13} height={13} />
      Offline · saving locally
    </span>
  );
}
