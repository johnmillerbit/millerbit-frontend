"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      if (searchTerm) query += `searchTerm=${encodeURIComponent(searchTerm)}&`; // Assuming backend will support searchTerm

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading portfolio...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">Team Portfolio</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search projects..."
            className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">Filter by Member</option>
            {allUsers.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
          <select
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">Filter by Skill</option>
            {allSkills.map((skill) => (
              <option key={skill.skill_name} value={skill.skill_name}>
                {skill.skill_name}
              </option>
            ))}
          </select>
          <button
            onClick={() => { setSearchTerm(''); setSelectedMember(''); setSelectedSkill(''); }}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Clear Filters
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-600 text-xl mt-10">No approved projects found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.project_id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  <h2 className="text-xl font-bold mb-2">{project.project_name}</h2>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">Created by: {project.created_by.first_name} {project.created_by.last_name}</p>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/projects/${project.project_id}`} className="text-blue-600 hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
