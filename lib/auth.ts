import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gereklidir");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            companyProfile: true,
            contractorProfile: true,
          },
        });

        if (!user) {
          throw new Error("Kullanıcı bulunamadı");
        }

        if (!user.isActive) {
          throw new Error("Hesabınız devre dışı bırakılmış");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error("Geçersiz şifre");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          companyProfileId: user.companyProfile?.id,
          contractorProfileId: user.contractorProfile?.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyProfileId = user.companyProfileId;
        token.contractorProfileId = user.contractorProfileId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.companyProfileId = token.companyProfileId;
        session.user.contractorProfileId = token.contractorProfileId;
      }
      return session;
    },
  },
};

// Helper fonksiyonlar
export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Giriş yapmanız gerekiyor");
  }
  return user;
}

export async function requireRole(allowedRoles: Role | Role[]) {
  const user = await requireAuth();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  if (!roles.includes(user.role as Role)) {
    throw new Error("Bu işlem için yetkiniz yok");
  }
  
  return user;
}
