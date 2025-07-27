"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  project_id: string;
  project_name: string;
  description: string;
  status: string;
  created_at: string;
  created_by: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  skills: string[];
  images: string[];
  videos: string[];
  links: string[];
}

export default function PendingProjectsPage() {
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/projects/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError("Authentication failed. You do not have permission to view this page.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data: Project[] = await response.json();
      setPendingProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (projectId: string) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      const response = await fetch(`${backendUrl}/api/projects/${projectId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve project");
      }

      // Refresh the list of pending projects
      fetchPendingProjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReject = async () => {
    if (!selectedProjectId) return;

    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      const response = await fetch(`${backendUrl}/api/projects/${selectedProjectId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject project");
      }

      // Refresh the list of pending projects
      fetchPendingProjects();
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedProjectId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg">
          Pending Project Management
        </h1>

        {loading && (
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-white/5 border-white/10 text-white shadow-lg backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-4 w-1/3 bg-white/10" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full mb-2 bg-white/5" />
                <Skeleton className="h-8 w-full mb-2 bg-white/5" />
                <Skeleton className="h-8 w-full bg-white/5" />
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-900/20 border-red-500/30 text-red-200 backdrop-blur-xl"
          >
            <AlertTriangle className="h-4 w-4 text-red-300" />
            <AlertTitle className="text-red-100">Error</AlertTitle>
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <Card className="bg-white/5 border-white/10 text-white shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Projects Awaiting Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingProjects.length === 0 ? (
                <p className="text-center text-gray-400">No pending projects found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-white/10">
                      <TableHead className="text-slate-300">Project Name</TableHead>
                      <TableHead className="text-slate-300">Created By</TableHead>
                      <TableHead className="text-slate-300">Created At</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProjects.map((project) => (
                      <TableRow key={project.project_id} className="hover:bg-white/10">
                        <TableCell className="font-medium">
                          <Link href={`/projects/${project.project_id}`} className="text-blue-400 hover:underline">
                            {project.project_name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {project.created_by.first_name} {project.created_by.last_name}
                        </TableCell>
                        <TableCell>
                          {new Date(project.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
                              onClick={() => handleApprove(project.project_id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Dialog open={isRejectDialogOpen && selectedProjectId === project.project_id} onOpenChange={setIsRejectDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                                  onClick={() => {
                                    setSelectedProjectId(project.project_id);
                                    setIsRejectDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Reject Project</DialogTitle>
                                  <DialogDescription className="text-gray-400">
                                    Enter a reason for rejecting "{project.project_name}". This will be sent to the project creator.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <Textarea
                                    placeholder="Reason for rejection (optional)"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="col-span-4 bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                                  />
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
                                    onClick={() => setIsRejectDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={handleReject}
                                  >
                                    Reject Project
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
