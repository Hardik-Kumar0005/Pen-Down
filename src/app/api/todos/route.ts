import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Define Zod schema for input validation
const todoSchema = z.object({
  content: z.string().min(1, 'content is required').max(255),
});

// DEFINING TYPE
interface UserPayload {
  userId: number;
}

// Create Todo
export async function POST(request: Request) {
  try {
    // 1. Get user ID from the token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    const userId = decoded.userId;

    // 2. VALIDATION
    const body = await request.json();
    const validation = todoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { content } = validation.data;

    // 3. Create the new todo in the database
    const newTodo = await prisma.todo.create({
      data: {
        content,
        authorId: userId, // Link the todo to the user
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('TODO_POST_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// Fetch Todos
export async function GET() {
  try {
    // 1. Get user from the token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    const userId = decoded.userId;

    // 2. Fetch todos for the user
    const todos = await prisma.todo.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc', // Show newest todos first
      },
    });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('TODO_GET_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}