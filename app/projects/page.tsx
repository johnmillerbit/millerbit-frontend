"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArrowLeft, Users, Calendar, Code2, AlertTriangle, Sparkles, Image as ImageIcon } from "lucide-react";

interface Project {
  project_id: string;
  project_name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  participants: {
    user_id: string;
    first_name: string;
    last_name: string;
  }[];
  skills: string[];
  project_picture_url?: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const projectsPerPage = 9; // Number of projects to display per page

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchAllProjects(currentPage);
  }, [currentPage, backendUrl]);

  const fetchAllProjects = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/api/projects/public?page=${page}&limit=${projectsPerPage}`);

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
        setTotalPages(Math.ceil(data.totalProjects / projectsPerPage));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch projects');
      }
    } catch (err: any) {
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const truncateDescription = (text: string, wordLimit: number) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-8 text-center">
            All Projects
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(projectsPerPage)].map((_, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 text-white rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-48 bg-white/10" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-white/10" />
                  <Skeleton className="h-4 w-1/2 bg-white/10" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-5/6 bg-white/10" />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Skeleton className="h-6 w-20 bg-white/10 rounded-full" />
                    <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center p-4">
        <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-200 w-full max-w-md backdrop-blur-xl">
          <AlertTriangle className="h-4 w-4 text-red-300" />
          <AlertTitle className="text-red-100">Error Loading Projects</AlertTitle>
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-8 text-center">
          All Projects
        </h1>

        {projects.length === 0 && !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Sparkles className="h-16 w-16 text-blue-400 mb-4" />
            <p className="text-xl text-slate-300 mb-2">No projects found.</p>
            <p className="text-slate-400">It looks like there are no projects to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.project_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden">
                  <Link href={`/projects/${project.project_id}`}>
                    <div className="relative w-full h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                      {project.project_picture_url ? (
                        <Image
                          src={project.project_picture_url.startsWith('http') ? project.project_picture_url : `${backendUrl}${project.project_picture_url}`}
                          alt={project.project_name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found';
                            e.currentTarget.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                          <ImageIcon className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">
                      <Link href={`/projects/${project.project_id}`} className="hover:text-blue-300 transition-colors duration-300">
                        {project.project_name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                      By {project.created_by.first_name} {project.created_by.last_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-slate-300 text-sm mb-4">
                      {truncateDescription(project.description, 25)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.slice(0, 3).map((skill, skillIndex) => (
                        <Badge key={skillIndex} className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {skill}
                        </Badge>
                      ))}
                      {project.skills.length > 3 && (
                        <Badge className="bg-gray-500/20 text-gray-300 border border-gray-500/30">
                          +{project.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{project.participants.length} Members</span>
                      <Calendar className="h-4 w-4 ml-auto" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} 
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      onClick={() => setCurrentPage(i + 1)} 
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
