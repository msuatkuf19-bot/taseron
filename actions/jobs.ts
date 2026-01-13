"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  jobPostCreateSchema,
  jobPostUpdateSchema,
  adminRejectSchema,
  type JobPostCreateInput,
  type JobPostUpdateInput,
  type AdminRejectInput,
} from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { Category, JobStatus, ApprovalStatus } from "@prisma/client";

// ============ TAŞERON ACTIONS ============

/**
 * Taşeron için yeni ilan oluşturur (DRAFT durumunda)
 */
export async function createJobDraft(data: JobPostCreateInput) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { error: "Bu işlem için taşeron hesabı gerekli" };
    }

    if (!session.user.contractorProfileId) {
      return { error: "Taşeron profili bulunamadı" };
    }

    const validatedData = jobPostCreateSchema.parse(data);

    // Taşeron için CompanyProfile kontrol/oluşturma
    let companyId = session.user.companyProfileId;
    
    if (!companyId) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { contractorProfile: true },
      });

      if (!user?.contractorProfile) {
        return { error: "Profil bilgisi bulunamadı" };
      }

      const companyProfile = await prisma.companyProfile.create({
        data: {
          userId: session.user.id,
          companyName: user.contractorProfile.displayName,
          city: user.contractorProfile.city,
          phone: user.contractorProfile.phone || "",
        },
      });
      companyId = companyProfile.id;
    }

    const job = await prisma.jobPost.create({
      data: {
        companyId: companyId,
        createdById: session.user.id,
        createdByRole: "TASERON",
        title: validatedData.title,
        description: validatedData.description,
        city: validatedData.city,
        category: validatedData.category as Category,
        budgetMin: validatedData.budgetMin || null,
        budgetMax: validatedData.budgetMax || null,
        durationText: validatedData.durationText || null,
        contactPhone: validatedData.contactPhone || null,
        contactEmail: validatedData.contactEmail || null,
        status: "OPEN",
        approvalStatus: "DRAFT",
      },
    });

    revalidatePath("/dashboard/taseron/ilanlar");

    return { success: true, jobId: job.id };
  } catch (error) {
    console.error("Create job draft error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlan taslağı oluşturulurken bir hata oluştu" };
  }
}

/**
 * Taşeron ilanını DRAFT/REJECTED durumundan PENDING_APPROVAL'a gönderir
 */
export async function submitJobForApproval(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { error: "Bu işlem için taşeron hesabı gerekli" };
    }

    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        createdById: session.user.id,
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı veya yetkiniz yok" };
    }

    if (job.approvalStatus !== "DRAFT" && job.approvalStatus !== "REJECTED") {
      return {
        error: "Sadece taslak veya reddedilen ilanlar onaya gönderilebilir",
      };
    }

    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        approvalStatus: "PENDING_APPROVAL",
        rejectedAt: null,
        rejectedById: null,
        rejectionReason: null,
      },
    });

    revalidatePath("/dashboard/taseron/ilanlar");
    revalidatePath("/admin/ilan-onay");

    return { success: true };
  } catch (error) {
    console.error("Submit job for approval error:", error);
    return { error: "İlan onaya gönderilirken bir hata oluştu" };
  }
}

/**
 * Taşeron kendi ilanını günceller (sadece DRAFT veya REJECTED durumunda)
 */
export async function updateJobDraft(
  jobId: string,
  data: JobPostUpdateInput
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { error: "Bu işlem için taşeron hesabı gerekli" };
    }

    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        createdById: session.user.id,
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı veya yetkiniz yok" };
    }

    if (job.approvalStatus !== "DRAFT" && job.approvalStatus !== "REJECTED") {
      return { error: "Sadece taslak veya reddedilen ilanlar düzenlenebilir" };
    }

    const validatedData = jobPostUpdateSchema.parse(data);

    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        city: validatedData.city,
        category: validatedData.category as Category,
        budgetMin: validatedData.budgetMin || null,
        budgetMax: validatedData.budgetMax || null,
        durationText: validatedData.durationText || null,
        contactPhone: validatedData.contactPhone || null,
        contactEmail: validatedData.contactEmail || null,
      },
    });

    revalidatePath("/dashboard/taseron/ilanlar");
    revalidatePath(`/dashboard/taseron/ilanlar/${jobId}/duzenle`);

    return { success: true };
  } catch (error) {
    console.error("Update job draft error:", error);
    return { error: "İlan güncellenirken bir hata oluştu" };
  }
}

/**
 * Taşeron kendi ilanlarını onay durumuna göre listeler
 */
export async function listMyJobsByApprovalStatus(
  status?: ApprovalStatus | "ALL"
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { error: "Bu işlem için taşeron hesabı gerekli" };
    }

    const jobs = await prisma.jobPost.findMany({
      where: {
        createdById: session.user.id,
        isDeleted: false,
        ...(status && status !== "ALL" && { approvalStatus: status }),
      },
      include: {
        _count: {
          select: { bids: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { jobs };
  } catch (error) {
    console.error("List my jobs error:", error);
    return { error: "İlanlar yüklenirken bir hata oluştu" };
  }
}

/**
 * Taşeron kendi ilanının detayını alır
 */
export async function getMyJobById(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { error: "Bu işlem için taşeron hesabı gerekli" };
    }

    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        createdById: session.user.id,
        isDeleted: false,
      },
      include: {
        _count: {
          select: { bids: true },
        },
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı" };
    }

    return { job };
  } catch (error) {
    console.error("Get my job error:", error);
    return { error: "İlan yüklenirken bir hata oluştu" };
  }
}

// ============ FIRMA ACTIONS ============

/**
 * Firma için onaylanmış ilanları listeler (tüm kullanıcılar tarafından erişilebilir)
 */
export async function listApprovedJobs(filters?: {
  city?: string;
  category?: string;
  search?: string;
  budgetMin?: number;
  budgetMax?: number;
}) {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: {
        isDeleted: false,
        status: "OPEN",
        approvalStatus: "APPROVED",
        ...(filters?.city && { city: filters.city }),
        ...(filters?.category && { category: filters.category as Category }),
        ...(filters?.budgetMin && { budgetMin: { gte: filters.budgetMin } }),
        ...(filters?.budgetMax && { budgetMax: { lte: filters.budgetMax } }),
        ...(filters?.search && {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            city: true,
          },
        },
        _count: {
          select: { bids: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { jobs };
  } catch (error) {
    console.error("List approved jobs error:", error);
    return { error: "İlanlar yüklenirken bir hata oluştu" };
  }
}

/**
 * İlan detayını getirir (sadece APPROVED ilanlar veya kendi ilanları)
 */
export async function getJobById(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        isDeleted: false,
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            city: true,
            phone: true,
            about: true,
            userId: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: { bids: true },
        },
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı" };
    }

    // Eğer APPROVED değilse, sadece owner veya admin görebilir
    if (job.approvalStatus !== "APPROVED") {
      if (
        !session?.user ||
        (session.user.id !== job.createdById && session.user.role !== "ADMIN")
      ) {
        return { error: "Bu ilana erişim yetkiniz yok" };
      }
    }

    return { job };
  } catch (error) {
    console.error("Get job error:", error);
    return { error: "İlan yüklenirken bir hata oluştu" };
  }
}

// ============ ADMIN ACTIONS ============

/**
 * Admin için onay bekleyen ilanları listeler
 */
export async function adminListPendingJobs(filters?: {
  city?: string;
  category?: string;
  search?: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin hesabı gerekli" };
    }

    const jobs = await prisma.jobPost.findMany({
      where: {
        isDeleted: false,
        approvalStatus: "PENDING_APPROVAL",
        ...(filters?.city && { city: filters.city }),
        ...(filters?.category && { category: filters.category as Category }),
        ...(filters?.search && {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
            contractorProfile: {
              select: {
                displayName: true,
                city: true,
              },
            },
          },
        },
        company: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: { createdAt: "asc" }, // En eski ilk
    });

    return { jobs };
  } catch (error) {
    console.error("Admin list pending jobs error:", error);
    return { error: "İlanlar yüklenirken bir hata oluştu" };
  }
}

/**
 * Admin için onay bekleyen ilanın detayını getirir
 */
export async function adminGetJobById(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin hesabı gerekli" };
    }

    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        isDeleted: false,
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            city: true,
            phone: true,
            about: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
            contractorProfile: {
              select: {
                displayName: true,
                city: true,
                phone: true,
                skills: true,
                experienceYears: true,
              },
            },
          },
        },
        _count: {
          select: { bids: true },
        },
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı" };
    }

    return { job };
  } catch (error) {
    console.error("Admin get job error:", error);
    return { error: "İlan yüklenirken bir hata oluştu" };
  }
}

/**
 * Admin ilanı onaylar
 */
export async function adminApproveJob(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin hesabı gerekli" };
    }

    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return { error: "İlan bulunamadı" };
    }

    if (job.approvalStatus !== "PENDING_APPROVAL") {
      return { error: "Bu ilan onay beklemede değil" };
    }

    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        approvalStatus: "APPROVED",
        approvedAt: new Date(),
        approvedById: session.user.id,
        rejectedAt: null,
        rejectedById: null,
        rejectionReason: null,
      },
    });

    revalidatePath("/admin/ilan-onay");
    revalidatePath("/ilanlar");
    revalidatePath(`/ilan/${jobId}`);

    return { success: true };
  } catch (error) {
    console.error("Admin approve job error:", error);
    return { error: "İlan onaylanırken bir hata oluştu" };
  }
}

/**
 * Admin ilanı reddeder (sebep zorunlu)
 */
export async function adminRejectJob(jobId: string, rejectData: AdminRejectInput) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin hesabı gerekli" };
    }

    const validatedData = adminRejectSchema.parse(rejectData);

    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return { error: "İlan bulunamadı" };
    }

    if (job.approvalStatus !== "PENDING_APPROVAL") {
      return { error: "Bu ilan onay beklemede değil" };
    }

    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        approvalStatus: "REJECTED",
        rejectedAt: new Date(),
        rejectedById: session.user.id,
        rejectionReason: validatedData.reason,
        approvedAt: null,
        approvedById: null,
      },
    });

    revalidatePath("/admin/ilan-onay");
    revalidatePath(`/ilan/${jobId}`);

    return { success: true };
  } catch (error) {
    console.error("Admin reject job error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlan reddedilirken bir hata oluştu" };
  }
}

/**
 * Admin onaylı ilanı yayından kaldırır
 */
export async function adminUnpublishJob(jobId: string, reason?: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin hesabı gerekli" };
    }

    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return { error: "İlan bulunamadı" };
    }

    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        approvalStatus: "REJECTED",
        rejectedAt: new Date(),
        rejectedById: session.user.id,
        rejectionReason: reason || "Admin tarafından yayından kaldırıldı",
        status: "CLOSED",
      },
    });

    revalidatePath("/admin/ilan-onay");
    revalidatePath("/admin/jobs");
    revalidatePath("/ilanlar");
    revalidatePath(`/ilan/${jobId}`);

    return { success: true };
  } catch (error) {
    console.error("Admin unpublish job error:", error);
    return { error: "İlan yayından kaldırılırken bir hata oluştu" };
  }
}

// ============ LEGACY COMPATIBILITY ============

/**
 * İlan durumunu aç/kapa (OPEN/CLOSED)
 */
export async function toggleJobStatus(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { error: "Oturum bulunamadı" };
    }

    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return { error: "İlan bulunamadı" };
    }

    // Sadece kendi ilanını veya admin değiştirebilir
    if (job.createdById !== session.user.id && session.user.role !== "ADMIN") {
      return { error: "Bu işlem için yetkiniz yok" };
    }

    const newStatus: JobStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";

    await prisma.jobPost.update({
      where: { id: jobId },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/firma");
    revalidatePath("/dashboard/taseron/ilanlar");
    revalidatePath("/admin/jobs");
    revalidatePath(`/ilan/${jobId}`);

    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Toggle job status error:", error);
    return { error: "Durum değiştirilirken bir hata oluştu" };
  }
}

/**
 * Firma kendi ilanlarını listeler
 */
export async function getMyJobs() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { error: "Oturum bulunamadı" };
    }

    const jobs = await prisma.jobPost.findMany({
      where: {
        createdById: session.user.id,
        isDeleted: false,
      },
      include: {
        _count: {
          select: { bids: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { jobs };
  } catch (error) {
    console.error("Get my jobs error:", error);
    return { error: "İlanlar yüklenirken bir hata oluştu" };
  }
}
