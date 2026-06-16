import { useTimer } from "@/stores/timer-store";
import { selectPhase, startPhase } from "@/hooks/use-timer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Phase } from "@/db/dexie";

const TABS: { value: Phase; label: string }[] = [
  { value: "focus", label: "Focus" },
  { value: "short", label: "Short Break" },
  { value: "long", label: "Long Break" },
];

export function PhaseTabs() {
  const phase = useTimer((s) => s.phase);
  const status = useTimer((s) => s.status);

  return (
    <Tabs
      value={phase}
      onValueChange={(v) => {
        const next = v as Phase;
        if (status === "idle") selectPhase(next);
        else startPhase(next);
      }}
    >
      <TabsList aria-label="Timer phase">
        {TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
