import * as React from "react";
import * as RDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export const Sheet = RDialog.Root;
export const SheetTrigger = RDialog.Trigger;
export const SheetClose = RDialog.Close;

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof RDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof RDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RDialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

export const SheetContent = React.forwardRef<
  React.ComponentRef<typeof RDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RDialog.Content> & {
    side?: "right" | "bottom";
  }
>(({ className, children, side = "right", ...props }, ref) => (
  <RDialog.Portal>
    <SheetOverlay />
    <RDialog.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col gap-4 bg-(--surface) p-6 shadow-(--shadow-pop) outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out",
        side === "right" &&
          "top-0 right-0 h-full w-[min(94vw,420px)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:rounded-l-(--radius-lg)",
        side === "bottom" &&
          "right-0 bottom-0 left-0 max-h-[88vh] rounded-t-(--radius-lg) data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        className,
      )}
      {...props}
    >
      {children}
      <RDialog.Close
        className="iconbtn absolute top-3 right-3"
        aria-label="Close"
      >
        <X size={18} />
      </RDialog.Close>
    </RDialog.Content>
  </RDialog.Portal>
));
SheetContent.displayName = "SheetContent";

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof RDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RDialog.Title>
>(({ className, ...props }, ref) => (
  <RDialog.Title
    ref={ref}
    className={cn(
      "text-lg leading-tight font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof RDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RDialog.Description>
>(({ className, ...props }, ref) => (
  <RDialog.Description
    ref={ref}
    className={cn("text-sm text-(--muted-fg)", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";
