"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

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

  const defaultPlaceholderImage = 'https://placehold.co/600x400/333333/FFFFFF?text=Project+Media';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-indigo-400 text-xl">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="ml-4">Loading project details...</p>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-400 text-xl">{error}</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400 text-xl">No project data found.</div>;

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
        className="max-w-6xl w-full mx-auto px-4 relative z-10"
      >
        <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-300"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Portfolio
            </button>
          </div>

          {/* Project Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4 drop-shadow-lg leading-tight">
              {project.project_name}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-light max-w-3xl mx-auto">
              {project.description}
            </p>
            <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${project.status === 'approved' ? 'bg-green-700 text-green-200 border border-green-600' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}>
                Status: {project.status}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-700 text-blue-200 border border-blue-600">
                Created By: {project.created_by.first_name} {project.created_by.last_name}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-700 text-purple-200 border border-purple-600">
                Created On: {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Participants Section */}
          {(project.participants && project.participants.length > 0) && (
            <div className="mb-10 p-6 bg-gray-800 rounded-xl shadow-inner border border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Team Members</h2>
              <div className="flex flex-wrap gap-4">
                {project.participants.map(participant => (
                  <Link key={participant.user_id} href={`/profile/${participant.user_id}`} className="flex items-center bg-gray-700 hover:bg-gray-600 rounded-full px-4 py-2 transition-colors duration-200 group">
                    {/* Placeholder for participant profile picture */}
                    <img
                      src={`https://placehold.co/32x32/555555/EEEEEE?text=${participant.first_name[0]}`}
                      alt={participant.first_name}
                      className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-500"
                    />
                    <span className="text-gray-200 font-medium group-hover:text-white">{participant.first_name} {participant.last_name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {(project.skills && project.skills.length > 0) && (
            <div className="mb-10 p-6 bg-gray-800 rounded-xl shadow-inner border border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Key Technologies & Skills</h2>
              <div className="flex flex-wrap gap-3">
                {project.skills.map((skill, index) => (
                  <span key={index} className="bg-indigo-700 text-indigo-200 px-4 py-2 rounded-lg text-md font-medium border border-indigo-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Media Section */}
          {(project.media && project.media.length > 0) && (
            <div className="mb-10 p-6 bg-gray-800 rounded-xl shadow-inner border border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Project Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.media.map((item, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg overflow-hidden shadow-md border border-gray-600 flex flex-col">
                    {item.media_type === 'image' && (
                      <div className="relative w-full h-48 bg-gray-600 flex items-center justify-center">
                        <Image
                          src={item.url.startsWith('http') ? item.url : `${backendUrl}${item.url}`}
                          alt={item.description || `Project image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          onError={(e) => {
                            e.currentTarget.src = defaultPlaceholderImage;
                            e.currentTarget.onerror = null;
                          }}
                        />
                      </div>
                    )}
                    {item.media_type === 'video' && (
                      <div className="relative w-full h-48 bg-gray-600 flex items-center justify-center">
                        {/* Embedding videos directly might require specific embed codes or iframes */}
                        {/* For simplicity, linking to video or using a placeholder */}
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-center p-4">
                          <svg className="mx-auto mb-2 w-10 h-10 text-cyan-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3C2 3 1 4 1 5v14c0 1 1 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm-8 15V6l8 6-8 6z"></path></svg>
                          Watch Video
                        </a>
                      </div>
                    )}
                    {item.media_type === 'link' && (
                      <div className="relative w-full h-48 bg-gray-600 flex items-center justify-center">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-center p-4">
                          <svg className="mx-auto mb-2 w-10 h-10 text-cyan-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9V7h2v10zm4 0h-2V7h2v10z"></path></svg>
                          View Link
                        </a>
                      </div>
                    )}
                    {item.description && (
                      <div className="p-4 text-gray-300 text-sm">
                        <p className="font-medium">{item.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer for project details (optional) */}
          <div className="text-center text-gray-500 text-sm mt-10">
            <p>Last updated: {new Date(project.updated_at).toLocaleDateString()} at {new Date(project.updated_at).toLocaleTimeString()}</p>
          </div>
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
