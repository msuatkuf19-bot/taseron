"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { Role } from "@prisma/client";

export async function registerUser(data: RegisterInput) {
  try {
    const validatedData = registerSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "Bu e-posta adresi zaten kayıtlı" };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create user with profile based on role
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role: validatedData.role as Role,
        ...(validatedData.role === "FIRMA"
          ? {
              companyProfile: {
                create: {
                  companyName: validatedData.companyName || "Firma Adı",
                  city: validatedData.city,
                  phone: validatedData.phone,
                },
              },
            }
          : {
              contractorProfile: {
                create: {
                  displayName: validatedData.displayName || "Taşeron",
                  city: validatedData.city,
                  phone: validatedData.phone,
                },
              },
            }),
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Register error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Kayıt sırasında bir hata oluştu" };
  }
}
