"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { reviewSchema, type ReviewInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createReview(
  contractorId: string,
  jobId: string,
  data: ReviewInput
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "FIRMA") {
      return { error: "Bu işlem için firma hesabı gerekli" };
    }

    if (!session.user.companyProfileId) {
      return { error: "Firma profili bulunamadı" };
    }

    // Verify that there's an accepted bid for this job from this contractor
    const acceptedBid = await prisma.bid.findFirst({
      where: {
        jobId,
        contractorId,
        status: "ACCEPTED",
        job: {
          companyId: session.user.companyProfileId,
        },
      },
    });

    if (!acceptedBid) {
      return { error: "Bu taşeron için kabul edilmiş bir teklif bulunamadı" };
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        contractorId,
        companyId: session.user.companyProfileId,
        jobId,
      },
    });

    if (existingReview) {
      return { error: "Bu iş için zaten yorum yapmışsınız" };
    }

    const validatedData = reviewSchema.parse(data);

    const review = await prisma.review.create({
      data: {
        contractorId,
        companyId: session.user.companyProfileId,
        jobId,
        rating: validatedData.rating,
        comment: validatedData.comment || null,
      },
    });

    revalidatePath(`/taseron/${contractorId}`);
    revalidatePath("/dashboard/firma");

    return { success: true, reviewId: review.id };
  } catch (error) {
    console.error("Create review error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Yorum oluşturulurken bir hata oluştu" };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gerekli" };
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return { error: "Yorum bulunamadı" };
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidatePath(`/taseron/${review.contractorId}`);
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Delete review error:", error);
    return { error: "Yorum silinirken bir hata oluştu" };
  }
}

export async function getReviewsForContractor(contractorId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { contractorId },
      include: {
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

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return { reviews, avgRating, totalReviews: reviews.length };
  } catch (error) {
    console.error("Get reviews error:", error);
    return { error: "Yorumlar yüklenirken bir hata oluştu" };
  }
}

export async function canReview(contractorId: string, jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "FIRMA") {
      return { canReview: false };
    }

    // Check for accepted bid
    const acceptedBid = await prisma.bid.findFirst({
      where: {
        jobId,
        contractorId,
        status: "ACCEPTED",
        job: {
          companyId: session.user.companyProfileId,
        },
      },
    });

    if (!acceptedBid) {
      return { canReview: false };
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        contractorId,
        companyId: session.user.companyProfileId,
        jobId,
      },
    });

    return { canReview: !existingReview };
  } catch (error) {
    console.error("Can review error:", error);
    return { canReview: false };
  }
}
