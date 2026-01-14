"use server";

import { revalidatePath } from "next/cache";
import { Category, JobStatus, ApprovalStatus, Role } from "@prisma/client";
import prisma from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import {
  jobPostCreateSchema,
  jobPostUpdateSchema,
  adminRejectSchema,
  type JobPostCreateInput,
  type JobPostUpdateInput,
  type AdminRejectInput,
} from "@/lib/validators";

// ============ PUBLIC ACTIONS ============

/**
 * Public olarak onaylanmış ilanları listeler (filtreleme ile)
 */
export async function listApprovedJobs(filters?: {
  search?: string;
  category?: Category;
  city?: string;
  budgetMin?: number;
  budgetMax?: number;
  sortBy?: "newest" | "oldest" | "budget_low" | "budget_high";
  page?: number;
  pageSize?: number;
}) {
  try {
    const {
      search,
      category,
      city,
      budgetMin,
      budgetMax,
      sortBy = "newest",
      page = 1,
      pageSize = 12,
    } = filters || {};

    const where: any = {
      approvalStatus: "APPROVED",
      status: "OPEN",
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (budgetMin !== undefined || budgetMax !== undefined) {
      where.budgetMin = {};
      if (budgetMin) where.budgetMin.gte = budgetMin;
      if (budgetMax) where.budgetMax = { lte: budgetMax };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "oldest") orderBy = { createdAt: "asc" };
    if (sortBy === "budget_low") orderBy = { budgetMin: "asc" };
    if (sortBy === "budget_high") orderBy = { budgetMax: "desc" };

    const [jobs, total] = await Promise.all([
      prisma.jobPost.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          company: {
            include: {
              user: {
                include: {
                  contractorProfile: {
                    select: { displayName: true, city: true },
                  },
                },
              },
            },
          },
          _count: {
            select: { bids: true },
          },
        },
      }),
      prisma.jobPost.count({ where }),
    ]);

    return {
      jobs,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("List approved jobs error:", error);
    throw new Error("İlanlar yüklenirken hata oluştu");
  }
}

/**
 * Public ilan detayını getirir (sadece APPROVED)
 */
export async function getApprovedJobById(jobId: string) {
  try {
    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        approvalStatus: "APPROVED",
        isDeleted: false,
      },
      include: {
        company: {
          include: {
            user: {
              include: {
                contractorProfile: true,
              },
            },
          },
        },
        createdBy: {
          include: {
            contractorProfile: true,
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
    console.error("Get job error:", error);
    return { error: "İlan detayı yüklenirken hata oluştu" };
  }
}

/**
 * İlan görüntüleme sayacını artırır
 */
export async function incrementJobView(jobId: string) {
  try {
    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Increment view error:", error);
    return { error: "View sayacı güncellenemedi" };
  }
}

// ============ TAŞERON ACTIONS ============

/**
 * Taşeron için yeni taslak ilan oluşturur
 */
export async function createJobDraft(data: JobPostCreateInput) {
  try {
    const user = await requireRole("TASERON");

    // Validation
    const validatedData = jobPostCreateSchema.parse(data);

    // CompanyProfile kontrolü (taşeron kendi adına ilan açar)
    let companyId = user.companyProfileId;
    
    if (!companyId) {
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        include: { contractorProfile: true },
      });

      if (!userProfile?.contractorProfile) {
        return { error: "Profil bilgisi bulunamadı" };
      }

      // Otomatik company profile oluştur
      const companyProfile = await prisma.companyProfile.create({
        data: {
          userId: user.id,
          companyName: userProfile.contractorProfile.displayName,
          city: userProfile.contractorProfile.city,
          phone: userProfile.contractorProfile.phone || "",
        },
      });
      companyId = companyProfile.id;
    }

    const job = await prisma.jobPost.create({
      data: {
        companyId,
        createdById: user.id,
        createdByRole: "TASERON",
        title: validatedData.title,
        description: validatedData.description,
        city: validatedData.city,
        category: validatedData.category as Category,
        budgetMin: validatedData.budgetMin,
        budgetMax: validatedData.budgetMax,
        durationText: validatedData.durationText,
        contactPhone: validatedData.contactPhone,
        contactEmail: validatedData.contactEmail,
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
    return { error: "İlan oluşturulurken hata oluştu" };
  }
}

/**
 * Taşeron taslak ilanını günceller
 */
export async function updateJobDraft(jobId: string, data: JobPostUpdateInput) {
  try {
    const user = await requireRole("TASERON");
    const validatedData = jobPostUpdateSchema.parse(data);

    // İlan sahibi kontrolü
    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        createdById: user.id,
        approvalStatus: { in: ["DRAFT", "REJECTED"] },
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı veya düzenlenemez" };
    }

    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        city: validatedData.city,
        category: validatedData.category as Category,
        budgetMin: validatedData.budgetMin,
        budgetMax: validatedData.budgetMax,
        durationText: validatedData.durationText,
        contactPhone: validatedData.contactPhone,
        contactEmail: validatedData.contactEmail,
      },
    });

    revalidatePath("/dashboard/taseron/ilanlar");
    revalidatePath(`/dashboard/taseron/ilanlar/${jobId}/duzenle`);
    return { success: true };
  } catch (error) {
    console.error("Update job error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlan güncellenirken hata oluştu" };
  }
}

/**
 * İlanı onaya gönderir (DRAFT/REJECTED → PENDING_APPROVAL)
 */
export async function submitJobForApproval(jobId: string) {
  try {
    const user = await requireRole("TASERON");

    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        createdById: user.id,
        approvalStatus: { in: ["DRAFT", "REJECTED"] },
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı" };
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
    revalidatePath("/admin/approvals");
    return { success: true };
  } catch (error) {
    console.error("Submit for approval error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlan onaya gönderilirken hata oluştu" };
  }
}

/**
 * Taşeron kendi ilanlarını duruma göre listeler
 */
export async function listMyJobsByApprovalStatus(status?: ApprovalStatus) {
  try {
    const user = await requireRole("TASERON");

    const where: any = {
      createdById: user.id,
      isDeleted: false,
    };

    if (status) {
      where.approvalStatus = status;
    }

    const jobs = await prisma.jobPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { bids: true },
        },
      },
    });

    return { jobs };
  } catch (error) {
    console.error("List my jobs error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlanlar yüklenirken hata oluştu" };
  }
}

/**
 * Taşeron kendi ilan detayını getirir
 */
export async function getMyJobById(jobId: string) {
  try {
    const user = await requireRole("TASERON");

    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        createdById: user.id,
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
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlan yüklenirken hata oluştu" };
  }
}

// ============ ADMIN ACTIONS ============

/**
 * Admin onay bekleyen ilanları listeler
 */
export async function adminListPendingJobs() {
  try {
    await requireRole("ADMIN");

    const jobs = await prisma.jobPost.findMany({
      where: {
        approvalStatus: "PENDING_APPROVAL",
        isDeleted: false,
      },
      orderBy: { createdAt: "asc" },
      include: {
        createdBy: {
          include: {
            contractorProfile: true,
          },
        },
      },
    });

    return { jobs };
  } catch (error) {
    console.error("Admin list pending jobs error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Onay bekleyen ilanlar yüklenirken hata oluştu" };
  }
}

/**
 * Admin ilan detayını getirir
 */
export async function adminGetJobById(jobId: string) {
  try {
    await requireRole("ADMIN");

    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
      include: {
        createdBy: {
          include: {
            contractorProfile: true,
          },
        },
        company: true,
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
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlan yüklenirken hata oluştu" };
  }
}

/**
 * Admin ilanı onaylar
 */
export async function adminApproveJob(jobId: string) {
  try {
    const user = await requireRole("ADMIN");

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
        approvedById: user.id,
        publishedAt: new Date(),
      },
    });

    revalidatePath("/admin/approvals");
    revalidatePath("/ilanlar");
    return { success: true };
  } catch (error) {
    console.error("Admin approve job error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlan onaylanırken hata oluştu" };
  }
}

/**
 * Admin ilanı reddeder (sebep zorunlu)
 */
export async function adminRejectJob(jobId: string, data: AdminRejectInput) {
  try {
    const user = await requireRole("ADMIN");
    const validatedData = adminRejectSchema.parse(data);

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
        rejectedById: user.id,
        rejectionReason: validatedData.reason,
      },
    });

    revalidatePath("/admin/approvals");
    return { success: true };
  } catch (error) {
    console.error("Admin reject job error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlan reddedilirken hata oluştu" };
  }
}

/**
 * Admin tüm ilanları listeler (filtre ile)
 */
export async function adminListAllJobs(filters?: {
  approvalStatus?: ApprovalStatus;
  status?: JobStatus;
  search?: string;
}) {
  try {
    await requireRole("ADMIN");

    const where: any = {
      isDeleted: false,
    };

    if (filters?.approvalStatus) {
      where.approvalStatus = filters.approvalStatus;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const jobs = await prisma.jobPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          include: {
            contractorProfile: true,
            companyProfile: true,
          },
        },
        _count: {
          select: { bids: true },
        },
      },
    });

    return { jobs };
  } catch (error) {
    console.error("Admin list all jobs error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlanlar yüklenirken hata oluştu" };
  }
}

/**
 * Admin ilanı yayından kaldırır
 */
export async function adminUnpublishJob(jobId: string, reason?: string) {
  try {
    const user = await requireRole("ADMIN");

    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        approvalStatus: "REJECTED",
        status: "CLOSED",
        rejectedAt: new Date(),
        rejectedById: user.id,
        rejectionReason: reason || "Admin tarafından yayından kaldırıldı",
      },
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/ilanlar");
    return { success: true };
  } catch (error) {
    console.error("Admin unpublish job error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İlan yayından kaldırılırken hata oluştu" };
  }
}

/**
 * Admin dashboard istatistikleri
 */
export async function getAdminDashboardStats() {
  try {
    await requireRole("ADMIN");

    const [
      totalUsers,
      totalJobs,
      pendingJobs,
      approvedJobs,
      todayApprovals,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.jobPost.count({ where: { isDeleted: false } }),
      prisma.jobPost.count({
        where: { approvalStatus: "PENDING_APPROVAL", isDeleted: false },
      }),
      prisma.jobPost.count({
        where: { approvalStatus: "APPROVED", isDeleted: false },
      }),
      prisma.jobPost.count({
        where: {
          approvalStatus: "APPROVED",
          approvedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalJobs,
      pendingJobs,
      approvedJobs,
      todayApprovals,
    };
  } catch (error) {
    console.error("Get admin stats error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "İstatistikler yüklenirken hata oluştu" };
  }
}
