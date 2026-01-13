"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createJob } from "@/actions/jobs";
import { CITIES, CATEGORIES } from "@/lib/utils";

export function CreateJobDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    durationText: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await createJob({
        title: formData.title,
        description: formData.description,
        city: formData.city,
        category: formData.category,
        budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : null,
        durationText: formData.durationText || undefined,
        contactPhone: formData.contactPhone || undefined,
        contactEmail: formData.contactEmail || undefined,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        setFormData({
          title: "",
          description: "",
          city: "",
          category: "",
          budgetMin: "",
          budgetMax: "",
          durationText: "",
          contactPhone: "",
          contactEmail: "",
        });
        router.refresh();
      }
    } catch {
      setError("İlan oluşturulurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Yeni İlan Aç
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni İlan Oluştur</DialogTitle>
          <DialogDescription>
            İlan detaylarını girerek taşeronlardan teklif almaya başlayın.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">İlan Başlığı *</Label>
            <Input
              id="title"
              placeholder="Örn: Villa inşaatı için kaba inşaat ustası"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">İlan Açıklaması *</Label>
            <Textarea
              id="description"
              placeholder="İşin detaylarını, beklentilerinizi ve gerekli nitelikleri açıklayın..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Şehir *</Label>
              <Select
                value={formData.city}
                onValueChange={(value) =>
                  setFormData({ ...formData, city: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Şehir seçin" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Minimum Bütçe (₺)</Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder="Örn: 50000"
                value={formData.budgetMin}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMin: e.target.value })
                }
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetMax">Maksimum Bütçe (₺)</Label>
              <Input
                id="budgetMax"
                type="number"
                placeholder="Örn: 100000"
                value={formData.budgetMax}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMax: e.target.value })
                }
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationText">Tahmini Süre</Label>
            <Input
              id="durationText"
              placeholder="Örn: 3-4 ay"
              value={formData.durationText}
              onChange={(e) =>
                setFormData({ ...formData, durationText: e.target.value })
              }
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-4">İletişim Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Telefon</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">E-posta</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="ornek@email.com"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Oluşturuluyor..." : "İlan Oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
