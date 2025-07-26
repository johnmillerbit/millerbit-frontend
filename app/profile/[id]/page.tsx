// app/profile/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Github, Linkedin, ExternalLink, Mail, Calendar, MapPin, Award, Briefcase, Code2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Cookies from 'js-cookie';
import Image from 'next/image';

// Types
export type MemberDetail = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  bio?: string;
  profile_picture_url?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  skill_id: string;
  skill_name: string;
};

export type Project = {
  project_id: string;
  project_name: string;
  description?: string;
  status: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

export default function MemberProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User ID not found in URL.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get('token');
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch Member Details
        const memberResponse = await fetch(`http://localhost:5000/api/users/${userId}`, { headers });
        if (!memberResponse.ok) {
          throw new Error(`Failed to fetch member details: ${memberResponse.status}`);
        }
        const memberData: MemberDetail = await memberResponse.json();
        setMember(memberData);

        // Fetch Member Skills
        const skillsResponse = await fetch(`http://localhost:5000/api/users/${userId}/skills`, { headers });
        if (skillsResponse.ok) {
          const skillsData: Skill[] = await skillsResponse.json();
          setSkills(skillsData);
        }

        // Fetch Member Projects
        const projectsResponse = await fetch(`http://localhost:5000/api/users/${userId}/projects`, { headers });
        if (projectsResponse.ok) {
          const projectsData: Project[] = await projectsResponse.json();
          setProjects(projectsData);
        }

      } catch (err: any) {
        setError(err.message || "An unexpected error occurred while fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Skeleton */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Skeleton className="h-40 w-40 rounded-full bg-white/10" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-12 w-3/4 bg-white/10" />
                  <Skeleton className="h-6 w-1/2 bg-white/10" />
                  <Skeleton className="h-4 w-full bg-white/10" />
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
          <AlertTitle className="text-red-100">Error Loading Profile</AlertTitle>
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center p-4">
        <Alert variant="default" className="bg-blue-900/20 border-blue-500/30 text-blue-200 w-full max-w-md backdrop-blur-xl">
          <AlertTriangle className="h-4 w-4 text-blue-300" />
          <AlertTitle className="text-blue-100">Not Found</AlertTitle>
          <AlertDescription className="text-blue-200">
            The member with ID "{userId}" could not be found.
          </AlertDescription>
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
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 group hover:border-white/20 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* Profile Picture */}
              <div className="relative group/avatar">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-75 group-hover/avatar:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl transform group-hover/avatar:scale-105 transition-transform duration-300">
                  {member.profile_picture_url ? (
                    <Image
                      src={`http://localhost:5000${member.profile_picture_url}`}
                      alt={`${member.first_name} ${member.last_name}'s profile picture`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
                      {member.first_name[0]}{member.last_name[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 animate-pulse">
                    {member.role}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4 animate-fade-in">
                  {member.first_name} {member.last_name}
                </h1>
                
                <p className="text-xl md:text-2xl text-blue-200 mb-6 font-light">
                  {member.position}
                </p>
                
                {member.bio && (
                  <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                    {member.bio}
                  </p>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <Award className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">{skills.length} Skills</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <Briefcase className="h-4 w-4 text-green-400" />
                    <span className="text-sm">{projects.length} Projects</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Since {new Date(member.created_at).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Section */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Mail className="h-5 w-5" />
                    </div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-slate-400">Email</p>
                        <p className="text-white font-medium">{member.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300">
                      <div className={`p-2 rounded-lg ${member.status === 'active' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <div className={`w-3 h-3 rounded-full ${member.status === 'active' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Status</p>
                        <Badge className={`${member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-0 capitalize`}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Section */}
              {skills.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Code2 className="h-5 w-5" />
                      </div>
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-3">
                      {skills.map((skill, index) => (
                        <Badge 
                          key={skill.skill_id} 
                          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105 cursor-default"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {skill.skill_name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Projects Section */}
              {projects.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      Featured Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {projects.map((project, index) => (
                        <div 
                          key={project.project_id} 
                          className="group/project p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-white group-hover/project:text-blue-300 transition-colors duration-300">
                              {project.project_name}
                            </h3>
                            <Badge className={`${
                              project.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                              project.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                              'bg-red-500/20 text-red-400'
                            } border-0 capitalize`}>
                              {project.status}
                            </Badge>
                          </div>
                          
                          {project.description && (
                            <p className="text-slate-300 mb-4 leading-relaxed">
                              {project.description}
                            </p>
                          )}
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">
                              Created {new Date(project.created_at).toLocaleDateString()}
                            </span>
                            <a 
                              href={`/projects/${project.project_id}`} 
                              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 group/link"
                            >
                              View Project 
                              <ExternalLink className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Social Links */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="text-xl font-bold">Connect</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <a 
                      href="#" 
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-gradient-to-r hover:from-gray-600/20 hover:to-gray-700/20 transition-all duration-300 group/social"
                    >
                      <Github className="h-5 w-5 text-gray-300 group-hover/social:text-white transition-colors duration-300" />
                      <span className="group-hover/social:text-white transition-colors duration-300">GitHub</span>
                      <ExternalLink className="h-4 w-4 ml-auto opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" />
                    </a>
                    
                    <a 
                      href="#" 
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-700/20 transition-all duration-300 group/social"
                    >
                      <Linkedin className="h-5 w-5 text-blue-400 group-hover/social:text-blue-300 transition-colors duration-300" />
                      <span className="group-hover/social:text-white transition-colors duration-300">LinkedIn</span>
                      <ExternalLink className="h-4 w-4 ml-auto opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="text-xl font-bold">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-sm text-slate-400">Member Since</p>
                        <p className="text-white">{new Date(member.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-green-400" />
                      <div>
                        <p className="text-sm text-slate-400">Last Updated</p>
                        <p className="text-white">{new Date(member.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}