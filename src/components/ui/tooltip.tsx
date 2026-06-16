import * as React from "react";
import * as RTooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/cn";

export const TooltipProvider = RTooltip.Provider;
export const Tooltip = RTooltip.Root;
export const TooltipTrigger = RTooltip.Trigger;

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof RTooltip.Content>,
  React.ComponentPropsWithoutRef<typeof RTooltip.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <RTooltip.Portal>
    <RTooltip.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-(--radius-sm) bg-(--foreground) px-2.5 py-1.5 text-xs font-medium text-(--background) shadow-(--shadow-pop) data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  </RTooltip.Portal>
));
TooltipContent.displayName = "TooltipContent";
