import * as React from "react";
import * as RSwitch from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";

export const Switch = React.forwardRef<
  React.ComponentRef<typeof RSwitch.Root>,
  React.ComponentPropsWithoutRef<typeof RSwitch.Root>
>(({ className, checked, ...props }, ref) => (
  <RSwitch.Root
    ref={ref}
    checked={checked}
    className={cn("switch", checked && "on", className)}
    {...props}
  >
    <RSwitch.Thumb asChild>
      <i />
    </RSwitch.Thumb>
  </RSwitch.Root>
));
Switch.displayName = "Switch";
