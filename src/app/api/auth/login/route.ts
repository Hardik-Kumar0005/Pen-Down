// src/app/api/auth/login/route.ts
import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Define the schema for input validation using Zod
const loginSchema = z.object({
  identifier: z.string().min(1, { message: 'Email or Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
        console.log('Login attempt with:', body.identifier); // 1. Log the attempt
    
    // 1. Validate request body against the schema
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { identifier, password } = validation.data;

    // 2. Find the user in the database
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
            { email: identifier },
            { username: identifier }
        ] },
    });

    if (!user) {
            console.log('User not found.'); // 2. Log if user doesn't exist
      // Use a generic error message for security
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

      console.log('User found:', user.username); // 3. Log the found user
    // 3. Compare the provided password with the stored hash
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

          console.log('Login successful for:', user.username);
    // 4. Create a JWT if c`red`entials are valid
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );
    
    // 5. Create a success response and set the cookie on it
    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );

    // Set the JWT token in a cookie
    // Ensure the cookie is HTTP-only, secure, and has a reasonable expiration time
    // Cookie to remember user login for 7 days
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
      sameSite: 'strict',
    });

    return response;

  } catch (error) {
    console.error('LOGIN_API_ERROR', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}