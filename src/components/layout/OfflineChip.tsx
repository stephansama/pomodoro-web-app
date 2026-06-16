import { CloudOff } from "lucide-react";
import { useOnline } from "@/hooks/use-online";

export function OfflineChip() {
  const online = useOnline();
  if (online) return null;
  return (
    <span className="offchip" role="status" aria-live="polite">
      <CloudOff size={13} />
      Offline · saving locally
    </span>
  );
}
