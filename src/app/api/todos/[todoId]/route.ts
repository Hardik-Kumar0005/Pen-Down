import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

interface UserPayload {
  userId: number;
}

const patchTodoSchema = z.object({
  content: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
});

// Helper function to get user and verify todo ownership
async function getUserAndTodo(request: Request, todoId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { user: null, todo: null, error: 'Unauthorized', status: 401 };
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
  const userId = decoded.userId;

  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(todoId) },
  });

  if (!todo || todo.authorId !== userId) {
    return { user: null, todo: null, error: 'Not Found or Forbidden', status: 404 };
  }

  return { user: decoded, todo, error: null, status: 200 };
}

          

// PATCH handler to update a todo (e.g., mark as complete)
export async function PATCH(
  request: Request,
  context: { params: Promise<{ todoId: string }> }
) {
  const params = await context.params;
  const { todo, error, status } = await getUserAndTodo(request, params.todoId);
  if (error || !todo) {
    return NextResponse.json({ error }, { status });
  }

  // Validate the request body
  const body = await request.json();
  const validation = patchTodoSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  // Update the todo with the provided data
  const updatedTodo = await prisma.todo.update({
    where: { id: todo.id },
    data: validation.data, // Pass the validated data directly
  });

  return NextResponse.json(updatedTodo);
}


// DELETE handler to delete a todo
export async function DELETE(
  request: Request,
  context: { params: Promise<{ todoId: string }> }
) {
  const params = await context.params;
  const { todo, error, status } = await getUserAndTodo(request, params.todoId);
  if (error || !todo) {
    return NextResponse.json({ error }, { status });
  }

  await prisma.todo.delete({
    where: { id: todo.id },
  });

  return new NextResponse(null, { status: 204 }); // 204 No Content
}