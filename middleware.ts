import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JwtPayload extends Record<string, unknown> {
  userId?: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Assuming token is stored in a cookie named 'token'

  const protectedRoutes = [
    '/projects/create',
    '/profile/edit',
    '/admin'
  ];

  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET as string);
      const { payload } = await jwtVerify(token, secret);
      const decoded = payload as JwtPayload;

      if (!decoded.role || !decoded.userId) {
        console.error('JWT payload missing role or userId');
        return NextResponse.redirect(new URL('/', request.url));
      }

      const userRole = decoded.role;
      const userId = decoded.userId;

      // Check roles for specific routes
      if (request.nextUrl.pathname.startsWith('/projects/create')) {
        if (!['team_member', 'team_leader', 'admin'].includes(userRole)) {
          return NextResponse.redirect(new URL('/', request.url)); // Redirect if not authorized
        }
      } else if (request.nextUrl.pathname.startsWith('/profile/edit')) {
        // For profile edit, ensure the user is editing their own profile or is an admin/team_leader
        const userIdFromPath = request.nextUrl.pathname.split('/')[3]; // /profile/edit/[id]
        if (userIdFromPath !== userId && !['team_leader', 'admin'].includes(userRole)) {
          return NextResponse.redirect(new URL('/', request.url)); // Redirect if not authorized
        }
        if (!['team_member', 'team_leader', 'admin'].includes(userRole)) {
          return NextResponse.redirect(new URL('/', request.url)); // Redirect if not authorized
        }
      } else if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!['team_leader', 'admin'].includes(userRole)) {
          return NextResponse.redirect(new URL('/', request.url)); // Redirect if not authorized
        }
      }

    } catch (error) {
      console.error('JWT verification failed:', error);
      return NextResponse.redirect(new URL('/', request.url)); // Redirect to login on token error
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/projects/create/:path*',
    '/profile/edit/:path*',
    '/admin/:path*',
  ],
};
