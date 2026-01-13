"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { submitJobForApproval } from "@/actions/jobs";
import { useToast } from "@/hooks/use-toast";
import { ApprovalStatusBadge } from "@/components/jobs/approval-status-badge";

export default function OnayaGonderClient({ job }: { job: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await submitJobForApproval(job.id);

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Başarılı",
        description: "İlan onaya gönderildi. Admin incelemesinden sonra yayınlanacaktır.",
      });

      router.push("/dashboard/taseron/ilanlar");
      router.refresh();
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/taseron/ilanlar">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">İlanı Onaya Gönder</CardTitle>
            <ApprovalStatusBadge approvalStatus={job.approvalStatus} />
          </div>
          <CardDescription>
            İlanınızı onaya göndermeden önce detayları kontrol edin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {job.city} • {getCategoryLabel(job.category)}
            </p>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          {(job.budgetMin || job.budgetMax) && (
            <div>
              <h4 className="font-semibold mb-1">Bütçe</h4>
              <p className="text-gray-700">
                {job.budgetMin && job.budgetMax
                  ? `${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()} ₺`
                  : job.budgetMin
                  ? `${job.budgetMin.toLocaleString()} ₺'den başlayan`
                  : `${job.budgetMax.toLocaleString()} ₺'ye kadar`}
              </p>
            </div>
          )}

          {job.durationText && (
            <div>
              <h4 className="font-semibold mb-1">Tahmini Süre</h4>
              <p className="text-gray-700">{job.durationText}</p>
            </div>
          )}

          {job.rejectionReason && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Önceki Red Sebebi
              </h4>
              <p className="text-sm text-yellow-700">{job.rejectionReason}</p>
              <p className="text-sm text-yellow-600 mt-2">
                Gerekli düzeltmeleri yaptıktan sonra tekrar onaya gönderebilirsiniz.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              Onay Süreci Hakkında
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• İlanınız admin tarafından incelenecektir</li>
              <li>• Onay süreci genellikle 1-2 iş günü sürer</li>
              <li>• Onaylandığında ilan otomatik olarak yayınlanır</li>
              <li>
                • Reddedilirse sebep bildirilir ve düzeltme yapabilirsiniz
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/dashboard/taseron/ilanlar/${job.id}/duzenle`}>
                Düzenle
              </Link>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 bg-[#F37021] hover:bg-[#D85F17]"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPending ? "Gönderiliyor..." : "Onaya Gönder"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    KABA_INSAAT: "Kaba İnşaat",
    INCE_INSAAT: "İnce İnşaat",
    ELEKTRIK: "Elektrik",
    TESISAT: "Tesisat",
    BOYA_BADANA: "Boya Badana",
    DEKORASYON: "Dekorasyon",
    IZOLASYON: "İzolasyon",
    CELIK_YAPI: "Çelik Yapı",
    PEYZAJ: "Peyzaj",
    RESTORASYON: "Restorasyon",
  };
  return categories[category] || category;
}
