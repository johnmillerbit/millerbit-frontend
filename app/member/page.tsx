"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Briefcase, Mail, AlertTriangle, Sparkles, User as UserIcon } from "lucide-react";

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  position?: string;
  profile_picture_url?: string;
  status: string;
}

const MembersPage = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const membersPerPage = 9; // Number of members to display per page

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchAllMembers = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/api/users?page=${page}&limit=${membersPerPage}&status=active`); 

      if (response.ok) {
        const data = await response.json();
        setMembers(data.users);
        setTotalPages(Math.ceil(data.totalUsers / membersPerPage));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch members');
      }
    } catch (err: unknown) {
      setError('An unexpected error occurred: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }, [backendUrl, membersPerPage]);

  useEffect(() => {
    fetchAllMembers(currentPage);
  }, [currentPage, fetchAllMembers]);

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
            Our Team Members
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(membersPerPage)].map((_, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 text-white rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-48 bg-white/10" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-white/10" />
                  <Skeleton className="h-4 w-1/2 bg-white/10" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-5/6 bg-white/10" />
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
          <AlertTitle className="text-red-100">Error Loading Members</AlertTitle>
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
          Our Team Members
        </h1>

        {members.length === 0 && !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Sparkles className="h-16 w-16 text-blue-400 mb-4" />
            <p className="text-xl text-slate-300 mb-2">No members found.</p>
            <p className="text-slate-400">It looks like there are no active team members to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <motion.div
                key={member.user_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden">
                  <Link href={`/profile/${member.user_id}`}>
                    <div className="relative w-full aspect-square bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                      {member.profile_picture_url ? (
                        <Image
                          src={`${backendUrl}${member.profile_picture_url}`}
                          alt={`${member.first_name} ${member.last_name}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/600x600/333333/FFFFFF?text=Image+Not+Found';
                            e.currentTarget.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                          <UserIcon className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">
                      <Link href={`/profile/${member.user_id}`} className="hover:text-blue-300 transition-colors duration-300">
                        {member.first_name} {member.last_name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                      {member.position || 'No position specified'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm mt-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{member.role.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
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

export default MembersPage;
