"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Users,
  Code2,
  Image as ImageIcon,
  Link,
  Video,
  Plus,
  X,
  Sparkles,
  Rocket,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Search,
  User,
  Award,
  Loader2,
} from 'lucide-react';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
}

interface Skill {
  skill_name: string;
}

interface MediaItem {
  media_type: string;
  url: string;
  description?: string;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const MAX_MEDIA_ITEMS = 10; // Added limit for media items

// Step 1: Project Details
const ProjectDetailsStep: React.FC<{
  projectName: string;
  setProjectName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  nextStep: () => void;
}> = ({ projectName, setProjectName, description, setDescription, nextStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Project Details
          </h2>
        </motion.div>
        <p className="text-slate-400 text-lg">Tell us about your amazing project</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <Label htmlFor="projectName" className="text-slate-300 font-medium">Project Name</Label>
          <Input
            id="projectName"
            placeholder="e.g., AI-powered Chatbot"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 rounded-xl h-12 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="description" className="text-slate-300 font-medium">Project Description</Label>
          <Textarea
            id="description"
            placeholder="A brief overview of your project, its goals, and key features."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="flex justify-end pt-6"
      >
        <Button
          type="button"
          onClick={nextStep}
          disabled={!projectName.trim() || !description.trim()}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg group"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

// Step 2: Project Picture
const ProjectPictureStep: React.FC<{
  projectPicture: File | null;
  setProjectPicture: (file: File | null) => void;
  projectPictureUrl: string | null;
  setProjectPictureUrl: (url: string | null) => void;
  handleProjectPictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
}> = ({
  projectPicture,
  setProjectPicture,
  projectPictureUrl,
  setProjectPictureUrl,
  handleProjectPictureChange,
  nextStep,
  prevStep,
}) => {
  const handleRemovePicture = () => {
    setProjectPicture(null);
    setProjectPictureUrl(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
            <ImageIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            Project Picture
          </h2>
        </motion.div>
        <p className="text-slate-400 text-lg">Add a captivating image for your project</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center space-y-6"
      >
        <Label htmlFor="projectPicture" className="cursor-pointer block">
          <div className="w-full h-64 border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-orange-400 hover:text-orange-300 transition-all duration-300 relative overflow-hidden group">
            {projectPictureUrl ? (
              <>
                <Image
                  src={projectPictureUrl}
                  alt="Project Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  width={500}
                  height={500}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg font-semibold">Change Picture</p>
                </div>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 mb-3" />
                <p className="text-lg font-medium">Upload Project Picture</p>
                <p className="text-sm">Drag & drop or click to browse</p>
                <p className="text-xs text-slate-500 mt-1">(Max 5MB, JPG, PNG, GIF)</p>
              </>
            )}
          </div>
        </Label>
        <Input
          id="projectPicture"
          type="file"
          accept="image/*"
          onChange={handleProjectPictureChange}
          className="hidden"
        />
        {projectPicture && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between bg-white/10 border border-white/20 rounded-xl p-4 mt-4"
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-orange-400" />
              <span className="text-white text-sm font-medium">{projectPicture.name}</span>
            </div>
            <Button
              type="button"
              onClick={handleRemovePicture}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="flex justify-between pt-6"
      >
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg group backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg group"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Step 3: Team & Skills (Fixed for Accessibility)
const TeamSkillsStep: React.FC<{
  allUsers: User[];
  selectedParticipants: string[];
  setSelectedParticipants: (ids: string[]) => void;
  allSkills: Skill[];
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
}> = ({
  allUsers,
  selectedParticipants,
  setSelectedParticipants,
  allSkills,
  selectedSkills,
  setSelectedSkills,
  nextStep,
  prevStep,
}) => {
  const [userSearch, setUserSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');

  const filteredUsers = allUsers.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredSkills = allSkills.filter(skill =>
    skill.skill_name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header remains unchanged */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
            Build Your Team
          </h2>
        </motion.div>
        <p className="text-slate-400 text-lg">Select team members and required skills</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Team Members Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="h-6 w-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Team Members</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search team members..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pl-10 rounded-xl h-12 backdrop-blur-sm"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 h-80 overflow-y-auto backdrop-blur-sm custom-scrollbar">
            <div className="space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.user_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                      selectedParticipants.includes(user.user_id)
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <Checkbox
                      id={`user-${user.user_id}`}
                      checked={selectedParticipants.includes(user.user_id)}
                      onCheckedChange={(checked) => {
                        const newSelection = checked
                          ? [...selectedParticipants, user.user_id]
                          : selectedParticipants.filter((id) => id !== user.user_id);
                        setSelectedParticipants(newSelection);
                      }}
                      className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-white/30 mr-3"
                    />
                    <Label
                      htmlFor={`user-${user.user_id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="text-white font-medium hover:text-green-300 transition-colors duration-200">
                        {user.first_name} {user.last_name}
                      </p>
                    </Label>
                    {selectedParticipants.includes(user.user_id) && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500">No team members found</p>
                </div>
              )}
            </div>
          </div>

          {selectedParticipants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
            >
              <p className="text-green-300 font-medium">
                {selectedParticipants.length} member{selectedParticipants.length !== 1 ? 's' : ''} selected
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-6 w-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Required Skills</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search skills..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pl-10 rounded-xl h-12 backdrop-blur-sm"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 h-80 overflow-y-auto backdrop-blur-sm custom-scrollbar">
            <div className="space-y-2">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill.skill_name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                      selectedSkills.includes(skill.skill_name)
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <Checkbox
                      id={`skill-${skill.skill_name}`}
                      checked={selectedSkills.includes(skill.skill_name)}
                      onCheckedChange={(checked) => {
                        const newSelection = checked
                          ? [...selectedSkills, skill.skill_name]
                          : selectedSkills.filter((s) => s !== skill.skill_name);
                        setSelectedSkills(newSelection);
                      }}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-white/30 mr-3"
                    />
                    <Label
                      htmlFor={`skill-${skill.skill_name}`}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="text-white font-medium hover:text-blue-300 transition-colors duration-200">
                        {skill.skill_name}
                      </p>
                    </Label>
                    {selectedSkills.includes(skill.skill_name) && (
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Code2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500">No skills found</p>
                </div>
              )}
            </div>
          </div>

          {selectedSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl"
            >
              <p className="text-blue-300 font-medium">
                {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="flex justify-between pt-6"
      >
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg group backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg group"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Step 3: Project Media (Fixed with URL Validation and Limit)
const MediaStep: React.FC<{
  media: MediaItem[];
  setMedia: (media: MediaItem[]) => void;
  newMediaUrl: string;
  setNewMediaUrl: (url: string) => void;
  newMediaType: string;
  setNewMediaType: (type: string) => void;
  newMediaDescription: string;
  setNewMediaDescription: (desc: string) => void;
  handleAddMedia: () => void;
  handleRemoveMedia: (index: number) => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}> = ({
  media,
  newMediaUrl,
  setNewMediaUrl,
  newMediaType,
  setNewMediaType,
  newMediaDescription,
  setNewMediaDescription,
  handleAddMedia,
  handleRemoveMedia,
  prevStep,
  handleSubmit,
  isSubmitting,
}) => {
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'link': return <Link className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getMediaColor = (type: string) => {
    switch (type) {
      case 'image': return 'from-pink-500 to-rose-500';
      case 'video': return 'from-red-500 to-orange-500';
      case 'link': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header and Existing Media sections remain unchanged */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
            <ImageIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Project Media
          </h2>
        </motion.div>
        <p className="text-slate-400 text-lg">Showcase your project with images, videos, and links (max {MAX_MEDIA_ITEMS})</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-white flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-purple-400" />
          Media Gallery
          <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
        </h3>

        {media.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {media.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`p-3 bg-gradient-to-r ${getMediaColor(item.media_type)} rounded-xl`}>
                      {getMediaIcon(item.media_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-300 capitalize mb-1">
                        {item.media_type}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 block truncate"
                      >
                        {item.url}
                      </a>
                      {item.description && (
                        <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100 rounded-xl p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 border-dashed"
          >
            <ImageIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No media added yet</p>
            <p className="text-slate-600 text-sm">Add images, videos, or links to showcase your project</p>
          </motion.div>
        )}
      </motion.div>

      {/* Add New Media */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
          <Plus className="h-6 w-6 text-green-400" />
          Add New Media
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <Label className="text-slate-300 font-medium">Media Type</Label>
            <Select value={newMediaType} onValueChange={setNewMediaType}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-purple-400/20 rounded-xl h-12 backdrop-blur-sm">
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white backdrop-blur-xl">
                <SelectItem value="image" className="hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-pink-400" />
                    Image
                  </div>
                </SelectItem>
                <SelectItem value="video" className="hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-red-400" />
                    Video
                  </div>
                </SelectItem>
                <SelectItem value="link" className="hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-blue-400" />
                    Link
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-300 font-medium">Media URL</Label>
            <Input
              type="url"
              placeholder="https://example.com/media"
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-xl h-12 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <Label className="text-slate-300 font-medium">Description (Optional)</Label>
          <Input
            type="text"
            placeholder="Brief description of the media..."
            value={newMediaDescription}
            onChange={(e) => setNewMediaDescription(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-xl h-12 backdrop-blur-sm"
          />
        </div>

        <Button
          type="button"
          onClick={handleAddMedia}
          disabled={!newMediaUrl.trim()}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
        >
          <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
          Add Media
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="flex justify-between pt-6"
      >
        <Button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          variant="outline"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg group backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Create Project
              <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

// Main CreateProjectForm Component (Fixed with Improved Error Handling)
const CreateProjectForm = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [projectPicture, setProjectPicture] = useState<File | null>(null);
  const [projectPictureUrl, setProjectPictureUrl] = useState<string | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState('image');
  const [newMediaDescription, setNewMediaDescription] = useState('');

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingUsersSkills, setLoadingUsersSkills] = useState(true);
  const [errorUsersSkills, setErrorUsersSkills] = useState<string | null>(null);

  const fetchUsersAndSkills = useCallback(async () => {
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
      setAllUsers(usersData);

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

    } catch (error: unknown) {
      console.error("Error fetching users or skills:", error);
      setErrorUsersSkills((error as Error).message || "Failed to load users or skills.");
      toast.error(`Failed to load users or skills: ${(error as Error).message}`);
    } finally {
      setLoadingUsersSkills(false);
    }
  }, []);

  useEffect(() => {
    if (currentStep === 3) {
      fetchUsersAndSkills();
    }
  }, [currentStep, fetchUsersAndSkills]);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error("Only image files are allowed for project picture.");
        setProjectPicture(null);
        setProjectPictureUrl(null);
        return;
      }
      setProjectPicture(file);
      setProjectPictureUrl(URL.createObjectURL(file));
    } else {
      setProjectPicture(null);
      setProjectPictureUrl(null);
    }
  };

  const handleAddMedia = () => {
    const url = newMediaUrl.trim();
    if (!url) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL (e.g., https://example.com).");
      return;
    }

    if (media.length >= MAX_MEDIA_ITEMS) {
      toast.error(`You can only add up to ${MAX_MEDIA_ITEMS} media items.`);
      return;
    }

    setMedia((prev) => [
      ...prev,
      {
        media_type: newMediaType,
        url,
        description: newMediaDescription.trim() || undefined,
      },
    ]);
    setNewMediaUrl('');
    setNewMediaDescription('');
    setNewMediaType('image');
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit triggered.");
    setIsSubmitting(true);
    const token = Cookies.get('token');
    console.log("Authentication token:", token ? "Found" : "Not found");

    if (!token) {
      toast.error("You are not logged in. Please log in to create a project.");
      setIsSubmitting(false);
      router.push('/login');
      return;
    }

    const formData = new FormData();
    formData.append('project_name', projectName);
    formData.append('description', description);
    formData.append('participants', JSON.stringify(selectedParticipants));
    formData.append('skills', JSON.stringify(selectedSkills));
    formData.append('media', JSON.stringify(media));

    if (projectPicture) {
      formData.append('project_picture', projectPicture);
    }

    console.log("FormData to be sent:", formData);

    try {
      console.log("Attempting to create project...");
      const response = await fetch(`${backendUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' is automatically set by browser when using FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Project creation failed:", errorData);
        throw new Error(errorData.message || `Failed to create project: ${response.statusText}`);
      }

      const result = await response.json();
      const projectId = result.projectId;
      console.log("Project created with ID:", projectId);
      toast.success("Your new project has been successfully created.");

    } catch (error: unknown) {
      console.error('Error creating project:', error);
      console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      toast.error((error as Error).message || "There was an error creating your project. Please try again.");
    } finally {
      setIsSubmitting(false); // Ensure isSubmitting is set to false in all cases
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectDetailsStep
            projectName={projectName}
            setProjectName={setProjectName}
            description={description}
            setDescription={setDescription}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <ProjectPictureStep
            projectPicture={projectPicture}
            setProjectPicture={setProjectPicture}
            projectPictureUrl={projectPictureUrl}
            setProjectPictureUrl={setProjectPictureUrl}
            handleProjectPictureChange={handleProjectPictureChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        if (loadingUsersSkills) {
          return (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="ml-3 text-white text-lg">Loading users and skills...</p>
            </div>
          );
        }
        if (errorUsersSkills) {
          return (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">Error: {errorUsersSkills}</p>
              <Button onClick={fetchUsersAndSkills} className="bg-blue-500 hover:bg-blue-600 text-white">
                Retry Loading
              </Button>
            </div>
          );
        }
        return (
          <TeamSkillsStep
            allUsers={allUsers}
            selectedParticipants={selectedParticipants}
            setSelectedParticipants={setSelectedParticipants}
            allSkills={allSkills}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <MediaStep
            media={media}
            setMedia={setMedia}
            newMediaUrl={newMediaUrl}
            setNewMediaUrl={setNewMediaUrl}
            newMediaType={newMediaType}
            setNewMediaType={setNewMediaType}
            newMediaDescription={newMediaDescription}
            setNewMediaDescription={setNewMediaDescription}
            handleAddMedia={handleAddMedia}
            handleRemoveMedia={handleRemoveMedia}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-black p-4 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-4xl bg-gradient-to-br from-slate-800/80 to-zinc-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 border border-white/10"
      >
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
          {[1, 2, 3, 4].map((step) => (
            <motion.div
              key={step}
              className={`flex items-center space-x-2 text-sm font-medium ${
                currentStep >= step ? 'text-white' : 'text-slate-500'
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  currentStep > step
                    ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white'
                    : currentStep === step
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/10 text-slate-400 border border-white/20'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * step }}
              >
                {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
              </motion.div>
              <span className="hidden sm:inline-block">
                {step === 1 && "Details"}
                {step === 2 && "Picture"}
                {step === 3 && "Team & Skills"}
                {step === 4 && "Media"}
              </span>
              {step < 4 && (
                <div className={`w-10 h-px transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-slate-700'
                }`}></div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// [ProjectPictureStep remains unchanged]

export default CreateProjectForm;
