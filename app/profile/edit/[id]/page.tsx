// app/profile/edit/[id]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, UploadCloud, Save, Loader2, X, User, Mail, Briefcase, FileText, Code2, Camera, ArrowLeft, Sparkles, CheckCircle } from "lucide-react"; // Added CheckCircle
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import Cookies from 'js-cookie';
import Image from 'next/image';

// Types
export type MemberDetail = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  bio?: string;
  profile_picture_url?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  skills?: string[];
};

type Skill = {
  skill_id: string;
  skill_name: string;
};

export default function EditMemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<MemberDetail | null>(null);
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]); // New state for all available skills
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User ID not found in URL.");
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      setFormError(null);
      setFormSuccess(null);
      try {
        const token = Cookies.get('token');
        if (!token) {
          setError("Authentication token missing. Please log in.");
          setLoading(false);
          return;
        }

        const headers: HeadersInit = { Authorization: `Bearer ${token}` };

        // Fetch Basic Member Details
        const memberResponse = await fetch(`http://localhost:5000/api/users/${userId}`, { headers });
        if (memberResponse.status === 403) {
            setError("Access Denied: You do not have permission to edit this profile.");
            setLoading(false);
            return;
        }
        if (!memberResponse.ok) {
          throw new Error(`Failed to fetch member details: ${memberResponse.status}`);
        }
        const memberData: MemberDetail = await memberResponse.json();
        setMember(memberData);
        setFormData(memberData);
        if (memberData.profile_picture_url) {
            setProfilePicturePreview(`http://localhost:5000${memberData.profile_picture_url}`);
        }

        // Fetch All Available Skills
        const allSkillsResponse = await fetch(`http://localhost:5000/api/skills`, { headers });
        if (!allSkillsResponse.ok) {
          console.warn(`Failed to fetch all skills: ${allSkillsResponse.status}`);
          setAvailableSkills([]);
        } else {
          const allSkillsData: Skill[] = await allSkillsResponse.json();
          setAvailableSkills(allSkillsData);
        }

        // Fetch Member Skills
        const userSkillsResponse = await fetch(`http://localhost:5000/api/users/${userId}/skills`, { headers });
        if (!userSkillsResponse.ok) {
          console.warn(`Failed to fetch skills for user ${userId}: ${userSkillsResponse.status}`);
          setCurrentSkills([]);
        } else {
          const userSkillsData: Skill[] = await userSkillsResponse.json();
          setCurrentSkills(userSkillsData.map(s => s.skill_name));
        }

      } catch (err: any) {
        setError(err.message || "An unexpected error occurred while fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [id]: value } : null));
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!currentSkills.includes(newSkill)) {
        setCurrentSkills(prev => [...prev, newSkill]);
      }
      setSkillInput('');
    }
  };

  const handleSelectSkill = (skillName: string) => {
    if (!currentSkills.includes(skillName)) {
      setCurrentSkills(prev => [...prev, skillName]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setCurrentSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  // Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setProfilePictureFile(file);
      setImageUploadError(null);
      setImageUploadSuccess(null);

      // Create preview URL
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  // File Input Change Handler (for clicking to browse)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      setImageUploadError(null);
      setImageUploadSuccess(null);

      // Create preview URL
      setProfilePicturePreview(URL.createObjectURL(file));
    } else {
      setProfilePictureFile(null);
      // Revert preview to existing URL if file is cleared
      if (member?.profile_picture_url) {
        setProfilePicturePreview(`http://localhost:5000${member.profile_picture_url}`);
      } else {
        setProfilePicturePreview(null);
      }
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePictureFile) {
      setImageUploadError("Please select an image to upload.");
      return;
    }

    setUploadingImage(true);
    setImageUploadError(null);
    setImageUploadSuccess(null);

    try {
      const token = Cookies.get('token');
      if (!token) {
        setImageUploadError("Authentication token missing. Please log in.");
        setUploadingImage(false);
        return;
      }

      const formData = new FormData();
      formData.append('profile_picture', profilePictureFile);

      const response = await fetch(`http://localhost:5000/api/users/${userId}/profile-picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setImageUploadSuccess("Profile picture uploaded successfully!");
      setMember(prev => prev ? { ...prev, profile_picture_url: result.profile_picture_url } : null);
      setFormData(prev => prev ? { ...prev, profile_picture_url: result.profile_picture_url } : null);
      setProfilePictureFile(null); // Clear the selected file
      setProfilePicturePreview(`http://localhost:5000${result.profile_picture_url}`); // Update preview to new uploaded image

      if (fileInputRef.current) { // Reset file input to clear selected file appearance
          fileInputRef.current.value = "";
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => setImageUploadSuccess(null), 3000);

    } catch (err: any) {
      setImageUploadError(err.message || "Failed to upload profile picture.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null); // Clear previous success
    setIsSaving(true);

    if (!formData) {
        setFormError("No data to save.");
        setIsSaving(false);
        return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) {
        setFormError("Authentication token missing. Please log in.");
        setIsSaving(false);
        return;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const updatePayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        position: formData.position,
        bio: formData.bio,
        // The profile_picture_url is updated by the separate upload function
        // We ensure the skills array is sent correctly
        skills: currentSkills,
      };

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedMember: MemberDetail = await response.json();
      setMember(updatedMember);
      setFormData(updatedMember);
      setCurrentSkills(updatedMember.skills || []);

      setFormSuccess("Profile updated successfully!"); // Set success message

      // Redirect to the view profile page after a short delay to show success
      setTimeout(() => {
        router.push(`/profile/${userId}`);
      }, 1500); // Show success for 1.5 seconds

    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred during profile update.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-8 w-64 bg-white/10 mb-2" />
              <Skeleton className="h-4 w-96 bg-white/10" />
            </div>

            {/* Profile Picture Section Skeleton */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-6">
                  <Skeleton className="h-40 w-40 rounded-full bg-white/10" />
                  <Skeleton className="h-12 w-48 bg-white/10 rounded-xl" />
                </div>
              </CardContent>
            </Card>

            {/* Form Skeleton */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-20 bg-white/10 rounded-xl" />
                  <Skeleton className="h-20 bg-white/10 rounded-xl" />
                </div>
                <Skeleton className="h-20 bg-white/10 rounded-xl" />
                <Skeleton className="h-20 bg-white/10 rounded-xl" />
                <Skeleton className="h-32 bg-white/10 rounded-xl" />
                <Skeleton className="h-24 bg-white/10 rounded-xl" />
              </CardContent>
            </Card>
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
          <AlertTitle className="text-red-100">Error Loading Profile</AlertTitle>
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!member || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center p-4">
        <Alert variant="default" className="bg-blue-900/20 border-blue-500/30 text-blue-200 w-full max-w-md backdrop-blur-xl">
          <AlertTriangle className="h-4 w-4 text-blue-300" />
          <AlertTitle className="text-blue-100">Not Found</AlertTitle>
          <AlertDescription className="text-blue-200">
            The member with ID "{userId}" could not be found or loaded.
          </AlertDescription>
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
          <div className="mb-8">
            <Button
              onClick={() => router.push(`/profile/${userId}`)}
              variant="ghost"
              className="mb-4 text-blue-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Edit Profile
              </h1>
            </div>
            <p className="text-slate-400 text-lg">
              Update your personal information and showcase your skills
            </p>
          </div>

          {/* Error Alert for Main Form */}
          {formError && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-200 mb-6 backdrop-blur-xl animate-in slide-in-from-top duration-300">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              <AlertTitle className="text-red-100">Update Error</AlertTitle>
              <AlertDescription className="text-red-200">{formError}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert for Main Form */}
          {formSuccess && (
            <Alert className="bg-green-900/20 border-green-500/30 text-green-200 mb-6 backdrop-blur-xl animate-in slide-in-from-top duration-300">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <AlertTitle className="text-green-100">Success</AlertTitle>
              <AlertDescription className="text-green-200">{formSuccess}</AlertDescription>
            </Alert>
          )}

          {/* Profile Picture Section */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 mb-8 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                  <Camera className="h-5 w-5" />
                </div>
                Profile Picture
              </CardTitle>
              <CardDescription className="text-slate-400">
                Upload a new profile picture to personalize your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6">
                {/* Profile Picture Display with Preview */}
                <div className="relative group/avatar">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-75 group-hover/avatar:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl transform group-hover/avatar:scale-105 transition-transform duration-300">
                    {profilePicturePreview ? ( // Use profilePicturePreview for display
                      <Image
                        src={profilePicturePreview}
                        alt={`${formData.first_name} ${formData.last_name}'s profile picture`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
                        {formData.first_name[0]}{formData.last_name[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* File Upload Area */}
                <div
                  className={`relative w-full max-w-md p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                    dragActive 
                      ? 'border-purple-400 bg-purple-500/10' 
                      : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    id="profile_picture_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    ref={fileInputRef} // Assign ref here
                  />
                  
                  <div className="text-center">
                    <UploadCloud className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300 mb-2">
                      {profilePictureFile ? profilePictureFile.name : 'Drag and drop your image here'}
                    </p>
                    <p className="text-slate-500 text-sm">or click to browse</p>
                  </div>
                </div>

                {/* Upload Button */}
                <Button
                  onClick={handleProfilePictureUpload}
                  disabled={!profilePictureFile || uploadingImage}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-5 w-5 mr-2" />
                      Upload Picture
                    </>
                  )}
                </Button>

                {/* Upload Status Messages */}
                {imageUploadError && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-200 backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
                    <AlertTriangle className="h-4 w-4 text-red-300" />
                    <AlertTitle className="text-red-100">Upload Failed</AlertTitle>
                    <AlertDescription className="text-red-200">{imageUploadError}</AlertDescription>
                  </Alert>
                )}

                {imageUploadSuccess && (
                  <Alert className="bg-green-900/20 border-green-500/30 text-green-200 backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
                    <Sparkles className="h-4 w-4 text-green-300" />
                    <AlertTitle className="text-green-100">Upload Success</AlertTitle>
                    <AlertDescription className="text-green-200">{imageUploadSuccess}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Form */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription className="text-slate-400">
                Update your basic profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="first_name" className="text-slate-300 flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-blue-400" />
                      First Name
                    </Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 rounded-xl h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="last_name" className="text-slate-300 flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-blue-400" />
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 rounded-xl h-12"
                      required
                    />
                  </div>
                </div>

                {/* Position Field */}
                <div className="space-y-3">
                  <Label htmlFor="position" className="text-slate-300 flex items-center gap-2 font-medium">
                    <Briefcase className="h-4 w-4 text-purple-400" />
                    Position / Title
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-xl h-12"
                    required
                  />
                </div>

                {/* Bio Field */}
                <div className="space-y-3">
                  <Label htmlFor="bio" className="text-slate-300 flex items-center gap-2 font-medium">
                    <FileText className="h-4 w-4 text-orange-400" />
                    Biography
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 rounded-xl min-h-[120px] resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <Label className="text-slate-300 flex items-center gap-2 font-medium">
                    <Code2 className="h-4 w-4 text-cyan-400" />
                    Skills & Expertise
                  </Label>

                  <div className="flex flex-col md:flex-row gap-2">
                    <Select onValueChange={handleSelectSkill}>
                      <SelectTrigger className="w-full md:w-[200px] bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 rounded-xl py-6">
                        <SelectValue placeholder="Select a skill" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {availableSkills.map((skill) => (
                          <SelectItem key={skill.skill_id} value={skill.skill_name}>
                            {skill.skill_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 rounded-xl py-4 md:py-6"
                      placeholder="Or type a new skill and press Enter..."
                    />
                  </div>
                  
                  {currentSkills.length > 0 && (
                    <div className="flex flex-wrap gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      {currentSkills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 px-4 py-2 rounded-full flex items-center gap-2 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 group"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-cyan-400 hover:text-white transition-colors duration-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/profile/${userId}`)}
                    disabled={isSaving}
                    className="flex-1 border-white/20 text-slate-300 hover:bg-white/10 hover:text-white bg-transparent rounded-xl h-12 font-medium transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 rounded-xl h-12 font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
