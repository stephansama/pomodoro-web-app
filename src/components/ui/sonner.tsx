import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      duration={3200}
      visibleToasts={3}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "sonner-toast pointer-events-auto flex items-center gap-3 px-5 py-3",
        },
      }}
    />
  );
}
