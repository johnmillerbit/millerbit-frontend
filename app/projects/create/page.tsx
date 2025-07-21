"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
}

interface Skill {
  skill_name: string;
}

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [media, setMedia] = useState<{ media_type: string; url: string; description?: string }[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState('image');
  const [newMediaDescription, setNewMediaDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [step, setStep] = useState(1);

  const router = useRouter(); // Initialize useRouter

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchUsersAndSkills = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        return;
      }

      try {
        // Fetch all users (for participants dropdown)
        const usersResponse = await fetch(`${backendUrl}/api/users`, { // Assuming an endpoint to get all users
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setAllUsers(usersData);
        } else {
          console.error('Failed to fetch users:', await usersResponse.json());
        }

        // Fetch all skills (for skills dropdown/input)
        const skillsResponse = await fetch(`${backendUrl}/api/skills`, { // Assuming an endpoint to get all skills
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setAllSkills(skillsData);
        } else {
          console.error('Failed to fetch skills:', await skillsResponse.json());
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
      }
    };
    fetchUsersAndSkills();
  }, [backendUrl]); // Add backendUrl to dependency array

  const handleAddMedia = () => {
    if (newMediaUrl.trim()) {
      setMedia([...media, { media_type: newMediaType, url: newMediaUrl.trim(), description: newMediaDescription.trim() }]);
      setNewMediaUrl('');
      setNewMediaDescription('');
    }
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setMedia(media.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        return;
      }

      const response = await fetch(`${backendUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_name: projectName,
          description,
          participants: selectedParticipants,
          skills: selectedSkills,
          media,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Project created successfully!');
        // Optionally redirect or clear form
        router.push(`/projects/${data.projectId}`); // Redirect to new project page
      } else {
        setError(data.message || 'Failed to create project');
      }
    } catch (err: any) {
      setError('An unexpected error occurred: ' + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-inter relative overflow-hidden py-12 flex items-center justify-center">
      {/* Global background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-pulse"></div>
      </div>

      <div className="max-w-2xl w-full bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-8 drop-shadow-lg">
          Create a New Project
        </h1>

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center mb-4">{error}</motion.p>}
        {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-center mb-4">{success}</motion.p>}

        {/* Stepper */}
        <div className="flex justify-center items-center mb-10">
          {/* Step 1 */}
          <div className={`flex flex-col items-center mx-2 sm:mx-4 ${step >= 1 ? 'text-cyan-400' : 'text-gray-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step >= 1 ? 'bg-cyan-500 text-white shadow-md' : 'bg-gray-700 text-gray-400'}`}>1</div>
            <p className="mt-2 text-sm sm:text-base font-semibold">Details</p>
          </div>
          <div className={`flex-auto border-t-2 mx-2 ${step >= 2 ? 'border-cyan-500' : 'border-gray-700'}`}></div>
          {/* Step 2 */}
          <div className={`flex flex-col items-center mx-2 sm:mx-4 ${step >= 2 ? 'text-cyan-400' : 'text-gray-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step >= 2 ? 'bg-cyan-500 text-white shadow-md' : 'bg-gray-700 text-gray-400'}`}>2</div>
            <p className="mt-2 text-sm sm:text-base font-semibold">Team & Skills</p>
          </div>
          <div className={`flex-auto border-t-2 mx-2 ${step >= 3 ? 'border-cyan-500' : 'border-gray-700'}`}></div>
          {/* Step 3 */}
          <div className={`flex flex-col items-center mx-2 sm:mx-4 ${step >= 3 ? 'text-cyan-400' : 'text-gray-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step >= 3 ? 'bg-cyan-500 text-white shadow-md' : 'bg-gray-700 text-gray-400'}`}>3</div>
            <p className="mt-2 text-sm sm:text-base font-semibold">Media</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-semibold text-gray-200 mb-6">Project Details</h2>
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500 transition-colors duration-200"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1 mt-4">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500 transition-colors duration-200"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Next &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-semibold text-gray-200 mb-6">Assign Team & Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Participants */}
                <div>
                  <label htmlFor="participants" className="block text-sm font-medium text-gray-300 mb-1">
                    Participants
                  </label>
                  <div className="border border-gray-700 rounded-lg p-2 h-48 overflow-y-auto bg-gray-800">
                    {allUsers.map((user) => (
                      <div key={user.user_id} className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
                        <input
                          type="checkbox"
                          id={`user-${user.user_id}`}
                          checked={selectedParticipants.includes(user.user_id)}
                          onChange={() => {
                            const newSelection = selectedParticipants.includes(user.user_id)
                              ? selectedParticipants.filter((id) => id !== user.user_id)
                              : [...selectedParticipants, user.user_id];
                            setSelectedParticipants(newSelection);
                          }}
                          className="h-4 w-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 transition-colors duration-200"
                        />
                        <label htmlFor={`user-${user.user_id}`} className="ml-3 text-sm text-gray-300 cursor-pointer">
                          {user.first_name} {user.last_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">
                    Skills
                  </label>
                  <div className="border border-gray-700 rounded-lg p-2 h-48 overflow-y-auto bg-gray-800">
                    {allSkills.map((skill) => (
                      <div key={skill.skill_name} className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
                        <input
                          type="checkbox"
                          id={`skill-${skill.skill_name}`}
                          checked={selectedSkills.includes(skill.skill_name)}
                          onChange={() => {
                            const newSelection = selectedSkills.includes(skill.skill_name)
                              ? selectedSkills.filter((s) => s !== skill.skill_name)
                              : [...selectedSkills, skill.skill_name];
                            setSelectedSkills(newSelection);
                          }}
                          className="h-4 w-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 transition-colors duration-200"
                        />
                        <label htmlFor={`skill-${skill.skill_name}`} className="ml-3 text-sm text-gray-300 cursor-pointer">
                          {skill.skill_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-600 focus:ring-opacity-50"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Next &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-semibold text-gray-200 mb-6">Project Media</h2>
              <div className="space-y-4">
                {media.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-x-3 flex-wrap">
                      <span className="text-sm font-medium text-gray-200 capitalize">{item.media_type}:</span>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline truncate max-w-[calc(100%-100px)]">{item.url}</a>
                      {item.description && <p className="text-sm text-gray-400">({item.description})</p>}
                    </div>
                    <button type="button" onClick={() => handleRemoveMedia(index)} className="text-red-400 hover:text-red-300 font-bold text-xl transition-colors duration-200">
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Add New Media</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={newMediaType}
                    onChange={(e) => setNewMediaType(e.target.value)}
                    className="p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 transition-colors duration-200"
                  >
                    <option value="image" className="bg-gray-800 text-gray-200">Image</option>
                    <option value="link" className="bg-gray-800 text-gray-200">Link</option>
                    <option value="video" className="bg-gray-800 text-gray-200">Video</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Media URL"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500 transition-colors duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newMediaDescription}
                    onChange={(e) => setNewMediaDescription(e.target.value)}
                    className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500 transition-colors duration-200"
                  />
                  <button type="button" onClick={handleAddMedia} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50">
                    Add Media
                  </button>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-600 focus:ring-opacity-50"
                >
                  &larr; Back
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Create Project
                </button>
              </div>
            </motion.div>
          )}
        </form>
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
