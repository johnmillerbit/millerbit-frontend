"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

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
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!dashboardData) return <div className="min-h-screen flex items-center justify-center">No dashboard data found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Team Leader Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold">Total Members</h2>
            <p className="text-4xl font-bold">{dashboardData.memberCount}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold">Total Projects</h2>
            <p className="text-4xl font-bold">{dashboardData.totalProjects}</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold">Pending Projects</h2>
            <p className="text-4xl font-bold">{dashboardData.pendingProjects}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/projects/create" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center">
              Create New Project
            </Link>
            <Link href="/members" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-center">
              Manage Members (Coming Soon)
            </Link>
            {/* Add more links for project management, etc. */}
          </div>
        </div>
      </div>
    </div>
  );
}
