import { useState } from "react";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { exportData } from "@/db/sessions";
import { clearAllData } from "@/db/tasks";

export function DataActions() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onExport = async () => {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tomato-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    toast("Exported your data.");
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="ghost" onClick={onExport}>
        <Download size={16} /> Export JSON
      </Button>
      <Button variant="danger" onClick={() => setConfirmOpen(true)}>
        <Trash2 size={16} /> Clear all data
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all data?</DialogTitle>
            <DialogDescription>
              This removes every task and session from this device. Settings
              stay. There's no undo — export first if you want a copy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await clearAllData();
                setConfirmOpen(false);
                toast("All data cleared.");
              }}
            >
              Yes, clear it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
