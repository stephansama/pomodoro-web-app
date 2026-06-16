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
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <BottomTabBar />
      <Toaster />
      <ShortcutSheet open={help} onOpenChange={setHelp} />
      <InstallPrompt />
      <div className="kbdhint">Space · S · 1·2·3 · ?</div>
    </div>
  );
}
