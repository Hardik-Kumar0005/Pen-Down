// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    });

    // Clear the cookie by setting its value to empty and maxAge to 0
    response.cookies.set('token', '', {
      httpOnly: true,
      maxAge: 0,
    });

    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}