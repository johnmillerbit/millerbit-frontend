"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  User, 
  Code2, 
  Camera, 
  Video, 
  ExternalLink, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Play,
  Image as ImageIcon
} from "lucide-react";

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
  media: {
    media_type: string;
    url: string;
    description?: string;
  }[];
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id as string);
    }
  }, [id, backendUrl]);

  const fetchProjectDetails = async (projectId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/api/projects/public/${projectId}`);

      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch project details');
      }
    } catch (err: any) {
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          icon: CheckCircle,
          className: 'bg-green-500/20 text-green-400 border-green-500/30',
          bgClass: 'bg-green-500/10'
        };
      case 'pending':
        return {
          icon: Clock,
          className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          bgClass: 'bg-yellow-500/10'
        };
      default:
        return {
          icon: AlertTriangle,
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          bgClass: 'bg-red-500/10'
        };
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'link':
        return ExternalLink;
      default:
        return Camera;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Hero Skeleton */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
              <div className="space-y-6">
                <Skeleton className="h-10 w-32 bg-white/10" />
                <div className="text-center space-y-4">
                  <Skeleton className="h-16 w-3/4 mx-auto bg-white/10" />
                  <Skeleton className="h-6 w-full max-w-3xl mx-auto bg-white/10" />
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Skeleton className="h-8 w-24 bg-white/10 rounded-full" />
                    <Skeleton className="h-8 w-32 bg-white/10 rounded-full" />
                    <Skeleton className="h-8 w-28 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full bg-white/5 rounded-2xl" />
                <Skeleton className="h-48 w-full bg-white/5 rounded-2xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-32 w-full bg-white/5 rounded-2xl" />
                <Skeleton className="h-40 w-full bg-white/5 rounded-2xl" />
              </div>
            </div>
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
          <AlertTitle className="text-red-100">Error Loading Project</AlertTitle>
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center p-4">
        <Alert variant="default" className="bg-blue-900/20 border-blue-500/30 text-blue-200 w-full max-w-md backdrop-blur-xl">
          <AlertTriangle className="h-4 w-4 text-blue-300" />
          <AlertTitle className="text-blue-100">Not Found</AlertTitle>
          <AlertDescription className="text-blue-200">
            No project data found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 group hover:border-white/20 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              {/* Back Button */}
              <div className="mb-8">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm group/back"
                >
                  <ArrowLeft className="mr-2 w-5 h-5 group-hover/back:-translate-x-1 transition-transform duration-300" />
                  Back to Portfolio
                </Button>
              </div>

              {/* Project Header */}
              <div className="text-center mb-10">
                <div className="flex items-center gap-2 justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                  <Badge className={`${statusConfig.className} border px-4 py-2 rounded-full flex items-center gap-2 animate-pulse`}>
                    <StatusIcon className="h-4 w-4" />
                    {project.status}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
                  {project.project_name}
                </h1>
                
                <p className="text-lg md:text-xl text-slate-300 font-light max-w-4xl mx-auto leading-relaxed">
                  {project.description}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 mt-8 justify-center">
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium">{project.created_by.first_name} {project.created_by.last_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <Users className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium">{project.participants.length} Members</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <Code2 className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium">{project.skills.length} Skills</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Team Members Section */}
              {project.participants && project.participants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/10">
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                          <Users className="h-5 w-5" />
                        </div>
                        Team Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.participants.map((participant, index) => (
                          <Link 
                            key={participant.user_id} 
                            href={`/profile/${participant.user_id}`}
                            className="group/member"
                          >
                            <div 
                              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 cursor-pointer"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-75 group-hover/member:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20">
                                  {participant.first_name[0]}{participant.last_name[0]}
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-white group-hover/member:text-blue-300 transition-colors duration-300">
                                  {participant.first_name} {participant.last_name}
                                </p>
                                <p className="text-sm text-slate-400">Team Member</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-slate-400 group-hover/member:text-white opacity-0 group-hover/member:opacity-100 transition-all duration-300" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Skills & Technologies Section */}
              {project.skills && project.skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/10">
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <Code2 className="h-5 w-5" />
                        </div>
                        Technologies & Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-3">
                        {project.skills.map((skill, index) => (
                          <Badge 
                            key={index} 
                            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105 cursor-default"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Project Media Section */}
              {project.media && project.media.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/10">
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                          <Camera className="h-5 w-5" />
                        </div>
                        Project Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {project.media.map((item, index) => {
                          const MediaIcon = getMediaIcon(item.media_type);
                          return (
                            <div 
                              key={index} 
                              className="group/media bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                              style={{ animationDelay: `${index * 150}ms` }}
                            >
                              {item.media_type === 'image' && (
                                <div className="relative w-full h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                                  <Image
                                    src={item.url.startsWith('http') ? item.url : `${backendUrl}${item.url}`}
                                    alt={item.description || `Project image ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover/media:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found';
                                      e.currentTarget.onerror = null;
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300"></div>
                                </div>
                              )}
                              
                              {item.media_type === 'video' && (
                                <div className="relative w-full h-48 bg-gradient-to-br from-red-500/10 to-pink-500/10 flex items-center justify-center group/video">
                                  <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex flex-col items-center gap-3 text-center p-6 group-hover/video:scale-110 transition-transform duration-300"
                                  >
                                    <div className="p-4 bg-red-500/20 rounded-full group-hover/video:bg-red-500/30 transition-colors duration-300">
                                      <Play className="w-8 h-8 text-red-400" />
                                    </div>
                                    <span className="text-red-300 font-medium">Watch Video</span>
                                  </a>
                                </div>
                              )}
                              
                              {item.media_type === 'link' && (
                                <div className="relative w-full h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center group/link">
                                  <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex flex-col items-center gap-3 text-center p-6 group-hover/link:scale-110 transition-transform duration-300"
                                  >
                                    <div className="p-4 bg-cyan-500/20 rounded-full group-hover/link:bg-cyan-500/30 transition-colors duration-300">
                                      <ExternalLink className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <span className="text-cyan-300 font-medium">Visit Link</span>
                                  </a>
                                </div>
                              )}
                              
                              {item.description && (
                                <div className="p-4">
                                  <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-xl font-bold">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${statusConfig.className.includes('green') ? 'text-green-400' : statusConfig.className.includes('yellow') ? 'text-yellow-400' : 'text-red-400'}`} />
                      <div>
                        <p className="text-sm text-slate-400">Status</p>
                        <Badge className={`${statusConfig.className} border-0 capitalize`}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-slate-400">Created</p>
                        <p className="text-white font-medium">{new Date(project.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-slate-400">Last Updated</p>
                        <p className="text-white font-medium">{new Date(project.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Project Creator */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-xl font-bold">Project Creator</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Link href={`/profile/${project.created_by.user_id}`} className="group/creator">
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 cursor-pointer">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-75 group-hover/creator:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20">
                            {project.created_by.first_name[0]}{project.created_by.last_name[0]}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white group-hover/creator:text-blue-300 transition-colors duration-300">
                            {project.created_by.first_name} {project.created_by.last_name}
                          </p>
                          <p className="text-sm text-slate-400">{project.created_by.email}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-slate-400 group-hover/creator:text-white opacity-0 group-hover/creator:opacity-100 transition-all duration-300" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}