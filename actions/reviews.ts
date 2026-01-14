"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import { z } from "zod";

// Validation schema
const createReviewSchema = z.object({
  jobId: z.string().optional(),
  reviewedId: z.string().min(1, "Değerlendirilen kullanıcı gerekli"),
  rating: z.number().min(1, "Puan en az 1 olmalı").max(5, "Puan en fazla 5 olabilir"),
  comment: z.string().optional(),
});

type CreateReviewInput = z.infer<typeof createReviewSchema>;

/**
 * Firma taşerona değerlendirme yapar
 */
export async function createReview(data: CreateReviewInput) {
  try {
    const user = await requireRole("FIRMA");

    const validatedData = createReviewSchema.parse(data);

    // Değerlendirilen kullanıcı taşeron mi kontrol et
    const reviewedUser = await prisma.user.findUnique({
      where: { id: validatedData.reviewedId },
      include: { contractorProfile: true },
    });

    if (!reviewedUser || !reviewedUser.contractorProfile) {
      return { error: "Değerlendirilen kullanıcı taşeron değil" };
    }

    // Daha önce bu kullanıcıya yorum yapmış mı?
    if (validatedData.jobId) {
      const existingReview = await prisma.review.findFirst({
        where: {
          reviewerId: user.id,
          reviewedId: validatedData.reviewedId,
          jobId: validatedData.jobId,
        },
      });

      if (existingReview) {
        return { error: "Bu iş için zaten değerlendirme yaptınız" };
      }
    }

    const review = await prisma.review.create({
      data: {
        reviewerId: user.id,
        reviewedId: validatedData.reviewedId,
        jobId: validatedData.jobId || null,
        rating: validatedData.rating,
        comment: validatedData.comment || null,
      },
    });

    revalidatePath(`/taseron/${validatedData.reviewedId}`);
    return { success: true, reviewId: review.id };
  } catch (error) {
    console.error("Create review error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Değerlendirme yapılırken hata oluştu" };
  }
}

/**
 * Kullanıcının aldığı değerlendirmeleri listeler
 */
export async function getReviewsForUser(userId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        reviewedId: userId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        reviewer: {
          include: {
            companyProfile: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Ortalama puan hesapla
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    };
  } catch (error) {
    console.error("Get reviews error:", error);
    throw new Error("Değerlendirmeler yüklenirken hata oluştu");
  }
}

/**
 * Admin bir değerlendirmeyi siler
 */
export async function deleteReview(reviewId: string) {
  try {
    await requireRole("ADMIN");

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return { error: "Değerlendirme bulunamadı" };
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidatePath("/admin/reviews");
    revalidatePath(`/taseron/${review.reviewedId}`);

    return { success: true };
  } catch (error) {
    console.error("Delete review error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Değerlendirme silinirken hata oluştu" };
  }
}

/**
 * Admin tüm değerlendirmeleri listeler
 */
export async function adminListAllReviews() {
  try {
    await requireRole("ADMIN");

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        reviewer: {
          include: {
            companyProfile: true,
          },
        },
        reviewed: true,
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return { reviews };
  } catch (error) {
    console.error("Admin list reviews error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Değerlendirmeler yüklenirken hata oluştu" };
  }
}
