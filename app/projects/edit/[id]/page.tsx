"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  Upload, 
  AlertTriangle,
  Sparkles,
  Users,
  Code2,
  Camera,
  Trash2,
  ExternalLink,
  Video,
  Image as ImageIcon,
  Search
} from "lucide-react";

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
  project_picture_url?: string;
}

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
}

interface Skill {
  skill_name: string;
}

interface FormData {
  project_name: string;
  description: string;
  participants: string[]; // Added participants to FormData
  skills: string[];
  media: {
    media_type: string;
    url: string;
    description?: string;
  }[];
}

export default function ProjectEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<FormData>({
    project_name: '',
    description: '',
    participants: [], // Initialize participants
    skills: [],
    media: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newMedia, setNewMedia] = useState({
    media_type: 'image',
    url: '',
    description: ''
  });
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // New states for Team & Skills
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [loadingUsersSkills, setLoadingUsersSkills] = useState(true);
  const [errorUsersSkills, setErrorUsersSkills] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchUsersAndSkills = async () => {
    setLoadingUsersSkills(true);
    setErrorUsersSkills(null);
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const usersResponse = await fetch(`${backendUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!usersResponse.ok) {
        throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
      }
      const usersData = await usersResponse.json();
      setAllUsers(usersData.users);

      const skillsResponse = await fetch(`${backendUrl}/api/skills`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!skillsResponse.ok) {
        throw new Error(`Failed to fetch skills: ${skillsResponse.statusText}`);
      }
      const skillsData = await skillsResponse.json();
      setAllSkills(skillsData);

    } catch (error: any) {
      console.error("Error fetching users or skills:", error);
      setErrorUsersSkills(error.message || "Failed to load users or skills.");
    } finally {
      setLoadingUsersSkills(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id as string);
      fetchUsersAndSkills(); // Fetch users and skills when component mounts
    }
  }, [id, backendUrl]);

  const fetchProjectDetails = async (projectId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/api/projects/public/${projectId}`);

      if (response.ok) {
        const data = await response.json();
        setProject(data);
        setFormData({
          project_name: data.project_name,
          description: data.description,
          participants: data.participants.map((p: User) => p.user_id) || [], // Populate participants
          skills: data.skills || [],
          media: data.media || []
        });
        if (data.project_picture_url) {
          setImagePreview(`${backendUrl}${data.project_picture_url}`);
        }
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

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // const addSkill = () => {
  //   if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
  //     handleInputChange('skills', [...formData.skills, newSkill.trim()]);
  //     setNewSkill('');
  //   }
  // };

  // const removeSkill = (skillToRemove: string) => {
  //   handleInputChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
  // };

  const addMedia = () => {
    if (newMedia.url.trim()) {
      handleInputChange('media', [...formData.media, { ...newMedia }]);
      setNewMedia({ media_type: 'image', url: '', description: '' });
    }
  };

  const removeMedia = (index: number) => {
    handleInputChange('media', formData.media.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = Cookies.get('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('project_name', formData.project_name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('participants', JSON.stringify(formData.participants)); // Add participants
      formDataToSend.append('skills', JSON.stringify(formData.skills));
      formDataToSend.append('media', JSON.stringify(formData.media));
      
      if (projectImage) {
        formDataToSend.append('project_picture', projectImage);
      }

      const response = await fetch(`${backendUrl}/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        setSuccess('Project updated successfully!');
        setTimeout(() => {
          router.push(`/projects/${id}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update project');
      }
    } catch (err: any) {
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    setError('');
    setSuccess('');
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${backendUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Project deleted successfully!');
        setTimeout(() => {
          router.push('/projects'); // Redirect to portfolio or dashboard after deletion
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete project');
      }
    } catch (err: any) {
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'link':
        return ExternalLink;
      default:
        return Camera;
    }
  };

  const filteredUsers = allUsers.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredSkills = allSkills.filter(skill =>
    skill.skill_name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center p-4">
        <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-200 w-full max-w-md backdrop-blur-xl">
          <AlertTriangle className="h-4 w-4 text-red-300" />
          <AlertTitle className="text-red-100">Error Loading Project</AlertTitle>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm group"
              >
                <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Project
              </Button>
            </div>

            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
                Edit Project
              </h1>
              <p className="text-slate-400 text-lg">Update your project details and media</p>
            </div>
          </motion.div>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-200 backdrop-blur-xl">
                <AlertTriangle className="h-4 w-4 text-red-300" />
                <AlertTitle className="text-red-100">Error</AlertTitle>
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert className="bg-green-900/20 border-green-500/30 text-green-200 backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-green-300" />
                <AlertTitle className="text-green-100">Success</AlertTitle>
                <AlertDescription className="text-green-200">{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Basic Information */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project_name" className="text-slate-300 font-medium">Project Name</Label>
                    <Input
                      id="project_name"
                      value={formData.project_name}
                      onChange={(e) => handleInputChange('project_name', e.target.value)}
                      className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-slate-300 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 min-h-32 resize-none"
                      placeholder="Describe your project"
                      required
                    />
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Project Image Upload */}
                <div className="space-y-4">
                  <Label className="text-slate-300 font-medium">Project Image</Label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-white/20">
                        <Image
                          src={imagePreview}
                          alt="Project preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="project-image"
                      />
                      <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        <Label htmlFor="project-image" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          {imagePreview ? 'Change Image' : 'Upload Image'}
                        </Label>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members and Skills Section */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  Team & Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {loadingUsersSkills ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
                    <p className="text-slate-300">Loading users and skills...</p>
                  </div>
                ) : errorUsersSkills ? (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-200 backdrop-blur-xl">
                    <AlertTriangle className="h-4 w-4 text-red-300" />
                    <AlertTitle className="text-red-100">Error Loading Team/Skills</AlertTitle>
                    <AlertDescription className="text-red-200">{errorUsersSkills}</AlertDescription>
                    <Button onClick={fetchUsersAndSkills} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                      Retry Loading
                    </Button>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team Members */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-400" /> Team Members
                      </h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search team members..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pl-10 rounded-xl h-10 backdrop-blur-sm"
                        />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 h-64 overflow-y-auto custom-scrollbar">
                        <div className="space-y-2">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <div
                                key={user.user_id}
                                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                                  formData.participants.includes(user.user_id)
                                    ? 'bg-green-500/20 border border-green-500/30'
                                    : 'hover:bg-white/10 border border-transparent'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id={`user-${user.user_id}`}
                                  checked={formData.participants.includes(user.user_id)}
                                  onChange={(e) => {
                                    const newSelection = e.target.checked
                                      ? [...formData.participants, user.user_id]
                                      : formData.participants.filter((id) => id !== user.user_id);
                                    handleInputChange('participants', newSelection);
                                  }}
                                  className="form-checkbox h-4 w-4 text-green-500 rounded border-white/30 bg-white/10 focus:ring-green-500 mr-3"
                                />
                                <Label htmlFor={`user-${user.user_id}`} className="flex-1 cursor-pointer text-white font-medium">
                                  {user.first_name} {user.last_name}
                                </Label>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6">
                              <Users className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                              <p className="text-slate-500">No team members found</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {formData.participants.length > 0 && (
                        <div className="text-center p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-300 font-medium">
                          {formData.participants.length} member{formData.participants.length !== 1 ? 's' : ''} selected
                        </div>
                      )}
                    </div>

                    {/* Required Skills */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-blue-400" /> Required Skills
                      </h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search skills..."
                          value={skillSearch}
                          onChange={(e) => setSkillSearch(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pl-10 rounded-xl h-10 backdrop-blur-sm"
                        />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 h-64 overflow-y-auto custom-scrollbar">
                        <div className="space-y-2">
                          {filteredSkills.length > 0 ? (
                            filteredSkills.map((skill) => (
                              <div
                                key={skill.skill_name}
                                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                                  formData.skills.includes(skill.skill_name)
                                    ? 'bg-blue-500/20 border border-blue-500/30'
                                    : 'hover:bg-white/10 border border-transparent'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id={`skill-${skill.skill_name}`}
                                  checked={formData.skills.includes(skill.skill_name)}
                                  onChange={(e) => {
                                    const newSelection = e.target.checked
                                      ? [...formData.skills, skill.skill_name]
                                      : formData.skills.filter((s) => s !== skill.skill_name);
                                    handleInputChange('skills', newSelection);
                                  }}
                                  className="form-checkbox h-4 w-4 text-blue-500 rounded border-white/30 bg-white/10 focus:ring-blue-500 mr-3"
                                />
                                <Label htmlFor={`skill-${skill.skill_name}`} className="flex-1 cursor-pointer text-white font-medium">
                                  {skill.skill_name}
                                </Label>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6">
                              <Code2 className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                              <p className="text-slate-500">No skills found</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {formData.skills.length > 0 && (
                        <div className="text-center p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 font-medium">
                          {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''} selected
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Media Section */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                    <Camera className="h-5 w-5" />
                  </div>
                  Project Media
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300 font-medium">Media Type</Label>
                      <Select
                        value={newMedia.media_type}
                        onValueChange={(value) => setNewMedia({ ...newMedia, media_type: value })}
                      >
                        <SelectTrigger className="mt-2 bg-white/5 border-white/20 text-white focus:border-cyan-400">
                          <SelectValue placeholder="Select media type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/20">
                          <SelectItem value="image" className="text-white focus:bg-white/10">Image</SelectItem>
                          <SelectItem value="video" className="text-white focus:bg-white/10">Video</SelectItem>
                          <SelectItem value="link" className="text-white focus:bg-white/10">Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300 font-medium">URL</Label>
                      <Input
                        value={newMedia.url}
                        onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                        className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400"
                        placeholder="Enter media URL"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 font-medium">Description (Optional)</Label>
                      <Input
                        value={newMedia.description}
                        onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                        className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400"
                        placeholder="Media description"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={addMedia}
                    disabled={!newMedia.url.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Media
                  </Button>
                </div>

                {formData.media.length > 0 && (
                  <>
                    <Separator className="bg-white/10" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.media.map((item, index) => {
                        const MediaIcon = getMediaIcon(item.media_type);
                        return (
                          <Card
                            key={index}
                            className="bg-white/5 border-white/10 text-white hover:border-white/20 transition-colors"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <MediaIcon className="h-4 w-4 text-cyan-400" />
                                  <Badge variant="outline" className="text-xs capitalize border-cyan-400/30 text-cyan-300">
                                    {item.media_type}
                                  </Badge>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMedia(index)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-auto p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-slate-300 break-all mb-2 font-mono bg-white/5 p-2 rounded">
                                {item.url}
                              </p>
                              {item.description && (
                                <p className="text-xs text-slate-400 italic">{item.description}</p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || !formData.project_name.trim() || !formData.description.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 min-w-32"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </div>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                className="bg-red-600/80 hover:bg-red-700/80 text-white backdrop-blur-sm group"
              >
                <Trash2 className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Delete Project
              </Button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 border border-slate-700 p-8 rounded-lg shadow-2xl max-w-md w-full text-center"
          >
            <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Confirm Deletion</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProject}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Project
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
