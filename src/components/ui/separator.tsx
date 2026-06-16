import * as React from "react";
import * as RSep from "@radix-ui/react-separator";
import { cn } from "@/lib/cn";

export const Separator = React.forwardRef<
  React.ComponentRef<typeof RSep.Root>,
  React.ComponentPropsWithoutRef<typeof RSep.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <RSep.Root
    ref={ref}
    orientation={orientation}
    decorative={decorative}
    className={cn(
      "shrink-0 bg-(--border)",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className,
    )}
    {...props}
  />
));
Separator.displayName = "Separator";
