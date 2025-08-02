// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // A more modern library for JWT verification

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // If trying to access protected routes without a token, redirect to login
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If a token exists, verify it
  if (token) {
    try {
      // Get the secret key as a Uint8Array
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      // Verify the token
      await jwtVerify(token, secret);

      // If token is valid and user is on login/signup, redirect to dashboard
      if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Token verification failed (e.g., expired, invalid)
      console.log('Token verification failed, redirecting to login.');
      
      // Redirect to login page and clear the invalid cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('token', '', { maxAge: -1 });
      return response;
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/signup'
  ],
};