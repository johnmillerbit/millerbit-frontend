"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
  const router = useRouter();

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
  }, []);

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Create New Project</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="projectName" className="block text-gray-700 text-sm font-bold mb-2">
              Project Name:
            </label>
            <input
              type="text"
              id="projectName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              id="description"
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label htmlFor="participants" className="block text-gray-700 text-sm font-bold mb-2">
              Participants:
            </label>
            <select
              id="participants"
              multiple
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={selectedParticipants}
              onChange={(e) =>
                setSelectedParticipants(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allUsers.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.first_name} {user.last_name} ({user.user_id})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
          </div>

          <div>
            <label htmlFor="skills" className="block text-gray-700 text-sm font-bold mb-2">
              Skills:
            </label>
            <select
              id="skills"
              multiple
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={selectedSkills}
              onChange={(e) =>
                setSelectedSkills(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allSkills.map((skill) => (
                <option key={skill.skill_name} value={skill.skill_name}>
                  {skill.skill_name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Project Media:</label>
            <div className="space-y-2 mb-4">
              {media.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{item.media_type}: {item.url} {item.description && `(${item.description})`}</span>
                  <button type="button" onClick={() => handleRemoveMedia(index)} className="text-red-500 hover:text-red-700">
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <select
                value={newMediaType}
                onChange={(e) => setNewMediaType(e.target.value)}
                className="shadow border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              >
                <option value="image">Image</option>
                <option value="link">Link</option>
                <option value="video">Video</option>
              </select>
              <input
                type="text"
                placeholder="Media URL"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newMediaDescription}
                onChange={(e) => setNewMediaDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button type="button" onClick={handleAddMedia} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
