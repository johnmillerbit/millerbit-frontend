"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface ViewProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

const ViewProjectDialog: React.FC<ViewProjectDialogProps> = ({
  isOpen,
  onOpenChange,
  project,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/5 border-white/10 text-white sm:max-w-[425px] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Project Details</DialogTitle>
          <DialogDescription className="text-slate-400">
            Detailed information about the selected project.
          </DialogDescription>
        </DialogHeader>
        {project ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">ID:</p>
              <p className="col-span-3 font-semibold break-all">
                {project.project_id}
              </p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">Name:</p>
              <p className="col-span-3 font-semibold">
                {project.project_name}
              </p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">Description:</p>
              <p className="col-span-3">{project.description}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">Status:</p>
              <p className="col-span-3">{project.status}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">Created By:</p>
              <p className="col-span-3">
                {project.created_by.first_name} {project.created_by.last_name}
              </p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">Created At:</p>
              <p className="col-span-3">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
            {project.skills.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-slate-300 col-span-1">Skills:</p>
                <p className="col-span-3">{project.skills.join(", ")}</p>
              </div>
            )}
            {project.images.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-slate-300 col-span-1">Images:</p>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {project.images.map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate max-w-[100px]">
                      Image {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {project.videos.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-slate-300 col-span-1">Videos:</p>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {project.videos.map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate max-w-[100px]">
                      Video {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {project.links.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-slate-300 col-span-1">Links:</p>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {project.links.map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate max-w-[100px]">
                      Link {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-400">No project selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectToDelete: Project | null;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  projectToDelete,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/5 border-white/10 text-white sm:max-w-[425px] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
          <DialogDescription className="text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">
              {projectToDelete?.project_name}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isViewProjectDialogOpen, setIsViewProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/projects`, {
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
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      const response = await fetch(`${backendUrl}/api/projects/${projectToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }

      // Refresh the list of projects
      fetchAllProjects();
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg">
          All Project Management
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
                All Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <p className="text-center text-gray-400">No projects found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-white/10">
                      <TableHead className="text-slate-300">Project Name</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Created By</TableHead>
                      <TableHead className="text-slate-300">Created At</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.project_id} className="hover:bg-white/10">
                        <TableCell className="font-medium">
                          <Link href={`/projects/${project.project_id}`} className="text-blue-400 hover:underline">
                            {project.project_name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            project.status === 'approved' ? 'bg-green-700 text-green-200' :
                            project.status === 'pending' ? 'bg-yellow-700 text-yellow-200' :
                            'bg-red-700 text-red-200'
                          }`}>
                            {project.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {project.created_by.first_name} {project.created_by.last_name}
                        </TableCell>
                        <TableCell>
                          {new Date(project.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-slate-900 text-white border-white/10"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsViewProjectDialogOpen(true);
                                }}
                                className="hover:bg-white/10 focus:bg-white/10"
                              >
                                View project
                              </DropdownMenuItem>
                              {/* Add edit functionality later if needed */}
                              {/* <DropdownMenuItem
                                onClick={() => handleEditProject(project)}
                                className="hover:bg-white/10 focus:bg-white/10"
                              >
                                Edit project
                              </DropdownMenuItem> */}
                              <DropdownMenuItem
                                onClick={() => {
                                  setProjectToDelete(project.project_id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="hover:bg-white/10 focus:bg-white/10 text-red-400 hover:text-red-300"
                              >
                                Delete project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
      <ViewProjectDialog
        isOpen={isViewProjectDialogOpen}
        onOpenChange={setIsViewProjectDialogOpen}
        project={selectedProject}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        projectToDelete={selectedProject}
        onConfirm={handleDeleteProject}
      />
    </div>
  );
}
