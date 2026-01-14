"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createBid } from "@/actions/bids";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const bidSchema = z.object({
  proposedPrice: z.string().min(1, "Teklif tutarı girilmelidir"),
  estimatedDuration: z.string().min(1, "Tahmini süre girilmelidir"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

type BidFormData = z.infer<typeof bidSchema>;

interface BidFormProps {
  jobId: string;
}

export function BidForm({ jobId }: BidFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BidFormData>({
    resolver: zodResolver(bidSchema),
  });

  const onSubmit = async (data: BidFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createBid(jobId, {
        proposedPrice: Number(data.proposedPrice),
        estimatedDuration: data.estimatedDuration,
        message: data.message,
      });

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Teklifiniz başarıyla gönderildi",
        });
        reset();
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="proposedPrice">Teklif Tutarı (₺)</Label>
        <Input
          id="proposedPrice"
          type="number"
          placeholder="Örn: 50000"
          {...register("proposedPrice")}
          disabled={isSubmitting}
        />
        {errors.proposedPrice && (
          <p className="text-sm text-red-600 mt-1">{errors.proposedPrice.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="estimatedDuration">Tahmini Süre</Label>
        <Input
          id="estimatedDuration"
          type="text"
          placeholder="Örn: 2 hafta"
          {...register("estimatedDuration")}
          disabled={isSubmitting}
        />
        {errors.estimatedDuration && (
          <p className="text-sm text-red-600 mt-1">{errors.estimatedDuration.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Mesajınız</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Teklifinizle ilgili detayları buraya yazabilirsiniz..."
          {...register("message")}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          "Teklif Gönder"
        )}
      </Button>
    </form>
  );
}
