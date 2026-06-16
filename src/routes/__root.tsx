import { useState } from "react";
import { Outlet, createRootRoute, useMatchRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/layout/TopNav";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ShortcutSheet } from "@/components/ShortcutSheet";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { usePhase } from "@/hooks/use-phase";
import { useTheme } from "@/hooks/use-theme";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useTimerHeartbeat } from "@/hooks/use-timer";
import { usePwaUpdate } from "@/hooks/use-pwa-update";
import { useTimer } from "@/stores/timer-store";

export const Route = createRootRoute({ component: RootShell });

function RootShell() {
  useTheme();
  usePhase();
  usePwaUpdate();
  useTimerHeartbeat();

  const [help, setHelp] = useState(false);
  useKeyboardShortcuts(() => setHelp(true));

  const status = useTimer((s) => s.status);
  const matchRoute = useMatchRoute();
  const onTimerRoute = !!matchRoute({ to: "/" });

  // Fullbleed mode only on the Timer route, only when actively running/paused.
  const fullbleed = onTimerRoute && status !== "idle";

  return (
    <div className={`site${fullbleed ? " fullbleed" : ""}`}>
      <TopNav />
      <main className="flex flex-1 justify-center px-[clamp(20px,5vw,52px)] pt-[clamp(16px,2.5vh,28px)] pb-24 md:pt-[clamp(28px,5vh,64px)] md:pb-16">
        <Outlet />
      </main>
      <Footer />
      <BottomTabBar />
      <Toaster />
      <ShortcutSheet open={help} onOpenChange={setHelp} />
      <InstallPrompt />
      <div className="pointer-events-none fixed bottom-3.5 right-[18px] font-mono text-xs text-(--muted-fg) opacity-60 max-md:hidden">
        Space · S · 1·2·3 · ?
      </div>
    </div>
  );
}
