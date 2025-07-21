"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion'; // For animations
import Cookies from 'js-cookie'; // Needed for fetching users/skills for filters

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
  skills: string[];
  images: string[];
  videos: string[];
  links: string[];
}

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
}

interface Skill {
  skill_name: string;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  // Use the actual backendUrl from environment variables
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchProjects();
    fetchUsersAndSkillsForFilters();
  }, [searchTerm, selectedMember, selectedSkill]);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      let query = '';
      if (selectedMember) query += `memberId=${selectedMember}&`;
      if (selectedSkill) query += `skillName=${selectedSkill}&`;
      if (searchTerm) query += `searchTerm=${encodeURIComponent(searchTerm)}&`;

      const response = await fetch(`${backendUrl}/api/projects/portfolio?${query}`);

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
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

  const fetchUsersAndSkillsForFilters = async () => {
    try {
      const token = Cookies.get('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const usersResponse = await fetch(`${backendUrl}/api/users`, { headers });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setAllUsers(usersData);
      } else {
        console.error('Failed to fetch users for filter:', await usersResponse.json());
      }

      const skillsResponse = await fetch(`${backendUrl}/api/skills`, { headers });
      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json();
        setAllSkills(skillsData);
      } else {
        console.error('Failed to fetch skills for filter:', await skillsResponse.json());
      }
    } catch (err) {
      console.error('Error fetching filter data:', err);
    }
  };

  // Framer Motion variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
      <p className="ml-4">Loading portfolio...</p>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-500 text-xl">{error}</div>;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-inter relative overflow-hidden py-12">
      {/* Global background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4 drop-shadow-lg leading-tight"
          >
            Our Innovation Showcase
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mt-2 max-w-2xl mx-auto font-light"
          >
            Dive into a collection of pioneering projects crafted by our visionary team.
          </motion.p>
        </header>

        {/* Filters */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="flex flex-col md:flex-row gap-4 mb-12 p-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-800"
        >
          <motion.input
            variants={itemVariants}
            type="text"
            placeholder="Search projects by name or description..."
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <motion.select
            variants={itemVariants}
            className="p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="" className="bg-gray-800 text-gray-300">All Members</option>
            {allUsers.map((user) => (
              <option key={user.user_id} value={user.user_id} className="bg-gray-800 text-gray-300">
                {user.first_name} {user.last_name}
              </option>
            ))}
          </motion.select>
          <motion.select
            variants={itemVariants}
            className="p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="" className="bg-gray-800 text-gray-300">All Skills</option>
            {allSkills.map((skill) => (
              <option key={skill.skill_name} value={skill.skill_name} className="bg-gray-800 text-gray-300">
                {skill.skill_name}
              </option>
            ))}
          </motion.select>
          <motion.button
            variants={itemVariants}
            onClick={() => { setSearchTerm(''); setSelectedMember(''); setSelectedSkill(''); }}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
          >
            Clear Filters
          </motion.button>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500 text-xl mt-16 p-8 bg-gray-900 rounded-xl shadow-lg border border-gray-800"
          >
            <p>No projects match your current filter criteria. Try adjusting your selections!</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {projects.map((project) => (
              <motion.div
                key={project.project_id}
                variants={itemVariants}
                className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 transform transition duration-300 hover:scale-[1.02] hover:shadow-purple-500/30 group"
              >
                {project.images && project.images.length > 0 && (
                  <div className="relative w-full h-64 bg-gray-700 overflow-hidden">
                    <Image
                      src={`${backendUrl}${project.images[0]}`} // Use backendUrl for image paths
                      alt={project.project_name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                      // Fallback for image loading errors
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/600x400/333333/FFFFFF?text=Project+Image`;
                        e.currentTarget.onerror = null; // Prevents infinite loop if fallback also fails
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  </div>
                )}
                <div className="p-7">
                  <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300">{project.project_name}</h2>
                  <p className="text-gray-400 text-base mb-5 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="bg-indigo-700 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm italic">By: {project.created_by.first_name} {project.created_by.last_name}</p>
                  <div className="mt-6 flex justify-end">
                    <Link href={`/projects/${project.project_id}`} className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-300 group-hover:underline">
                      Learn More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

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
