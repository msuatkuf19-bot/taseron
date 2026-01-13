"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { JobForm } from "@/components/jobs/job-form";
import { createJobDraft, submitJobForApproval } from "@/actions/jobs";
import { useToast } from "@/hooks/use-toast";
import type { JobPostCreateInput } from "@/lib/validators";

export default function YeniIlanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [saveAsDraft, setSaveAsDraft] = useState(true);

  const handleSubmit = async (data: JobPostCreateInput) => {
    startTransition(async () => {
      // İlk olarak taslak oluştur
      const result = await createJobDraft(data);

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      const jobId = result.jobId!;

      // Eğer direkt onaya gönderme seçilmişse
      if (!saveAsDraft && jobId) {
        const submitResult = await submitJobForApproval(jobId);

        if (submitResult.error) {
          toast({
            title: "Uyarı",
            description: "İlan taslak olarak kaydedildi ancak onaya gönderilemedi: " + submitResult.error,
            variant: "destructive",
          });
          router.push("/dashboard/taseron/ilanlar");
          router.refresh();
          return;
        }

        toast({
          title: "Başarılı",
          description: "İlan onaya gönderildi. Admin incelemesinden sonra yayınlanacaktır.",
        });
      } else {
        toast({
          title: "Başarılı",
          description: "İlan taslak olarak kaydedildi.",
        });
      }

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
          <CardTitle className="text-2xl">Yeni İlan Oluştur</CardTitle>
          <CardDescription>
            İlan bilgilerini doldurun. İlanınız admin onayından sonra yayınlanacaktır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel={saveAsDraft ? "Taslak Olarak Kaydet" : "Kaydet ve Onaya Gönder"}
          />

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSaveAsDraft(true)}
              type="button"
              disabled={isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Taslak Kaydet
            </Button>
            <Button
              className="flex-1 bg-[#F37021] hover:bg-[#D85F17]"
              onClick={() => setSaveAsDraft(false)}
              type="button"
              disabled={isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              Kaydet ve Onaya Gönder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
