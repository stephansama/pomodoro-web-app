import type { ReactNode } from "react";

interface Props {
  label: string;
  hint?: string;
  control: ReactNode;
}

export function SettingRow({ label, hint, control }: Props) {
  return (
    <div className="srow">
      <div>
        <div className="sl">{label}</div>
        {hint && <div className="sh">{hint}</div>}
      </div>
      {control}
    </div>
  );
}
