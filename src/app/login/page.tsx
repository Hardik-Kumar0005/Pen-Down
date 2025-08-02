"use client"; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!identifier || !password) {
            setError("All fields are necessary.");
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    identifier,
                    password
                }),
            });

            if (res.ok) {
                router.push("/"); // Redirect to home page on success
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Something went wrong.");
            }
        }catch (error) {
            setError("Error, try again");
            console.error("Login Error", error);
        }
    }

    return (
    <main className="grid grid-cols-1 md:grid-cols-2 h-screen w-full bg-[url('/loginbg.jpg')] bg-cover bg-center bg-no-repeat">
        
      {/* Left Column: Image */}
      <div className="hidden md:flex items-center justify-center p-8">
        <Image
          src="/login.png" // Make sure to have a 'login.png' in your /public folder
          alt="Login Illustration"
          width={600}
          height={600}
          priority
        
           />
      </div>

      {/* Right Column: Form */}
      <div className="flex flex-col justify-center items-center p-5">
        <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900/50 rounded-2xl border border-zinc-700">
          <h1 className="text-3xl font-bold text-center text-white">
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              onChange={(e) => setIdentifier(e.target.value)}
              type="text"
              placeholder="Email or Username"
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
            />
            <button
              type="submit"
              className="w-full mt-2 py-3 bg-cyan-600 text-black font-bold rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-cyan-500 transition-colors duration-300"
            >
              Login
            </button>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 w-full text-sm py-2 px-3 rounded-lg mt-2 text-center">
                {error}
              </div>
            )}
          </form>

          <div className="text-center text-zinc-400">
            <Link href={'/signup'} className="text-sm hover:underline hover:text-cyan-400 transition-colors">
              Don't have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}