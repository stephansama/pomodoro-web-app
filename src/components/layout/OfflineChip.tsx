import IconCloudOff from "~icons/mdi/cloud-off-outline";
import { useOnline } from "@/hooks/use-online";

export function OfflineChip() {
  const online = useOnline();
  if (online) return null;
  return (
    <span className="offchip" role="status" aria-live="polite">
      <IconCloudOff width={13} height={13} />
      Offline · saving locally
    </span>
  );
}
