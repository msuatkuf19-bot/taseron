"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBid } from "@/actions/bids";

interface BidFormProps {
  jobId: string;
}

export function BidForm({ jobId }: BidFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    message: "",
    proposedPrice: "",
    estimatedDuration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.proposedPrice) {
      setError("Teklif tutarı girilmelidir");
      setLoading(false);
      return;
    }

    if (!formData.estimatedDuration) {
      setError("Tahmini süre girilmelidir");
      setLoading(false);
      return;
    }

    try {
      const result = await createBid(jobId, {
        message: formData.message,
        proposedPrice: parseInt(formData.proposedPrice),
        estimatedDuration: formData.estimatedDuration,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    } catch {
      setError("Teklif gönderilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 font-medium">
          Teklifiniz başarıyla gönderildi!
        </p>
        <p className="text-muted text-sm mt-2">
          Firma teklifinizi değerlendirdiğinde bilgilendirileceksiniz.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Teklif Açıklaması *</Label>
        <Textarea
          id="message"
          placeholder="İşi nasıl yapacağınızı, deneyiminizi ve neden sizi tercih etmeleri gerektiğini açıklayın..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="proposedPrice">Teklif Tutarı (₺)</Label>
          <Input
            id="proposedPrice"
            type="number"
            placeholder="Örn: 50000"
            value={formData.proposedPrice}
            onChange={(e) =>
              setFormData({ ...formData, proposedPrice: e.target.value })
            }
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedDuration">Tahmini Süre</Label>
          <Input
            id="estimatedDuration"
            placeholder="Örn: 2 hafta"
            value={formData.estimatedDuration}
            onChange={(e) =>
              setFormData({ ...formData, estimatedDuration: e.target.value })
            }
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Gönderiliyor..." : "Teklif Gönder"}
      </Button>
    </form>
  );
}
