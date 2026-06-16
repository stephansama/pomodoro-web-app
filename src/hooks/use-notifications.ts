import { useCallback, useEffect, useState } from "react";

export type PermState = "default" | "granted" | "denied" | "unsupported";

export function useNotifications() {
  const supported =
    typeof window !== "undefined" && "Notification" in window;
  const [permission, setPermission] = useState<PermState>(
    supported ? (Notification.permission as PermState) : "unsupported",
  );

  useEffect(() => {
    if (!supported) return;
    setPermission(Notification.permission as PermState);
  }, [supported]);

  const request = useCallback(async (): Promise<PermState> => {
    if (!supported) return "unsupported";
    try {
      const p = (await Notification.requestPermission()) as PermState;
      setPermission(p);
      return p;
    } catch {
      return Notification.permission as PermState;
    }
  }, [supported]);

  const notify = useCallback(
    (title: string, body?: string) => {
      if (!supported || Notification.permission !== "granted") return;
      try {
        new Notification(title, { body, icon: "/icons/icon-192.png" });
      } catch {
        // ignore
      }
    },
    [supported],
  );

  return { supported, permission, request, notify };
}
