"use server";

import { revalidatePath } from "next/cache";
import { BidStatus } from "@prisma/client";
import prisma from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import { z } from "zod";

// Validation schemas
const createBidSchema = z.object({
  proposedPrice: z.number().min(0, "Teklif tutarı 0'dan büyük olmalıdır"),
  estimatedDuration: z.string().min(1, "Tahmini süre girilmelidir"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

type CreateBidInput = z.infer<typeof createBidSchema>;

// ============ FIRMA ACTIONS (Teklif Veren) ============

/**
 * Firma bir ilana teklif verir
 */
export async function createBid(jobId: string, data: CreateBidInput) {
  try {
    const user = await requireRole("FIRMA");

    // Validation
    const validatedData = createBidSchema.parse(data);

    // İlan kontrolü - sadece APPROVED ilanlar
    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        approvalStatus: "APPROVED",
        status: "OPEN",
        isDeleted: false,
      },
    });

    if (!job) {
      return { error: "İlan bulunamadı veya teklif verilemez" };
    }

    // Kendi ilanına teklif veremez (firma ilanları APPROVED olarak oluşur)
    if (job.createdById === user.id) {
      return { error: "Kendi ilanınıza teklif veremezsiniz" };
    }

    // Daha önce teklif vermiş mi kontrol et
    const existingBid = await prisma.bid.findFirst({
      where: {
        jobId,
        offererId: user.id,
      },
    });

    if (existingBid) {
      return { error: "Bu ilana zaten teklif verdiniz" };
    }

    // Teklif oluştur
    const bid = await prisma.bid.create({
      data: {
        jobId,
        offererId: user.id,
        contractorId: user.companyProfileId!, // Backward compatibility
        proposedPrice: validatedData.proposedPrice,
        estimatedDuration: validatedData.estimatedDuration,
        message: validatedData.message,
        status: "PENDING",
      },
    });

    revalidatePath(`/ilan/${jobId}`);
    revalidatePath("/dashboard/firma");
    revalidatePath("/dashboard/taseron/teklifler");

    return { success: true, bidId: bid.id };
  } catch (error) {
    console.error("Create bid error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Teklif oluşturulurken hata oluştu" };
  }
}

/**
 * Firma kendi verdiği teklifleri listeler
 */
export async function listMyBids() {
  try {
    const user = await requireRole("FIRMA");

    const bids = await prisma.bid.findMany({
      where: {
        offererId: user.id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          include: {
            createdBy: {
              include: {
                contractorProfile: true,
              },
            },
          },
        },
      },
    });

    return { bids };
  } catch (error) {
    console.error("List my bids error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Teklifler yüklenirken hata oluştu" };
  }
}

/**
 * Firma belirli bir ilana verdiği teklifi getirir
 */
export async function getMyBidForJob(jobId: string) {
  try {
    const user = await requireRole("FIRMA");

    const bid = await prisma.bid.findFirst({
      where: {
        jobId,
        offererId: user.id,
      },
      include: {
        job: {
          include: {
            createdBy: {
              include: {
                contractorProfile: true,
              },
            },
          },
        },
      },
    });

    return { bid };
  } catch (error) {
    console.error("Get my bid error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Teklif yüklenirken hata oluştu" };
  }
}

// ============ TAŞERON ACTIONS (İlan Sahibi) ============

/**
 * Taşeron kendi ilanlarına gelen teklifleri listeler
 */
export async function listBidsForMyJobs() {
  try {
    const user = await requireRole("TASERON");

    const bids = await prisma.bid.findMany({
      where: {
        job: {
          createdById: user.id,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
          },
        },
        offerer: {
          include: {
            companyProfile: true,
          },
        },
      },
    });

    return { bids };
  } catch (error) {
    console.error("List bids for my jobs error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Teklifler yüklenirken hata oluştu" };
  }
}

/**
 * Taşeron belirli bir ilanına gelen teklifleri listeler
 */
export async function listBidsForJob(jobId: string) {
  try {
    const user = await requireRole("TASERON");

    // İlan sahibi kontrolü
    const job = await prisma.jobPost.findFirst({
      where: {
        id: jobId,
        createdById: user.id,
      },
    });

    if (!job) {
      return { error: "Bu ilana erişim yetkiniz yok" };
    }

    const bids = await prisma.bid.findMany({
      where: {
        jobId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        offerer: {
          include: {
            companyProfile: true,
          },
        },
      },
    });

    return { bids };
  } catch (error) {
    console.error("List bids for job error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Teklifler yüklenirken hata oluştu" };
  }
}

/**
 * Taşeron (ilan sahibi) teklifi kabul veya reddeder
 */
export async function updateBidStatusByOwner(
  bidId: string,
  status: "ACCEPTED" | "REJECTED"
) {
  try {
    const user = await requireRole("TASERON");

    // Bid ve job bilgilerini getir
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: true,
      },
    });

    if (!bid) {
      return { error: "Teklif bulunamadı" };
    }

    // İlan sahibi kontrolü
    if (bid.job.createdById !== user.id) {
      return { error: "Bu teklife karar verme yetkiniz yok" };
    }

    // Teklif durumunu güncelle
    await prisma.bid.update({
      where: { id: bidId },
      data: {
        status: status,
        updatedAt: new Date(),
      },
    });

    // Eğer kabul edildiyse, ilanı kapat (opsiyonel)
    if (status === "ACCEPTED") {
      await prisma.jobPost.update({
        where: { id: bid.jobId },
        data: {
          status: "CLOSED",
        },
      });
    }

    revalidatePath("/dashboard/taseron/teklifler");
    revalidatePath(`/dashboard/taseron/ilanlar/${bid.jobId}`);
    return { success: true };
  } catch (error) {
    console.error("Update bid status error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Teklif durumu güncellenirken hata oluştu" };
  }
}

/**
 * Teklif detayını getirir (sahip veya ilan sahibi)
 */
export async function getBidById(bidId: string) {
  try {
    const user = await requireAuth();

    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: {
          include: {
            createdBy: {
              include: {
                contractorProfile: true,
              },
            },
          },
        },
        offerer: {
          include: {
            companyProfile: true,
          },
        },
      },
    });

    if (!bid) {
      return { error: "Teklif bulunamadı" };
    }

    // Erişim kontrolü: teklif sahibi veya ilan sahibi
    const isOwner = bid.offererId === user.id;
    const isJobOwner = bid.job.createdById === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isJobOwner && !isAdmin) {
      return { error: "Bu teklife erişim yetkiniz yok" };
    }

    return { bid };
  } catch (error) {
    console.error("Get bid error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Teklif yüklenirken hata oluştu" };
  }
}

// ============ ADMIN ACTIONS ============

/**
 * Admin tüm teklifleri listeler
 */
export async function adminListAllBids() {
  try {
    await requireRole("ADMIN");

    const bids = await prisma.bid.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        offerer: {
          include: {
            companyProfile: true,
          },
        },
      },
    });

    return { bids };
  } catch (error) {
    console.error("Admin list bids error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Teklifler yüklenirken hata oluştu" };
  }
}
