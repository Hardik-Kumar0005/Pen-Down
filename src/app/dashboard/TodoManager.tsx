"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Todo } from '@prisma/client';
import LogoutButton from './LogoutButton';

export default function TodoManager({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodoContent, setNewTodoContent] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); 
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus the input when editing starts
  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;
    setError('');

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newTodoContent }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to add todo');
      }
      
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setNewTodoContent('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error(err);
    }
  };

  const handleUpdateTodo = async (id: number, data: { content?: string; completed?: boolean }) => {
    // Optimistic update
    const originalTodos = [...todos];
    setTodos(todos.map(t => t.id === id ? { ...t, ...data } : t));
    
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await res.json();
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      // Revert optimistic update on error
      setTodos(originalTodos);
      setError('Failed to update todo. Please try again.');
      console.error(err);      
    }
  };

  const handleDelete = async (id: number) => {
    // Optimistic update
    const originalTodos = [...todos];
    setTodos(todos.filter(t => t.id !== id));
    
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        throw new Error('Failed to delete todo');
      }
    } catch (err) {
      // Revert optimistic update on error
      setTodos(originalTodos);
      setError('Failed to delete todo. Please try again.');
      console.error(err);
    }
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingText(todo.content);
  };

  const handleSaveEdit = (id: number) => {
    if (editingText.trim()) {
      handleUpdateTodo(id, { content: editingText });
    }
    setEditingTodoId(null);
  };

  return (
    <>
      <div className="absolute top-5 right-5 z-50">
        <LogoutButton />
      </div>
      
      <div className="w-full max-w-2xl mx-auto bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
        {/* Form for adding new todos */}
        <form
          onSubmit={handleAddTodo}
          className="sticky top-1 flex flex-col sm:flex-row gap-2 mb-4 bg-white/10 backdrop-blur-2xl rounded-xl shadow-2xl px-6 py-8"
          style={{
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        minHeight: '120px',
          }}
        >
          <input
        type="text"
        value={newTodoContent}
        onChange={(e) => setNewTodoContent(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full sm:flex-grow px-4 py-2 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2 bg-cyan-600 text-black font-bold rounded-lg hover:bg-cyan-500 transition-colors"
          >
        Add
          </button>
        </form>

        {/* Error message */}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* List of todos */}
        <ul className="space-y-3">
          {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg group">
          {editingTodoId === todo.id ? (
            // Editing view: an input field
            <input
          ref={editInputRef}
          type="text"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onBlur={() => handleSaveEdit(todo.id)}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
          className="flex-grow bg-transparent text-white outline-none"
            />
          ) : (
            // Default view: checkbox and text
            <div className="flex items-center gap-3 flex-grow">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => handleUpdateTodo(todo.id, { completed: e.target.checked })}
            className="h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-cyan-500 focus:ring-cyan-600"
          />
          <span
            onClick={() => handleStartEditing(todo)}
            className={`text-zinc-100 cursor-pointer ${todo.completed ? 'line-through text-zinc-500' : ''}`}
          >
            {todo.content}
          </span>
            </div>
          )}
          <button
            onClick={() => handleDelete(todo.id)}
            className="text-zinc-500 hover:text-red-500 transition-colors ml-4"
          >
            &#x2715;
          </button>
        </li>
          ))}
        </ul>
        
        {todos.length === 0 && (
          <div className="text-center text-zinc-400 py-8">
        No todos yet. Add one above to get started!
          </div>
        )}
      </div>
    </>
  );
}