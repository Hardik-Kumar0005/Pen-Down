import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // 1. Validate email and password
    if (!username || !email || !password) {
        return new NextResponse('Username, email, and password are required', { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return new NextResponse('User with this email already exists', { status: 409 }); // 409 Conflict
    }

    const existingUsername = await prisma.user.findUnique({
        where: { username },
    });
    if (existingUsername) {
      return new NextResponse('This username is already taken', { status: 409 });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // 5. Return the new user (without the password)
    return NextResponse.json({
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
    }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('SIGNUP_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}