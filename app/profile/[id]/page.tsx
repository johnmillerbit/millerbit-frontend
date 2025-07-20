"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';

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

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (id) {
      fetchUserProfile(id as string);
    }
  }, [id]);

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
      alert('Profile updated successfully!');

    } catch (err: any) {
      setError('An unexpected error occurred: ' + err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">No user data found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">User Profile</h1>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Position:</label>
              <input
                type="text"
                name="position"
                value={formData.position || ''}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Bio:</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                rows={4}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Profile Picture:</label>
              <input
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Skills:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills?.map((skill, index) => (
                  <span key={index} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full flex items-center">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-blue-800 hover:text-blue-600">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add new skill"
                  className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <button type="button" onClick={handleAddSkill} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline">
                  Add
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {user.profile_picture_url && (
              <div className="flex justify-center mb-4">
                <img
                  src={`${backendUrl}${user.profile_picture_url}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
            )}
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Position:</strong> {user.position || 'N/A'}</p>
            <p><strong>Bio:</strong> {user.bio || 'N/A'}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Status:</strong> {user.status}</p>
            <div>
              <strong>Skills:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span>No skills listed.</span>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
