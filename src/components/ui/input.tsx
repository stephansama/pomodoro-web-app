import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "h-13 w-full rounded-(--radius) border-[1.5px] border-(--border) bg-(--surface) px-4 text-base text-(--foreground) outline-none transition-colors focus:border-(--accent) placeholder:text-(--muted-fg)",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
