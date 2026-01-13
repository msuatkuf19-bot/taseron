"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { adminApproveJob, adminRejectJob } from "@/actions/jobs";
import { CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminModerationActionsProps {
  jobId: string;
  onSuccess?: () => void;
}

export function AdminModerationActions({
  jobId,
  onSuccess,
}: AdminModerationActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = () => {
    startTransition(async () => {
      const result = await adminApproveJob(jobId);

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Başarılı",
          description: "İlan başarıyla onaylandı",
        });
        onSuccess?.();
        router.push("/admin/ilan-onay");
        router.refresh();
      }
    });
  };

  const handleReject = () => {
    if (rejectionReason.trim().length < 10) {
      toast({
        title: "Hata",
        description: "Red sebebi en az 10 karakter olmalıdır",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await adminRejectJob(jobId, { reason: rejectionReason });

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Başarılı",
          description: "İlan reddedildi",
        });
        setRejectDialogOpen(false);
        setRejectionReason("");
        onSuccess?.();
        router.push("/admin/ilan-onay");
        router.refresh();
      }
    });
  };

  return (
    <>
      <div className="flex gap-3">
        <Button
          onClick={handleApprove}
          disabled={isPending}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Onayla
        </Button>
        <Button
          onClick={() => setRejectDialogOpen(true)}
          disabled={isPending}
          variant="destructive"
          className="flex-1"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Reddet
        </Button>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlanı Reddet</DialogTitle>
            <DialogDescription>
              İlanın reddedilme sebebini belirtin. Bu sebep ilan sahibine
              gösterilecektir.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Red Sebebi *</Label>
              <Textarea
                id="reason"
                placeholder="İlanın neden reddedildiğini açıklayın..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Minimum 10 karakter
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isPending}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isPending || rejectionReason.trim().length < 10}
            >
              Reddet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
