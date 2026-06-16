import { useEffect, useState } from "react";
import IconClose from "~icons/mdi/close";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "tomato.install.dismissedUntil";

export function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const dismissedUntil = Number(
      localStorage.getItem(DISMISS_KEY) || "0",
    );
    if (Date.now() < dismissedUntil) return;

    const onBefore = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setEvent(null);
    window.addEventListener("beforeinstallprompt", onBefore);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!event) return null;

  const dismiss = () => {
    localStorage.setItem(
      DISMISS_KEY,
      String(Date.now() + 14 * 24 * 60 * 60 * 1000),
    );
    setEvent(null);
  };

  return (
    <div
      className="fixed right-4 bottom-4 left-4 z-30 flex max-w-[420px] flex-col gap-3 rounded-(--radius-lg) bg-(--surface) p-5 shadow-(--shadow-pop) sm:left-auto"
      role="dialog"
      aria-label="Install Tomato"
    >
      <button
        type="button"
        onClick={dismiss}
        className="iconbtn absolute top-2 right-2"
        aria-label="Dismiss"
      >
        <IconClose width={18} height={18} />
      </button>
      <div className="text-base font-semibold">Install Tomato</div>
      <div className="text-sm text-(--muted-fg)">
        Add it to your home screen for one-tap focus.
      </div>
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={async () => {
            await event.prompt();
            const choice = await event.userChoice;
            if (choice.outcome === "dismissed") dismiss();
            setEvent(null);
          }}
        >
          Install
        </Button>
        <Button variant="ghost" onClick={dismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}
