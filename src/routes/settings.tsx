import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";
import { useSettings } from "@/stores/settings-store";
import { useNotifications } from "@/hooks/use-notifications";
import { SettingRow } from "@/components/settings/SettingRow";
import { Stepper } from "@/components/settings/Stepper";
import { Switch } from "@/components/ui/switch";
import { ThemeRadio } from "@/components/settings/ThemeRadio";
import { DataActions } from "@/components/settings/DataActions";
import { Button } from "@/components/ui/button";
import { playChime } from "@/lib/audio";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const s = useSettings();
  const { supported, permission, request } = useNotifications();

  useEffect(() => {
    if (!s.notificationsEnabled) return;
    if (!supported) return;
    if (permission === "default")
      void request().then((p) => {
        if (p !== "granted") s.set("notificationsEnabled", false);
      });
  }, [s, supported, permission, request]);

  return (
    <div className="container narrow">
      <div className="pagehead">
        <h1 className="h1">Settings</h1>
      </div>

      <div className="ssection">Timer durations</div>
      <SettingRow
        label="Focus"
        hint="Minutes per focus block."
        control={
          <Stepper
            value={s.focusMin}
            min={1}
            max={120}
            onChange={(v) => s.set("focusMin", v)}
            label="Focus minutes"
          />
        }
      />
      <SettingRow
        label="Short break"
        hint="Minutes after each focus."
        control={
          <Stepper
            value={s.shortBreakMin}
            min={1}
            max={60}
            onChange={(v) => s.set("shortBreakMin", v)}
            label="Short break minutes"
          />
        }
      />
      <SettingRow
        label="Long break"
        hint="The longer rest."
        control={
          <Stepper
            value={s.longBreakMin}
            min={1}
            max={60}
            onChange={(v) => s.set("longBreakMin", v)}
            label="Long break minutes"
          />
        }
      />
      <SettingRow
        label="Long break every"
        hint="Number of focus sessions between long breaks."
        control={
          <Stepper
            value={s.longBreakInterval}
            min={2}
            max={12}
            onChange={(v) => s.set("longBreakInterval", v)}
            label="Long break interval"
          />
        }
      />

      <div className="ssection">Auto-start</div>
      <SettingRow
        label="Auto-start breaks"
        hint="Start the break automatically when a focus ends."
        control={
          <Switch
            checked={s.autoStartBreaks}
            onCheckedChange={(v) => s.set("autoStartBreaks", v)}
            aria-label="Auto-start breaks"
          />
        }
      />
      <SettingRow
        label="Auto-start pomodoros"
        hint="Start the next focus automatically after a break."
        control={
          <Switch
            checked={s.autoStartPomodoros}
            onCheckedChange={(v) => s.set("autoStartPomodoros", v)}
            aria-label="Auto-start pomodoros"
          />
        }
      />

      <div className="ssection">Notifications &amp; sound</div>
      <SettingRow
        label="Browser notifications"
        hint={
          supported
            ? permission === "denied"
              ? "Blocked in your browser settings."
              : "Notify when a session ends."
            : "Not supported in this browser."
        }
        control={
          <Switch
            checked={s.notificationsEnabled}
            onCheckedChange={async (v) => {
              if (v && supported && permission !== "granted") {
                const p = await request();
                if (p !== "granted") return;
              }
              s.set("notificationsEnabled", v);
            }}
            disabled={!supported || permission === "denied"}
            aria-label="Browser notifications"
          />
        }
      />
      <SettingRow
        label="Completion chime"
        hint="A gentle two-tone ding."
        control={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => void playChime()}
              aria-label="Preview chime"
            >
              <Volume2 size={16} /> Preview
            </Button>
            <Switch
              checked={s.soundEnabled}
              onCheckedChange={(v) => s.set("soundEnabled", v)}
              aria-label="Completion chime"
            />
          </div>
        }
      />

      <div className="ssection">Appearance</div>
      <SettingRow
        label="Theme"
        hint="System follows your OS preference."
        control={
          <ThemeRadio value={s.theme} onChange={(v) => s.set("theme", v)} />
        }
      />

      <div className="ssection">Data</div>
      <SettingRow
        label="Your tasks &amp; sessions"
        hint="Stored locally in your browser. Export anytime."
        control={<DataActions />}
      />
    </div>
  );
}
