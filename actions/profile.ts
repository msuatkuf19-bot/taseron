"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  companyProfileSchema,
  contractorProfileSchema,
  type CompanyProfileInput,
  type ContractorProfileInput,
} from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function getCompanyProfile(profileId: string) {
  try {
    const profile = await prisma.companyProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        jobs: {
          where: { isDeleted: false },
          select: { id: true, status: true },
        },
        reviews: {
          include: {
            contractor: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return { error: "Firma profili bulunamadı" };
    }

    const openJobs = profile.jobs.filter((j) => j.status === "OPEN").length;
    const totalJobs = profile.jobs.length;

    return { profile, openJobs, totalJobs };
  } catch (error) {
    console.error("Get company profile error:", error);
    return { error: "Profil yüklenirken bir hata oluştu" };
  }
}

export async function getContractorProfile(profileId: string) {
  try {
    const profile = await prisma.contractorProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        reviews: {
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
        },
        _count: {
          select: { bids: true },
        },
      },
    });

    if (!profile) {
      return { error: "Taşeron profili bulunamadı" };
    }

    // Calculate average rating
    const avgRating =
      profile.reviews.length > 0
        ? profile.reviews.reduce((sum, r) => sum + r.rating, 0) /
          profile.reviews.length
        : 0;

    return {
      profile,
      avgRating,
      totalReviews: profile.reviews.length,
      totalBids: profile._count.bids,
    };
  } catch (error) {
    console.error("Get contractor profile error:", error);
    return { error: "Profil yüklenirken bir hata oluştu" };
  }
}

export async function updateCompanyProfile(data: CompanyProfileInput) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "FIRMA") {
      return { error: "Bu işlem için firma hesabı gerekli" };
    }

    if (!session.user.companyProfileId) {
      return { error: "Firma profili bulunamadı" };
    }

    const validatedData = companyProfileSchema.parse(data);

    await prisma.companyProfile.update({
      where: { id: session.user.companyProfileId },
      data: {
        companyName: validatedData.companyName,
        contactName: validatedData.contactName || null,
        phone: validatedData.phone || null,
        city: validatedData.city,
        about: validatedData.about || null,
      },
    });

    revalidatePath(`/firma/${session.user.companyProfileId}`);
    revalidatePath("/dashboard/firma");

    return { success: true };
  } catch (error) {
    console.error("Update company profile error:", error);
    return { error: "Profil güncellenirken bir hata oluştu" };
  }
}

export async function updateContractorProfile(data: ContractorProfileInput) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "TASERON") {
      return { error: "Bu işlem için taşeron hesabı gerekli" };
    }

    if (!session.user.contractorProfileId) {
      return { error: "Taşeron profili bulunamadı" };
    }

    const validatedData = contractorProfileSchema.parse(data);

    await prisma.contractorProfile.update({
      where: { id: session.user.contractorProfileId },
      data: {
        displayName: validatedData.displayName,
        phone: validatedData.phone || null,
        city: validatedData.city,
        skills: validatedData.skills,
        experienceYears: validatedData.experienceYears || null,
        about: validatedData.about || null,
      },
    });

    revalidatePath(`/taseron/${session.user.contractorProfileId}`);
    revalidatePath("/dashboard/taseron");

    return { success: true };
  } catch (error) {
    console.error("Update contractor profile error:", error);
    return { error: "Profil güncellenirken bir hata oluştu" };
  }
}
