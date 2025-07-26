"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../components/ui/badge"
import { Github, Linkedin, Mail, Code, Database, Smartphone, Globe, Users, Award, Zap, LucideIcon, Sparkles, Briefcase, Calendar, ExternalLink, Code2 } from "lucide-react" // Added missing icons
import Link from "next/link"

// Type definitions
interface Stat {
  value: string
  label: string
}

interface Service {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

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
  // Frontend specific fields for display
  title: string; // Mapped from project_name
  category: string; // Derived or default
  gradient: string; // Derived or default
  categoryColor: string; // Derived or default
  technologies: string[]; // Mapped from skills
  image: string; // Mapped from first image URL
}

interface TeamMember {
  name: string
  role: string
  image: string
}

interface TechStack {
  name: string
  color: string
}

interface LogoProps {
  className?: string
}

interface ServiceCardProps {
  service: Service
}

interface ProjectCardProps {
  project: Project
}

interface TeamMemberCardProps {
  member: TeamMember
}

// Data constants
const STATS: Stat[] = [
  { value: "50+", label: "Projects Completed" },
  { value: "25+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "24/7", label: "Support" }
]

const SERVICES: Service[] = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Modern, responsive websites and web applications built with cutting-edge technologies",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Zap,
    title: "AI Solutions",
    description: "Intelligent automation and AI-powered applications to streamline your business processes",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications for iOS and Android",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Database,
    title: "Database Solutions",
    description: "Scalable database architecture and data management solutions",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Users,
    title: "Consulting",
    description: "Strategic technology consulting to help you make informed decisions",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Comprehensive testing and quality assurance for all our deliverables",
    gradient: "from-yellow-500 to-orange-500"
  }
]


const TEAM_MEMBERS: TeamMember[] = [
  { name: "Alex Miller", role: "Lead Developer", image: "/placeholder.svg?height=300&width=300" },
  { name: "Sarah Chen", role: "UI/UX Designer", image: "/placeholder.svg?height=300&width=300" },
  { name: "Mike Johnson", role: "AI Specialist", image: "/placeholder.svg?height=300&width=300" }
]

const TECH_STACK: TechStack[] = [
  { name: "React", color: "bg-purple-500/20 text-purple-300" },
  { name: "Next.js", color: "bg-blue-500/20 text-blue-300" },
  { name: "Node.js", color: "bg-green-500/20 text-green-300" },
  { name: "Python", color: "bg-yellow-500/20 text-yellow-300" },
  { name: "AI/ML", color: "bg-red-500/20 text-red-300" },
  { name: "Cloud", color: "bg-indigo-500/20 text-indigo-300" }
]

const FEATURED_PROJECT_TECHNOLOGIES: string[] = ["React", "Node.js", "Python", "TensorFlow"]

const SOCIAL_ICONS: LucideIcon[] = [Github, Linkedin, Mail]

const NAV_ITEMS: string[] = ["About", "Services", "Projects", "Team", "Contact"]

// Components
const Logo: React.FC<LogoProps> = ({ className = "" }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"> {/* Adjusted gradient */}
      <Code className="w-5 h-5 text-white" />
    </div>
    <span className="text-2xl font-bold text-white">MillerBit</span>
  </div>
)

const Navigation: React.FC = () => (
  <nav className="flex items-center justify-between">
    <Logo />
    <div className="hidden md:flex space-x-8">
      {NAV_ITEMS.map((item: string) => (
        <Link
          key={item}
          href={`#${item.toLowerCase()}`}
          className="text-slate-300 hover:text-white transition-colors" // Adjusted text color
        >
          {item}
        </Link>
      ))}
    </div>
  </nav>
)

const HeroSection: React.FC = () => (
  <section className="container mx-auto px-4 py-20 text-center">
    <div className="max-w-4xl mx-auto">
      <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 animate-pulse"> {/* Adjusted badge style */}
        Innovation • Technology • Excellence
      </Badge>
      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in"> {/* Adjusted text gradient */}
        Building the Future of Technology
      </h1>
      <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto font-light"> {/* Adjusted text color */}
        MillerBit is a cutting-edge technology team specializing in AI solutions, web development, and innovative
        digital experiences that transform businesses.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3" // Adjusted button gradient
        >
          Get Started
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/10 text-white hover:bg-white/10 px-8 py-3 bg-transparent" // Adjusted border and hover
        >
          View Our Work
        </Button>
      </div>
    </div>
  </section>
)

const StatsSection: React.FC = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {STATS.map((stat: Stat, index: number) => (
        <div key={index}>
          <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
          <div className="text-slate-400">{stat.label}</div> {/* Adjusted text color */}
        </div>
      ))}
    </div>
  </section>
)

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const IconComponent = service.icon
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden"> {/* Adjusted card style */}
      <CardHeader>
        <div className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-lg flex items-center justify-center mb-4`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-white">{service.title}</CardTitle>
        <CardDescription className="text-slate-400"> {/* Adjusted text color */}
          {service.description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

const ServicesSection: React.FC = () => (
  <section id="services" className="container mx-auto px-4 py-20">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
      <p className="text-slate-300 max-w-2xl mx-auto"> {/* Adjusted text color */}
        We offer comprehensive technology solutions tailored to meet your business needs
      </p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {SERVICES.map((service: Service, index: number) => (
        <ServiceCard key={index} service={service} />
      ))}
    </div>
  </section>
)

const FeaturedProject: React.FC = () => (
  <div className="lg:col-span-2">
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden"> {/* Adjusted card style */}
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="h-64 md:h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="BitAI Platform"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
        <div className="md:w-1/2 p-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 animate-pulse">Featured Project</Badge> {/* Adjusted badge style */}
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              AI Platform
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">BitAI - Intelligent Automation Platform</h3>
          <p className="text-slate-300 mb-6"> {/* Adjusted text color */}
            A comprehensive AI-powered platform that helps businesses automate complex tasks and streamline
            operations. Features include natural language processing, predictive analytics, and seamless
            integration capabilities.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {FEATURED_PROJECT_TECHNOLOGIES.map((tech: string) => (
              <Badge key={tech} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105 cursor-default"> {/* Adjusted badge style */}
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white hover:bg-white/10 bg-transparent" // Adjusted border and hover
            >
              <Globe className="w-4 h-4 mr-2" />
              Live Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white hover:bg-white/10 bg-transparent" // Adjusted border and hover
            >
              <Github className="w-4 h-4 mr-2" />
              View Code
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
)

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 group rounded-2xl overflow-hidden"> {/* Adjusted card style */}
    <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}>
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <CardHeader>
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className={project.categoryColor}>
          {project.category}
        </Badge>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white"> {/* Adjusted text color */}
            <Globe className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white"> {/* Adjusted text color */}
            <Github className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CardTitle className="text-white text-lg">{project.title}</CardTitle>
      <CardDescription className="text-slate-400"> {/* Adjusted text color */}
        {project.description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-1">
        {project.technologies.map((tech: string) => (
          <Badge key={tech} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 text-xs"> {/* Adjusted badge style */}
            {tech}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
)

const ProjectsSection: React.FC<{ projects: Project[]; loading: boolean; error: string | null }> = ({ projects, loading, error }) => (
  <section id="projects" className="container mx-auto px-4 py-20">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white mb-4">Our Recent Projects</h2>
      <p className="text-slate-300 max-w-2xl mx-auto"> {/* Adjusted text color */}
        Explore some of our latest work and see how we've helped businesses transform their digital presence
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-12 mb-16">
      <FeaturedProject />
    </div>

    {loading && <p className="text-center text-slate-300">Loading projects...</p>} {/* Adjusted text color */}
    {error && <p className="text-center text-red-400">Error loading projects: {error}</p>} {/* Adjusted text color */}
    {!loading && !error && projects.length === 0 && (
      <p className="text-center text-slate-300">No projects found.</p>
    )}

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {!loading && !error && projects.map((project: Project) => (
        <ProjectCard key={project.project_id} project={project} />
      ))}
    </div>

    <div className="text-center mt-12">
      <Button
        size="lg"
        variant="outline"
        className="border-white/10 text-white hover:bg-white/10 px-8 py-3 bg-transparent" // Adjusted border and hover
      >
        View All Projects
        <ExternalLink className="w-5 h-5 ml-2" /> {/* Changed icon to ExternalLink */}
      </Button>
    </div>
  </section>
)

const AboutSection: React.FC = () => (
  <section id="about" className="container mx-auto px-4 py-20">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-4xl font-bold text-white mb-6">About MillerBit</h2>
        <p className="text-slate-300 mb-6 text-lg"> {/* Adjusted text color */}
          We are a passionate team of developers, designers, and technology enthusiasts dedicated to creating
          innovative solutions that drive business growth and digital transformation.
        </p>
        <p className="text-slate-300 mb-8"> {/* Adjusted text color */}
          Our expertise spans across multiple technologies and industries, allowing us to deliver comprehensive
          solutions that meet the unique needs of each client.
        </p>
        <div className="flex flex-wrap gap-3">
          {TECH_STACK.map((tech: TechStack) => (
            <Badge key={tech.name} className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-full hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 transform hover:scale-105 cursor-default"> {/* Adjusted badge style */}
              {tech.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="w-full h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/10"> {/* Added border */}
          <Code2 className="w-24 h-24 text-blue-400" /> {/* Changed icon to Code2, adjusted color */}
        </div>
      </div>
    </div>
  </section>
)

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => (
  <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-500 rounded-2xl overflow-hidden text-center"> {/* Adjusted card style */}
    <CardHeader>
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"> {/* Adjusted gradient */}
        <Users className="w-12 h-12 text-white" />
      </div>
      <CardTitle className="text-white">{member.name}</CardTitle>
      <CardDescription className="text-slate-400">{member.role}</CardDescription> {/* Adjusted text color */}
    </CardHeader>
    <CardContent>
      <div className="flex justify-center space-x-4">
        {SOCIAL_ICONS.map((Icon: LucideIcon, iconIndex: number) => (
          <Link key={iconIndex} href="#" className="text-slate-400 hover:text-white transition-colors"> {/* Adjusted text color */}
            <Icon className="w-5 h-5" />
          </Link>
        ))}
      </div>
    </CardContent>
  </Card>
)

const TeamSection: React.FC = () => (
  <section id="team" className="container mx-auto px-4 py-20">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
      <p className="text-slate-300 max-w-2xl mx-auto"> {/* Adjusted text color */}
        Talented individuals working together to create exceptional digital experiences
      </p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {TEAM_MEMBERS.map((member: TeamMember, index: number) => (
        <TeamMemberCard key={index} member={member} />
      ))}
    </div>
  </section>
)

const ContactSection: React.FC = () => (
  <section id="contact" className="container mx-auto px-4 py-20">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-white mb-6">Get In Touch</h2>
      <p className="text-slate-300 mb-8"> {/* Adjusted text color */}
        Ready to start your next project? Let's discuss how we can help bring your ideas to life.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3" // Adjusted button gradient
        >
          <Mail className="w-5 h-5 mr-2" />
          Contact Us
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/10 text-white hover:bg-white/10 px-8 py-3 bg-transparent" // Adjusted border and hover
        >
          <Github className="w-5 h-5 mr-2" />
          View GitHub
        </Button>
      </div>
    </div>
  </section>
)

const Footer: React.FC = () => (
  <footer className="border-t border-white/10 py-12"> {/* Adjusted border color */}
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <Logo className="mb-4 md:mb-0" />
        <p className="text-slate-400 text-center md:text-right">© 2024 MillerBit Team. All rights reserved.</p> {/* Adjusted text color */}
      </div>
    </div>
  </footer>
)

// Main Component
const MillerBitLanding: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects/portfolio'); // Use the backend URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Map backend data to frontend Project interface
        const mappedProjects: Project[] = data.map((p: any) => ({
          project_id: p.project_id,
          project_name: p.project_name,
          description: p.description,
          status: p.status,
          created_at: p.created_at,
          updated_at: p.updated_at,
          created_by: p.created_by,
          skills: p.skills,
          images: p.images,
          videos: p.videos,
          links: p.links,
          // Frontend specific fields
          title: p.project_name,
          category: p.skills.length > 0 ? p.skills[0] : "General", // Use first skill as category or default
          gradient: "from-blue-500/20 to-purple-500/20", // Default gradient
          categoryColor: "border-blue-500/30 text-blue-300", // Default color
          technologies: p.skills,
          image: p.images.length > 0 ? p.images[0] : "/placeholder.svg?height=300&width=400", // Use first image or placeholder
        }));
        setProjects(mappedProjects);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background Elements (Copied from MemberProfilePage) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <header className="container mx-auto px-4 py-6 relative z-10"> {/* Added relative z-10 */}
        <Navigation />
      </header>

      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection projects={projects} loading={loading} error={error} />
      <AboutSection />
      <TeamSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default MillerBitLanding;