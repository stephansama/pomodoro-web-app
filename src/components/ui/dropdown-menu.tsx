import * as React from "react";
import * as RMenu from "@radix-ui/react-dropdown-menu";
import IconCheck from "~icons/mdi/check";
import { cn } from "@/lib/cn";

export const DropdownMenu = RMenu.Root;
export const DropdownMenuTrigger = RMenu.Trigger;
export const DropdownMenuGroup = RMenu.Group;
export const DropdownMenuPortal = RMenu.Portal;
export const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof RMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof RMenu.Separator>
>(({ className, ...props }, ref) => (
  <RMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-(--border)", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof RMenu.Content>,
  React.ComponentPropsWithoutRef<typeof RMenu.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <RMenu.Portal>
    <RMenu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[14rem] overflow-hidden rounded-(--radius) border border-(--border) bg-(--surface) p-1.5 shadow-(--shadow-pop) outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    />
  </RMenu.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof RMenu.Item>,
  React.ComponentPropsWithoutRef<typeof RMenu.Item>
>(({ className, ...props }, ref) => (
  <RMenu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-(--radius-sm) px-3 py-2 text-sm font-medium outline-hidden select-none transition-colors data-[highlighted]:bg-(--surface-2) data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof RMenu.Label>,
  React.ComponentPropsWithoutRef<typeof RMenu.Label>
>(({ className, ...props }, ref) => (
  <RMenu.Label
    ref={ref}
    className={cn(
      "px-3 pt-2 pb-1 text-xs font-semibold tracking-wider text-(--muted-fg) uppercase",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuRadioGroup = RMenu.RadioGroup;

export const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof RMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof RMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <RMenu.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-(--radius-sm) py-2 pr-3 pl-9 text-sm font-medium outline-hidden select-none transition-colors data-[highlighted]:bg-(--surface-2) data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center text-(--accent)">
      <RMenu.ItemIndicator>
        <IconCheck width={14} height={14} />
      </RMenu.ItemIndicator>
    </span>
    {children}
  </RMenu.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";
