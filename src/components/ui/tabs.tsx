import * as React from "react";
import * as RTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

export const Tabs = RTabs.Root;

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof RTabs.List>,
  React.ComponentPropsWithoutRef<typeof RTabs.List>
>(({ className, ...props }, ref) => (
  <RTabs.List ref={ref} className={cn("herotabs", className)} {...props} />
));
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof RTabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof RTabs.Trigger>
>(({ className, ...props }, ref) => (
  <RTabs.Trigger ref={ref} className={cn("htab", className)} {...props} />
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = RTabs.Content;
