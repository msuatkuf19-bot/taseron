import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .max(100, "Şifre çok uzun"),
  role: z.enum(["FIRMA", "TASERON"], {
    required_error: "Rol seçimi zorunludur",
  }),
  // Firma fields
  companyName: z.string().optional(),
  // Taşeron fields
  displayName: z.string().optional(),
  // Common
  city: z.string().min(1, "Şehir seçimi zorunludur"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Şifre zorunludur"),
});

export const jobPostSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır").max(100),
  description: z
    .string()
    .min(30, "Açıklama en az 30 karakter olmalıdır")
    .max(2000),
  city: z.string().min(1, "Şehir seçimi zorunludur"),
  category: z.string().min(1, "Kategori seçimi zorunludur"),
  budgetMin: z.coerce.number().min(0).optional().nullable(),
  budgetMax: z.coerce.number().min(0).optional().nullable(),
  durationText: z.string().max(100).optional(),
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
});

export const jobPostCreateSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır").max(100),
  description: z
    .string()
    .min(30, "Açıklama en az 30 karakter olmalıdır")
    .max(2000),
  city: z.string().min(1, "Şehir seçimi zorunludur"),
  category: z.string().min(1, "Kategori seçimi zorunludur"),
  budgetMin: z.coerce.number().min(0).optional().nullable(),
  budgetMax: z.coerce.number().min(0).optional().nullable(),
  durationText: z.string().max(100).optional(),
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
});

export const jobPostUpdateSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır").max(100),
  description: z
    .string()
    .min(30, "Açıklama en az 30 karakter olmalıdır")
    .max(2000),
  city: z.string().min(1, "Şehir seçimi zorunludur"),
  category: z.string().min(1, "Kategori seçimi zorunludur"),
  budgetMin: z.coerce.number().min(0).optional().nullable(),
  budgetMax: z.coerce.number().min(0).optional().nullable(),
  durationText: z.string().max(100).optional(),
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
});

export const bidSchema = z.object({
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır").max(1000),
  proposedPrice: z.coerce.number().min(0).optional().nullable(),
  estimatedDuration: z.string().max(100).optional(),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export const adminRejectSchema = z.object({
  reason: z.string().min(10, "Red sebebi en az 10 karakter olmalıdır").max(500),
});

export const companyProfileSchema = z.object({
  companyName: z.string().min(2, "Firma adı en az 2 karakter olmalıdır"),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().min(1, "Şehir seçimi zorunludur"),
  about: z.string().max(1000).optional(),
});

export const contractorProfileSchema = z.object({
  displayName: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  phone: z.string().optional(),
  city: z.string().min(1, "Şehir seçimi zorunludur"),
  skills: z.array(z.string()).default([]),
  experienceYears: z.coerce.number().min(0).max(50).optional().nullable(),
  about: z.string().max(1000).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type JobPostInput = z.infer<typeof jobPostSchema>;
export type JobPostCreateInput = z.infer<typeof jobPostCreateSchema>;
export type JobPostUpdateInput = z.infer<typeof jobPostUpdateSchema>;
export type BidInput = z.infer<typeof bidSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type AdminRejectInput = z.infer<typeof adminRejectSchema>;
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
export type ContractorProfileInput = z.infer<typeof contractorProfileSchema>;
