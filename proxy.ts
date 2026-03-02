import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    // 1. Define paths that do NOT require authentication
    const publicPaths = ["/login", "/signup", "/register", "/"];

    // 2. Get the current path
    const { pathname } = req.nextUrl;

    // 3. Check if the user has a token
    const token = await getToken({ req });

    // 4. Logic:
    // - If it's a public path, let them pass (NextResponse.next())
    // - If they have a token, let them pass
    // - Otherwise, redirect to login

    // Check if the current path is a public path
    const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + "/"));

    if (isPublicPath || token) {
        return NextResponse.next();
    }

    // Redirect to login if accessing a protected page without a token
    return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};