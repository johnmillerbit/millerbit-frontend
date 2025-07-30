"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set('token', data.token, { expires: 7 }); // Store token for 7 days
        router.push('/'); // Redirect to home page or dashboard
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: unknown) {
      setError('An unexpected error occurred: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 font-inter relative overflow-hidden flex items-center justify-center py-12">
      {/* Global background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col m-6 space-y-8 bg-gray-900 shadow-2xl rounded-2xl md:flex-row md:space-y-0 border border-gray-800 max-w-4xl w-full z-10"
      >
        {/* left side - Image/Illustration */}
        <div className="relative w-full md:w-1/2 p-4 hidden md:flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 rounded-l-2xl overflow-hidden">
          {/* Abstract tech illustration or placeholder */}
          <Image
            src="https://placehold.co/400x400/1a202c/9ca3af?text=Secure+Login" // Abstract tech placeholder
            alt="Login Illustration"
            layout="fill"
            objectFit="cover"
            className="rounded-l-2xl opacity-80"
          />
          <div className="absolute inset-0 bg-radial-gradient animate-pulse-light opacity-30"></div>
        </div>

        {/* right side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14">
          <h2 className="font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4 drop-shadow-lg">
            Log In
          </h2>
          <p className="text-gray-300 mb-8 font-light">Welcome back! Please enter your details to access your dashboard.</p>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-center mb-4 p-2 bg-red-900/20 rounded-md border border-red-700"
            >
              {error}
            </motion.p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg placeholder:text-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg placeholder:text-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 font-bold text-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </motion.div>

      {/* Global Styles for custom animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        /* Hero Section Gradient Animation - Reused for general background effect */
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }

        /* Background Grid Pattern */
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes grid-pulse {
          0% { opacity: 0.05; }
          50% { opacity: 0.15; }
          100% { opacity: 0.05; }
        }

        .animate-grid-pulse {
          animation: grid-pulse 20s infinite ease-in-out;
        }

        /* Pulse Light for Hero - Reused for general background effect */
        .bg-radial-gradient {
          background: radial-gradient(circle at center, rgba(100, 200, 255, 0.2), transparent 70%);
        }

        @keyframes pulse-light {
          0% { transform: scale(0.8); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.4; }
          100% { transform: scale(0.8); opacity: 0.2; }
        }

        .animate-pulse-light {
          animation: pulse-light 10s infinite ease-in-out;
        }

        /* Number pulse animation for overview section - Not directly used here but kept for consistency if needed */
        @keyframes pulse-number {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        .animate-pulse-number {
          animation: pulse-number 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
