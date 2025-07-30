import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload extends Record<string, unknown> {
  userId?: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Assuming token is stored in a cookie named 'token'

  const protectedRoutes = [
    "/projects/create",
    "/profile/edit",
    "/projects/edit",
    "/admin",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET as string
      );
      const { payload } = await jwtVerify(token, secret);
      const decoded = payload as JwtPayload;

      if (!decoded.role || !decoded.userId) {
        console.error("JWT payload missing role or userId");
        return NextResponse.redirect(new URL("/", request.url));
      }

      const userRole = decoded.role;
      const userId = decoded.userId;

      // Check roles for specific routes
      if (request.nextUrl.pathname.startsWith("/projects/create")) {
        if (!["team_member", "team_leader", "admin"].includes(userRole)) {
          return NextResponse.redirect(new URL("/", request.url)); // Redirect if not authorized
        }
      } else if (request.nextUrl.pathname.startsWith("/projects/edit")) {
        const projectIdFromPath = request.nextUrl.pathname.split("/")[3]; // /projects/edit/[id]
        // For project edit, ensure the user is editing their own project or is an admin/team_leader
        // This requires fetching the project to check its owner, which is not feasible in middleware.
        // Instead, we'll rely on the backend to enforce ownership.
        // Here, we only check if the user has any of the allowed roles for editing projects.
        if (!["team_member", "team_leader", "admin"].includes(userRole)) {
          return NextResponse.redirect(new URL("/", request.url)); // Redirect if not authorized
        }
      } else if (request.nextUrl.pathname.startsWith("/profile/edit")) {
        // For profile edit, ensure the user is editing their own profile or is an admin/team_leader
        const profileIdFromPath = request.nextUrl.pathname.split("/")[3]; // /profile/edit/[id]
        if (
          profileIdFromPath !== userId &&
          !["team_leader", "admin"].includes(userRole)
        ) {
          return NextResponse.redirect(new URL("/", request.url)); // Redirect if not authorized
        }
        // If the user is trying to edit their own profile, allow it regardless of role,
        // as long as they are authenticated.
        // If they are not editing their own profile, they must be a team_leader or admin.
        if (profileIdFromPath === userId && !["team_member", "team_leader", "admin"].includes(userRole)) {
          return NextResponse.redirect(new URL("/", request.url)); // Redirect if not authorized
        }
      } else if (request.nextUrl.pathname.startsWith("/admin")) {
        if (!["team_leader", "admin"].includes(userRole)) {
          return NextResponse.redirect(new URL("/", request.url)); // Redirect if not authorized
        }
      }
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to login on token error
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/create/:path*", "/profile/edit/:path*", "/projects/edit/:path*", "/admin/:path*"],
};
