"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Import motion for animations

interface DashboardData {
  memberCount: number;
  totalProjects: number;
  pendingProjects: number;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token not found. Please log in as a Team Leader.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${backendUrl}/api/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch dashboard data. Ensure you are a Team Leader.');
        }
      } catch (err: any) {
        setError('An unexpected error occurred: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [backendUrl]); // Added backendUrl to dependency array

  // Framer Motion variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-indigo-400 text-xl">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="ml-4">Loading dashboard...</p>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-400 text-xl">{error}</div>;
  if (!dashboardData) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400 text-xl">No dashboard data found.</div>;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-inter relative overflow-hidden py-12">
      {/* Global background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-12 drop-shadow-lg text-center">
          Team Leader Dashboard
        </h1>

        {/* Data Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 flex flex-col items-center justify-center text-center group">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">Total Members</h2>
            <p className="text-6xl font-extrabold text-blue-500 group-hover:text-blue-400 transition-colors duration-300 animate-pulse-number">{dashboardData.memberCount}</p>
            {/* Icon for members */}
            <svg className="w-12 h-12 text-blue-400 mt-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 flex flex-col items-center justify-center text-center group">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">Total Projects</h2>
            <p className="text-6xl font-extrabold text-green-500 group-hover:text-green-400 transition-colors duration-300 animate-pulse-number">{dashboardData.totalProjects}</p>
            {/* Icon for projects */}
            <svg className="w-12 h-12 text-green-400 mt-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"></path></svg>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 flex flex-col items-center justify-center text-center group">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">Pending Projects</h2>
            <p className="text-6xl font-extrabold text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300 animate-pulse-number">{dashboardData.pendingProjects}</p>
            {/* Icon for pending projects */}
            <svg className="w-12 h-12 text-yellow-400 mt-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
          </motion.div>
        </motion.div>

        {/* Management Tools */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-6">Management Tools</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link href="/projects/create" className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 hover:border-blue-500 transition duration-300 flex flex-col items-center justify-center text-center h-full group">
                <h3 className="text-xl font-bold text-purple-500 group-hover:text-purple-400 transition-colors duration-300">Create New Project</h3>
                <p className="text-gray-400 mt-2 text-sm">Start a new project and assign team members.</p>
                <svg className="w-10 h-10 text-purple-400 mt-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/members" className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 hover:border-indigo-500 transition duration-300 flex flex-col items-center justify-center text-center h-full group">
                <h3 className="text-xl font-bold text-indigo-500 group-hover:text-indigo-400 transition-colors duration-300">Manage Members</h3>
                <p className="text-gray-400 mt-2 text-sm">View and manage your team members.</p>
                <svg className="w-10 h-10 text-indigo-400 mt-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4 0c1.66 0 2.99-1.34 2.99-3S13.66 5 12 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4 0c1.66 0 2.99-1.34 2.99-3S5.66 5 4 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zM12 13c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/projects/pending" className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 hover:border-yellow-500 transition duration-300 flex flex-col items-center justify-center text-center h-full group">
                <h3 className="text-xl font-bold text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300">Review Pending Projects</h3>
                <p className="text-gray-400 mt-2 text-sm">Approve or reject new project submissions.</p>
                <svg className="w-10 h-10 text-yellow-400 mt-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
              </Link>
            </motion.div>
          </motion.div>
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

        /* Number pulse animation for overview section */
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
