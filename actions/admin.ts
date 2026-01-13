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
        contractor: {
          select: {
            id: true,
            displayName: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
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
