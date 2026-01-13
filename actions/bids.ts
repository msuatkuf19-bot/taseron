"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { bidSchema, type BidInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { BidStatus } from "@prisma/client";

export async function createBid(jobId: string, data: BidInput) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { error: "Bu işlem için taşeron hesabı gerekli" };
    }

    if (!session.user.contractorProfileId) {
      return { error: "Taşeron profili bulunamadı" };
    }

    // Check if job exists and is open
    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        isDeleted: false,
        status: "OPEN",
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı veya kapalı" };
    }

    // Check if user already has a bid on this job
    const existingBid = await prisma.bid.findFirst({
      where: {
        jobId,
        contractorId: session.user.contractorProfileId,
      },
    });

    if (existingBid) {
      return { error: "Bu ilana zaten teklif vermişsiniz" };
    }

    const validatedData = bidSchema.parse(data);

    const bid = await prisma.bid.create({
      data: {
        jobId,
        contractorId: session.user.contractorProfileId,
        message: validatedData.message,
        proposedPrice: validatedData.proposedPrice || null,
        estimatedDuration: validatedData.estimatedDuration || null,
        status: "PENDING",
      },
    });

    revalidatePath(`/ilan/${jobId}`);
    revalidatePath("/dashboard/taseron");

    return { success: true, bidId: bid.id };
  } catch (error) {
    console.error("Create bid error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Teklif oluşturulurken bir hata oluştu" };
  }
}

export async function updateBidStatus(bidId: string, status: BidStatus) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "FIRMA") {
      return { error: "Bu işlem için firma hesabı gerekli" };
    }

    // Get bid with job to verify ownership
    const bid = await prisma.bid.findFirst({
      where: { id: bidId },
      include: {
        job: {
          select: {
            companyId: true,
          },
        },
      },
    });

    if (!bid || bid.job.companyId !== session.user.companyProfileId) {
      return { error: "Teklif bulunamadı veya yetkiniz yok" };
    }

    await prisma.bid.update({
      where: { id: bidId },
      data: { status },
    });

    revalidatePath("/dashboard/firma");

    return { success: true };
  } catch (error) {
    console.error("Update bid status error:", error);
    return { error: "Teklif durumu güncellenirken bir hata oluştu" };
  }
}

export async function deleteBid(bidId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { error: "Bu işlem için taşeron hesabı gerekli" };
    }

    const bid = await prisma.bid.findFirst({
      where: {
        id: bidId,
        contractorId: session.user.contractorProfileId,
      },
    });

    if (!bid) {
      return { error: "Teklif bulunamadı veya yetkiniz yok" };
    }

    if (bid.status !== "PENDING") {
      return { error: "Sadece bekleyen teklifler silinebilir" };
    }

    await prisma.bid.delete({
      where: { id: bidId },
    });

    revalidatePath("/dashboard/taseron");

    return { success: true };
  } catch (error) {
    console.error("Delete bid error:", error);
    return { error: "Teklif silinirken bir hata oluştu" };
  }
}

export async function getBidsForJob(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "FIRMA") {
      return { error: "Bu işlem için firma hesabı gerekli" };
    }

    // Verify job ownership
    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        companyId: session.user.companyProfileId,
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı veya yetkiniz yok" };
    }

    const bids = await prisma.bid.findMany({
      where: { jobId },
      include: {
        contractor: {
          select: {
            id: true,
            displayName: true,
            city: true,
            phone: true,
            skills: true,
            experienceYears: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { bids };
  } catch (error) {
    console.error("Get bids for job error:", error);
    return { error: "Teklifler yüklenirken bir hata oluştu" };
  }
}

export async function getMyBids() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { error: "Bu işlem için taşeron hesabı gerekli" };
    }

    const bids = await prisma.bid.findMany({
      where: {
        contractorId: session.user.contractorProfileId,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            city: true,
            category: true,
            status: true,
            company: {
              select: {
                id: true,
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { bids };
  } catch (error) {
    console.error("Get my bids error:", error);
    return { error: "Teklifler yüklenirken bir hata oluştu" };
  }
}

export async function checkExistingBid(jobId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { hasBid: false };
    }

    const bid = await prisma.bid.findFirst({
      where: {
        jobId,
        contractorId: session.user.contractorProfileId,
      },
    });

    return { hasBid: !!bid, bid };
  } catch (error) {
    console.error("Check existing bid error:", error);
    return { hasBid: false };
  }
}
