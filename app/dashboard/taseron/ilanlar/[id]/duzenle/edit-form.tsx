"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { JobForm } from "@/components/jobs/job-form";
import { updateJobDraft } from "@/actions/jobs";
import { useToast } from "@/hooks/use-toast";
import type { JobPostUpdateInput } from "@/lib/validators";

export function EditJobForm({ job }: { job: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: JobPostUpdateInput) => {
    startTransition(async () => {
      const result = await updateJobDraft(job.id, data);

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
        description: "İlan güncellendi",
      });

      router.push("/dashboard/taseron/ilanlar");
      router.refresh();
    });
  };

  const defaultValues = {
    title: job.title,
    description: job.description,
    city: job.city,
    category: job.category,
    budgetMin: job.budgetMin,
    budgetMax: job.budgetMax,
    durationText: job.durationText || "",
    contactPhone: job.contactPhone || "",
    contactEmail: job.contactEmail || "",
  };

  return (
    <JobForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isLoading={isPending}
      submitLabel="Değişiklikleri Kaydet"
    />
  );
}
