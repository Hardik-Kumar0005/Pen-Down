import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { Todo } from '@prisma/client';
import TodoManager from './TodoManager';

interface UserPayload {
  userId: number;
}

async function getTodosForUser(): Promise<Todo[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    const userId = decoded.userId;

    const todos = await prisma.todo.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return todos;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    redirect('/login');
  }
}

export default async function Dashboard() {
  const initialTodos = await getTodosForUser();

  return (
    <div className="min-h-screen bg-[url('/dashboardBg.jpg')] text-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 text-center gap-4">
        </div>
        <div className="w-full flex justify-center items-center mt-8 mb-10 p-1 sm:mt-2">
          <span className="text-2xl sm:text-3xl font-bold">Your Todos</span>
        </div>
        <div className="mb-8 sm:mb-12" />
        <div className="w-full flex justify-center">
          <div className="w-full max-w-screen-lg px-2 sm:px-4">
            <TodoManager initialTodos={initialTodos} />
          </div>
        </div>
      </div>
    </div>
  );
}