"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { adminApproveJob, adminRejectJob } from "@/actions/admin";
import { getCategoryLabel, formatCurrency } from "@/lib/utils";
import { CheckCircle2, XCircle, MapPin, Calendar, DollarSign, Clock, User, Mail, Phone, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  budgetMin: number | null;
  budgetMax: number | null;
  durationText: string | null;
  createdAt: Date;
  createdBy: {
    email: string;
    contractorProfile?: {
      displayName: string;
      city: string;
      phone: string | null;
    };
  };
}

interface ApprovalReviewDrawerProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApprovalReviewDrawer({ job, open, onOpenChange }: ApprovalReviewDrawerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await adminApproveJob(job.id);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "İlan Onaylandı",
        description: "İlan başarıyla yayına alındı.",
      });
      onOpenChange(false);
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Hata",
        description: result.error || "İlan onaylanırken bir hata oluştu",
      });
    }
  };

  const handleReject = async () => {
    if (rejectionReason.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Uyarı",
        description: "Red sebebi en az 10 karakter olmalıdır",
      });
      return;
    }

    setIsLoading(true);
    const result = await adminRejectJob(job.id, rejectionReason);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "İlan Reddedildi",
        description: "İlan reddedildi ve taşerona bildirildi.",
      });
      setShowRejectDialog(false);
      onOpenChange(false);
      setRejectionReason("");
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Hata",
        description: result.error || "İlan reddedilirken bir hata oluştu",
      });
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl text-text-primary">İlan İnceleme</SheetTitle>
            <SheetDescription>
              İlanı inceleyin ve onaylayın veya reddedin
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Job Details */}
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{job.title}</h3>
              <Badge className="bg-primary-orange/10 text-primary-orange">
                {getCategoryLabel(job.category)}
              </Badge>
            </div>

            <Separator />

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary-orange mt-0.5" />
                <div>
                  <div className="text-xs text-text-secondary">Şehir</div>
                  <div className="font-medium text-text-primary">{job.city}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-primary-orange mt-0.5" />
                <div>
                  <div className="text-xs text-text-secondary">Oluşturulma</div>
                  <div className="font-medium text-text-primary">{formatDate(job.createdAt)}</div>
                </div>
              </div>

              {(job.budgetMin || job.budgetMax) && (
                <div className="flex items-start gap-2">
                  <DollarSign className="h-5 w-5 text-primary-orange mt-0.5" />
                  <div>
                    <div className="text-xs text-text-secondary">Bütçe</div>
                    <div className="font-medium text-primary-orange">
                      {job.budgetMin && job.budgetMax
                        ? `${formatCurrency(job.budgetMin)} - ${formatCurrency(job.budgetMax)}`
                        : job.budgetMin
                        ? `${formatCurrency(job.budgetMin)}+`
                        : `${formatCurrency(job.budgetMax!)} kadar`}
                    </div>
                  </div>
                </div>
              )}

              {job.durationText && (
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-primary-orange mt-0.5" />
                  <div>
                    <div className="text-xs text-text-secondary">Süre</div>
                    <div className="font-medium text-text-primary">{job.durationText}</div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h4 className="font-semibold text-text-primary mb-2">İlan Açıklaması</h4>
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            <Separator />

            {/* Creator Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-primary-orange" />
                Oluşturan Taşeron
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-text-secondary" />
                  <span className="font-medium text-text-primary">
                    {job.createdBy.contractorProfile?.displayName || "Bilinmiyor"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-text-secondary" />
                  <span className="text-text-secondary">{job.createdBy.email}</span>
                </div>
                {job.createdBy.contractorProfile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-text-secondary" />
                    <span className="text-text-secondary">{job.createdBy.contractorProfile.phone}</span>
                  </div>
                )}
                {job.createdBy.contractorProfile?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-text-secondary" />
                    <span className="text-text-secondary">{job.createdBy.contractorProfile.city}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Approval Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Onay Kriterleri
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>İlan açıklaması yeterli detayda mı?</li>
                <li>Bütçe ve süre bilgileri mantıklı mı?</li>
                <li>Kategori doğru seçilmiş mi?</li>
                <li>Spam veya yanıltıcı içerik yok mu?</li>
                <li>İletişim bilgileri uygun mu?</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1 bg-success-green hover:bg-success-green/90 gap-2"
                size="lg"
              >
                <CheckCircle2 className="h-5 w-5" />
                Onayla ve Yayınla
              </Button>
              <Button
                onClick={() => setShowRejectDialog(true)}
                disabled={isLoading}
                variant="destructive"
                className="flex-1 gap-2"
                size="lg"
              >
                <XCircle className="h-5 w-5" />
                Reddet
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlanı Reddet</DialogTitle>
            <DialogDescription>
              Lütfen red sebebini açıklayın. Bu mesaj taşerona iletilecektir.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Red sebebini yazın (min 10 karakter)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-text-secondary mt-2">
              {rejectionReason.length} / 10 minimum karakter
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading || rejectionReason.trim().length < 10}
            >
              {isLoading ? "İşleniyor..." : "Reddet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
