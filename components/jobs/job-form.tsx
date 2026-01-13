"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobPostCreateSchema, type JobPostCreateInput } from "@/lib/validators";

const CATEGORIES = [
  { value: "KABA_INSAAT", label: "Kaba İnşaat" },
  { value: "INCE_INSAAT", label: "İnce İnşaat" },
  { value: "ELEKTRIK", label: "Elektrik" },
  { value: "TESISAT", label: "Tesisat" },
  { value: "BOYA_BADANA", label: "Boya Badana" },
  { value: "DEKORASYON", label: "Dekorasyon" },
  { value: "IZOLASYON", label: "İzolasyon" },
  { value: "CELIK_YAPI", label: "Çelik Yapı" },
  { value: "PEYZAJ", label: "Peyzaj" },
  { value: "RESTORASYON", label: "Restorasyon" },
];

const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Kocaeli",
  "Mersin",
];

interface JobFormProps {
  defaultValues?: Partial<JobPostCreateInput>;
  onSubmit: (data: JobPostCreateInput) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function JobForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Kaydet",
}: JobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<JobPostCreateInput>({
    resolver: zodResolver(jobPostCreateSchema),
    defaultValues,
  });

  const category = watch("category");
  const city = watch("city");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">İlan Başlığı *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Örn: Kaba İnşaat Ustası Aranıyor"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={category}
            onValueChange={(value) => setValue("category", value)}
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
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Şehir *</Label>
          <Select value={city} onValueChange={(value) => setValue("city", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="İş detaylarını, gerekli becerileri ve beklentileri açıklayın..."
          rows={8}
          className="resize-none"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budgetMin">Minimum Bütçe (₺)</Label>
          <Input
            id="budgetMin"
            type="number"
            {...register("budgetMin")}
            placeholder="0"
          />
          {errors.budgetMin && (
            <p className="text-sm text-red-500">{errors.budgetMin.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetMax">Maksimum Bütçe (₺)</Label>
          <Input
            id="budgetMax"
            type="number"
            {...register("budgetMax")}
            placeholder="0"
          />
          {errors.budgetMax && (
            <p className="text-sm text-red-500">{errors.budgetMax.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="durationText">Tahmini Süre</Label>
        <Input
          id="durationText"
          {...register("durationText")}
          placeholder="Örn: 30 gün, 2 ay"
        />
        {errors.durationText && (
          <p className="text-sm text-red-500">{errors.durationText.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPhone">İletişim Telefonu</Label>
          <Input
            id="contactPhone"
            {...register("contactPhone")}
            placeholder="05XX XXX XX XX"
          />
          {errors.contactPhone && (
            <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">İletişim E-posta</Label>
          <Input
            id="contactEmail"
            type="email"
            {...register("contactEmail")}
            placeholder="ornek@email.com"
          />
          {errors.contactEmail && (
            <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Kaydediliyor..." : submitLabel}
      </Button>
    </form>
  );
}
