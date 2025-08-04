"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
    // State for each input field
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // Handles the form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        // Validate that all fields are filled
        if (!username || !email || !password) {
            setError("All fields are necessary.");
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            });

            if (res.ok) {
                const form = e.target as HTMLFormElement;
                form.reset();
                router.push("/login"); 
            } else {
                const data = await res.json();
                setError(data.message || "Something went wrong.");
            }
        } catch (error) {
            setError("Error, try again");
        }
    };

    return (
        <main className="grid grid-cols-1 md:grid-cols-2 h-screen w-full bg-[url('/dashboardBg.jpg')] bg-cover bg-center bg-no-repeat">
            
            {/* Left Column */}
            <div className="hidden md:flex items-center justify-center p-8">
                <Image
                    src="/signup.png"
                    alt="Signup Illustration"
                    className=""
                    width={700}
                    height={700}
                    priority
                />
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-center items-center p-5">
                <div className="mb-8">
          <h1 className="text-7xl font-bold text-white">Pen Down</h1>
          <p className="text-sm text-zinc-400">
            Your one-stop solution for managing tasks efficiently.
          </p>
        </div>
                <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900/50 rounded-2xl border border-cyan-500">
                    <h1 className="text-3xl font-bold text-center text-white">
                        Create an Account
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Username"
                            className="w-full px-4 py-3 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                        />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
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
                            Sign Up
                        </button>

                        {/* Error message display */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-300 w-full text-sm py-2 px-3 rounded-lg mt-2 text-center">
                                {error}
                            </div>
                        )}
                    </form>

                    {/* Link to the login page */}
                    <div className="text-center text-zinc-400">
                        <Link href={'/login'} className="text-sm hover:underline hover:text-cyan-400 transition-colors">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
