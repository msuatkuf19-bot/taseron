import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes protection (including ilan-onay)
    if (path.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Firma dashboard protection
    if (path.startsWith("/dashboard/firma")) {
      if (token?.role !== "FIRMA") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Taşeron dashboard protection (including ilanlar)
    if (path.startsWith("/dashboard/taseron")) {
      if (token?.role !== "TASERON") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Public routes
        if (
          path === "/" ||
          path === "/login" ||
          path === "/register" ||
          path === "/unauthorized" ||
          path.startsWith("/ilanlar") ||
          path.startsWith("/ilan/") ||
          path.startsWith("/firma/") ||
          path.startsWith("/taseron/") ||
          path.startsWith("/api/auth")
        ) {
          return true;
        }

        // Protected routes require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/jobs/:path*",
    "/api/bids/:path*",
    "/api/reviews/:path*",
  ],
};
