import { useEffect } from "react";
import { toast } from "sonner";
import { registerSW } from "virtual:pwa-register";

export function usePwaUpdate() {
  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        toast("A new version is ready.", {
          action: {
            label: "Reload",
            onClick: () => updateSW(true),
          },
          duration: Infinity,
        });
      },
      onOfflineReady() {
        toast("Ready to work offline.");
      },
    });
  }, []);
}
