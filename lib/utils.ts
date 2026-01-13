import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    KABA_INSAAT: "Kaba İnşaat",
    INCE_INSAAT: "İnce İnşaat",
    ELEKTRIK: "Elektrik",
    TESISAT: "Tesisat",
    BOYA_BADANA: "Boya & Badana",
    DEKORASYON: "Dekorasyon",
    IZOLASYON: "İzolasyon",
    CELIK_YAPI: "Çelik Yapı",
    PEYZAJ: "Peyzaj",
    RESTORASYON: "Restorasyon",
  };
  return labels[category] || category;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    OPEN: "Açık",
    CLOSED: "Kapalı",
    PENDING: "Beklemede",
    ACCEPTED: "Kabul Edildi",
    REJECTED: "Reddedildi",
  };
  return labels[status] || status;
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    ADMIN: "Admin",
    FIRMA: "Firma",
    TASERON: "Taşeron",
  };
  return labels[role] || role;
}

export const CATEGORIES = [
  { value: "KABA_INSAAT", label: "Kaba İnşaat" },
  { value: "INCE_INSAAT", label: "İnce İnşaat" },
  { value: "ELEKTRIK", label: "Elektrik" },
  { value: "TESISAT", label: "Tesisat" },
  { value: "BOYA_BADANA", label: "Boya & Badana" },
  { value: "DEKORASYON", label: "Dekorasyon" },
  { value: "IZOLASYON", label: "İzolasyon" },
  { value: "CELIK_YAPI", label: "Çelik Yapı" },
  { value: "PEYZAJ", label: "Peyzaj" },
  { value: "RESTORASYON", label: "Restorasyon" },
];

export const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Mersin",
  "Kayseri",
  "Eskişehir",
  "Denizli",
  "Samsun",
  "Trabzon",
  "Kocaeli",
];
