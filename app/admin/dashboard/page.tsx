"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading states
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert for error messages
import { AlertTriangle, User, Package, Hourglass } from "lucide-react"; // Using Lucide Icons for better consistency
import { Button } from "@/components/ui/button"; // Import Button component
import Link from "next/link"; // Import Link for navigation
import Cookies from "js-cookie";

interface DashboardData {
  memberCount: number;
  totalProjects: number;
  pendingProjects: number;
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setError("Authentication failed. Please log in again.");
            // Consider adding a redirect to a login page here if using a router
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {" "}
      {/* Updated background */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg">
          Admin Dashboard
        </h1>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10 text-white shadow-lg backdrop-blur-sm">
              {" "}
              {/* Updated card background and border */}
              <CardHeader>
                <Skeleton className="h-4 w-1/2 bg-white/10" />{" "}
                {/* Updated Skeleton color */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-3/4 mb-2 bg-white/5" />{" "}
                {/* Updated Skeleton color */}
                <Skeleton className="h-3 w-2/3 bg-white/10" />{" "}
                {/* Updated Skeleton color */}
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 text-white shadow-lg backdrop-blur-sm">
              {" "}
              {/* Updated card background and border */}
              <CardHeader>
                <Skeleton className="h-4 w-1/2 bg-white/10" />{" "}
                {/* Updated Skeleton color */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-3/4 mb-2 bg-white/5" />{" "}
                {/* Updated Skeleton color */}
                <Skeleton className="h-3 w-2/3 bg-white/10" />{" "}
                {/* Updated Skeleton color */}
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 text-white shadow-lg backdrop-blur-sm">
              {" "}
              {/* Updated card background and border */}
              <CardHeader>
                <Skeleton className="h-4 w-1/2 bg-white/10" />{" "}
                {/* Updated Skeleton color */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-3/4 mb-2 bg-white/5" />{" "}
                {/* Updated Skeleton color */}
                <Skeleton className="h-3 w-2/3 bg-white/10" />{" "}
                {/* Updated Skeleton color */}
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-900/20 border-red-500/30 text-red-200 backdrop-blur-xl"
          >
            {" "}
            {/* Updated alert style */}
            <AlertTriangle className="h-4 w-4 text-red-300" />
            <AlertTitle className="text-red-100">Error</AlertTitle>
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/dashboard/member" passHref>
              <Card className="bg-white/5 border-white/10 text-white shadow-lg backdrop-blur-sm">
                {" "}
                {/* Updated card background and border */}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Member Count
                  </CardTitle>{" "}
                  {/* Maintained text color */}
                  <User className="h-4 w-4 text-slate-400" />{" "}
                  {/* Maintained text color */}
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {dashboardData.memberCount}
                  </div>
                  <p className="text-xs text-slate-400">
                    {" "}
                    {/* Maintained text color */}
                    Total registered members
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/dashboard/project-management" passHref>
              <Card className="bg-white/5 border-white/10 text-white shadow-lg backdrop-blur-sm">
                {" "}
                {/* Updated card background and border */}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Total Projects
                  </CardTitle>{" "}
                  {/* Maintained text color */}
                  <Package className="h-4 w-4 text-slate-400" />{" "}
                  {/* Maintained text color */}
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {dashboardData.totalProjects}
                  </div>
                  <p className="text-xs text-slate-400">
                    {" "}
                    {/* Maintained text color */}
                    All projects in the system
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/dashboard/pending-projects" passHref>
              <Card className="bg-white/5 border-white/10 text-white shadow-lg backdrop-blur-sm">
                {" "}
                {/* Updated card background and border */}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Pending Projects
                  </CardTitle>{" "}
                  {/* Maintained text color */}
                  <Hourglass className="h-4 w-4 text-slate-400" />{" "}
                  {/* Maintained text color */}
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {dashboardData.pendingProjects}
                  </div>
                  <p className="text-xs text-slate-400">
                    {" "}
                    {/* Maintained text color */}
                    Projects awaiting approval
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
