"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

interface UserProfile {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  bio: string;
  profile_picture_url: string;
  role: string;
  status: string;
  skills: string[];
}

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [newSkill, setNewSkill] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [success, setSuccess] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (id) {
      fetchUserProfile(id as string);
    }
  }, [id, backendUrl]); // Added backendUrl to dependency array

  const fetchUserProfile = async (userId: string) => {
    setLoading(true);
    setError('');
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setFormData(data); // Initialize form data with current user data
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch user profile');
      }
    } catch (err: any) {
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...(formData.skills || []), newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills?.filter(s => s !== skillToRemove) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        return;
      }

      // Update basic profile info
      const updateResponse = await fetch(`${backendUrl}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        setError(errorData.message || 'Failed to update profile');
        return;
      }

      // Upload profile picture if a new one is selected
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('profile_picture', profilePictureFile);

        const uploadResponse = await fetch(`${backendUrl}/api/users/${id}/profile-picture`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          setError(errorData.message || 'Failed to upload profile picture');
          return;
        }
      }

      setIsEditing(false);
      fetchUserProfile(id as string); // Re-fetch updated profile
      // Using a custom message box instead of alert()
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds

    } catch (err: any) {
      setError('An unexpected error occurred: ' + err.message);
    }
  };

  const defaultAvatar = 'https://placehold.co/160x160/333333/FFFFFF?text=Avatar'; // A tech-themed placeholder

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-indigo-400 text-xl">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="ml-4">Loading profile...</p>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-400 text-xl">{error}</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400 text-xl">No user data found.</div>;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-inter relative overflow-hidden py-12 flex items-center justify-center">
      {/* Global background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl w-full mx-auto px-4 relative z-10"
      >
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center shadow-lg"
          >
            {success}
          </motion.div>
        )}

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-8 drop-shadow-lg">
              Edit Profile
            </h1>

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={profilePictureFile ? URL.createObjectURL(profilePictureFile) : (user?.profile_picture_url ? `${backendUrl}${user.profile_picture_url}` : defaultAvatar)}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-md"
              />
              <input
                type="file"
                id="profile_picture_upload"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="profile_picture_upload" className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">
                Change Picture
              </label>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                <input type="text" name="first_name" value={formData.first_name || ''} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500 transition-colors duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                <input type="text" name="last_name" value={formData.last_name || ''} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500 transition-colors duration-200" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                <input type="text" name="position" value={formData.position || ''} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500 transition-colors duration-200" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} rows={4} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500 transition-colors duration-200"></textarea>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills?.map((skill, index) => (
                  <span key={index} className="bg-indigo-700 text-indigo-200 px-3 py-1 rounded-full flex items-center text-sm font-semibold border border-indigo-600">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-red-400 hover:text-red-300 font-bold text-lg transition-colors duration-200">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a new skill" className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500 transition-colors duration-200" />
                <button type="button" onClick={handleAddSkill} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50">Add Skill</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-600 focus:ring-opacity-50">Cancel</button>
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">Save Changes</button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Picture and Basic Info */}
              <div className="flex-shrink-0 text-center">
                <img
                  src={user.profile_picture_url ? `${backendUrl}${user.profile_picture_url}` : defaultAvatar}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-cyan-500 shadow-md mx-auto"
                />
                <h1 className="text-3xl font-bold text-gray-100 mt-4">{user.first_name} {user.last_name}</h1>
                <p className="text-lg text-gray-300">{user.position || 'No position specified'}</p>
                <p className="text-sm text-gray-400 mt-1">{user.email}</p>
                <div className="mt-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.status === 'active' ? 'bg-green-700 text-green-200 border border-green-600' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}>
                    {user.status}
                  </span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${user.role === 'Team Leader' ? 'bg-purple-700 text-purple-200 border border-purple-600' : 'bg-blue-700 text-blue-200 border border-blue-600'}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Bio and Skills */}
              <div className="flex-grow">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">About Me</h2>
                  <p className="text-gray-300 leading-relaxed">{user.bio || 'No bio provided.'}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <span key={index} className="bg-indigo-700 text-indigo-200 px-4 py-2 rounded-lg text-md font-medium border border-indigo-600">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills listed.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">
                Edit Profile
              </button>
            </div>
          </div>
        )}
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
