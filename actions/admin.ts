"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    const [
      totalUsers,
      totalFirma,
      totalTaseron,
      totalJobs,
      openJobs,
      totalBids,
      totalReviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "FIRMA" } }),
      prisma.user.count({ where: { role: "TASERON" } }),
      prisma.jobPost.count({ where: { isDeleted: false } }),
      prisma.jobPost.count({ where: { isDeleted: false, status: "OPEN" } }),
      prisma.bid.count(),
      prisma.review.count(),
    ]);

    return {
      stats: {
        totalUsers,
        totalFirma,
        totalTaseron,
        totalJobs,
        openJobs,
        totalBids,
        totalReviews,
      },
    };
  } catch (error) {
    console.error("Get admin stats error:", error);
    return { error: "İstatistikler yüklenirken bir hata oluştu" };
  }
}

export async function getAdminUsers() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        companyProfile: {
          select: { companyName: true },
        },
        contractorProfile: {
          select: { displayName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { users };
  } catch (error) {
    console.error("Get admin users error:", error);
    return { error: "Kullanıcılar yüklenirken bir hata oluştu" };
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "Kullanıcı bulunamadı" };
    }

    if (user.role === "ADMIN") {
      return { error: "Admin kullanıcı durumu değiştirilemez" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    revalidatePath("/admin/users");

    return { success: true, newStatus: !user.isActive };
  } catch (error) {
    console.error("Toggle user status error:", error);
    return { error: "Kullanıcı durumu değiştirilirken bir hata oluştu" };
  }
}

export async function getAdminJobs() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    const jobs = await prisma.jobPost.findMany({
      include: {
        company: {
          select: {
            companyName: true,
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
    console.error("Get admin jobs error:", error);
    return { error: "İlanlar yüklenirken bir hata oluştu" };
  }
}

export async function adminToggleJobStatus(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return { error: "İlan bulunamadı" };
    }

    await prisma.jobPost.update({
      where: { id: jobId },
      data: { status: job.status === "OPEN" ? "CLOSED" : "OPEN" },
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/ilanlar");

    return { success: true };
  } catch (error) {
    console.error("Admin toggle job status error:", error);
    return { error: "İlan durumu değiştirilirken bir hata oluştu" };
  }
}

export async function adminDeleteJob(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    await prisma.jobPost.update({
      where: { id: jobId },
      data: { isDeleted: true },
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/ilanlar");

    return { success: true };
  } catch (error) {
    console.error("Admin delete job error:", error);
    return { error: "İlan silinirken bir hata oluştu" };
  }
}

export async function getAdminReviews() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    const reviews = await prisma.review.findMany({
      include: {
        reviewed: {
          select: {
            id: true,
            displayName: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            email: true,
            companyProfile: {
              select: {
                companyName: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { reviews };
  } catch (error) {
    console.error("Get admin reviews error:", error);
    return { error: "Yorumlar yüklenirken bir hata oluştu" };
  }
}

export async function adminDeleteReview(reviewId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Admin delete review error:", error);
    return { error: "Yorum silinirken bir hata oluştu" };
  }
}

/**
 * Admin: Onay bekleyen ilanları listeler
 */
export async function adminListPendingJobs() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    const jobs = await prisma.jobPost.findMany({
      where: {
        approvalStatus: "PENDING_APPROVAL",
        isDeleted: false,
      },
      include: {
        createdBy: {
          select: {
            email: true,
            contractorProfile: {
              select: {
                displayName: true,
                city: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" }, // En eski önce
    });

    return { jobs };
  } catch (error) {
    console.error("Admin list pending jobs error:", error);
    return { error: "İlanlar yüklenirken bir hata oluştu" };
  }
}

/**
 * Admin: İlanı onayla ve yayına al
 */
export async function adminApproveJob(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
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
        publishedAt: new Date(),
        approvedAt: new Date(),
        approvedById: session.user.id,
        rejectedAt: null,
        rejectedById: null,
        rejectionReason: null,
      },
    });

    revalidatePath("/admin/approvals");
    revalidatePath("/admin/ilan-onay");
    revalidatePath("/ilanlar");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Admin approve job error:", error);
    return { error: "İlan onaylanırken bir hata oluştu" };
  }
}

/**
 * Admin: İlanı reddet (sebep zorunlu)
 */
export async function adminRejectJob(jobId: string, reason: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    if (!reason || reason.trim().length < 10) {
      return { error: "Red sebebi en az 10 karakter olmalıdır" };
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
        approvalStatus: "REJECTED",
        rejectedAt: new Date(),
        rejectedById: session.user.id,
        rejectionReason: reason.trim(),
        approvedAt: null,
        approvedById: null,
        publishedAt: null,
      },
    });

    revalidatePath("/admin/approvals");
    revalidatePath("/admin/ilan-onay");
    revalidatePath("/dashboard/taseron/ilanlar");

    return { success: true };
  } catch (error) {
    console.error("Admin reject job error:", error);
    return { error: "İlan reddedilirken bir hata oluştu" };
  }
}
