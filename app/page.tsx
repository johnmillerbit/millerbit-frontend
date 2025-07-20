"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion'; // For animations

interface OverviewData {
  memberCount: number;
  totalProjects: number;
}

interface Project {
  project_id: string;
  project_name: string;
  description: string;
  images: string[];
  created_by: {
    first_name: string;
    last_name: string;
  };
}

export default function LandingPage() {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch overview data
        const overviewResponse = await fetch(`${backendUrl}/api/dashboard/overview`);
        if (overviewResponse.ok) {
          const data = await overviewResponse.json();
          setOverviewData(data);
        } else {
          console.error('Failed to fetch overview data:', await overviewResponse.json());
        }

        // Fetch featured projects (e.g., first 3 approved projects)
        const projectsResponse = await fetch(`${backendUrl}/api/projects/portfolio`);
        if (projectsResponse.ok) {
          const data = await projectsResponse.json();
          setFeaturedProjects(data.slice(0, 3)); // Take first 3 as featured
        } else {
          console.error('Failed to fetch featured projects:', await projectsResponse.json());
        }

      } catch (err: any) {
        setError('An unexpected error occurred: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading landing page...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Background animation or image */}
          <div className="absolute inset-0 bg-cover bg-center animate-pulse-bg" style={{ backgroundImage: 'url(/next.svg)' }}></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
        <motion.div
          className="z-10 p-8 bg-white bg-opacity-80 rounded-lg shadow-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold text-indigo-800 mb-4">
            Welcome to Our Team Portfolio
          </h1>
          <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Showcasing innovative projects and the talented individuals behind them.
          </p>
          <Link href="/portfolio" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
            Explore Projects
          </Link>
        </motion.div>
      </section>

      {/* Overview Section */}
      {overviewData && (
        <section className="py-20 bg-white text-center">
          <motion.div
            className="max-w-4xl mx-auto px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-800 mb-10">
              Our Impact
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="bg-blue-50 p-8 rounded-lg shadow-md">
                <h3 className="text-5xl font-extrabold text-blue-600">{overviewData.memberCount}</h3>
                <p className="text-xl text-gray-700 mt-2">Talented Members</p>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-green-50 p-8 rounded-lg shadow-md">
                <h3 className="text-5xl font-extrabold text-green-600">{overviewData.totalProjects}</h3>
                <p className="text-xl text-gray-700 mt-2">Completed Projects</p>
              </motion.div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-gray-100">
          <motion.div
            className="max-w-7xl mx-auto px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center text-gray-800 mb-12">
              Featured Projects
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <motion.div
                  key={project.project_id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  {project.images && project.images.length > 0 && (
                    <div className="relative w-full h-48 bg-gray-200">
                      <Image
                        src={`${backendUrl}${project.images[0]}`}
                        alt={project.project_name}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-indigo-700">{project.project_name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                    <p className="text-gray-500 text-xs">By: {project.created_by.first_name} {project.created_by.last_name}</p>
                    <div className="mt-4 flex justify-end">
                      <Link href={`/projects/${project.project_id}`} className="text-blue-600 hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div variants={itemVariants} className="text-center mt-12">
              <Link href="/portfolio" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
                View All Projects
              </Link>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Your Team Name. All rights reserved.</p>
      </footer>
    </main>
  );
}
