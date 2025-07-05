
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Users, DollarSign, Calendar, Share2, MessageCircle } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import Logo from "@/components/Logo";

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  totalRaised: number;
  backers: number;
  status: string;
  creator: string;
  image: string;
  slug: string;
  fullDescription?: string;
  updates?: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
  }>;
  backersList?: Array<{
    id: string;
    name: string;
    amount: number;
    date: string;
    message?: string;
  }>;
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);

  // Mock project data - in a real app, this would come from an API
  const mockProjects: Project[] = [
    {
      id: "1",
      name: "Clean Water Initiative",
      description: "Bringing clean water to communities in developing regions through sustainable infrastructure projects.",
      fullDescription: "Our Clean Water Initiative is dedicated to providing sustainable water solutions to underserved communities across developing regions. We partner with local organizations to build wells, install water purification systems, and educate communities on water conservation practices. Every contribution directly funds equipment, training, and ongoing maintenance to ensure long-term impact.",
      category: "Environment",
      totalRaised: 2450.75,
      backers: 23,
      status: "approved",
      creator: "WaterForAll",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
      slug: "clean-water-initiative",
      updates: [
        {
          id: "1",
          title: "First Well Completed!",
          content: "We're excited to announce that our first well has been completed in Rural Village A. The community now has access to clean water for the first time in decades!",
          date: "2024-01-15"
        },
        {
          id: "2",
          title: "Community Training Program Launched",
          content: "We've started training local community members on well maintenance and water conservation practices to ensure long-term sustainability.",
          date: "2024-01-10"
        }
      ],
      backersList: [
        { id: "1", name: "Alice Chen", amount: 500, date: "2024-01-20", message: "Amazing work! Keep it up!" },
        { id: "2", name: "Bob Smith", amount: 250, date: "2024-01-19", message: "Proud to support this cause." },
        { id: "3", name: "Carol Davis", amount: 100, date: "2024-01-18" },
        { id: "4", name: "David Wilson", amount: 75, date: "2024-01-17", message: "Every drop counts!" }
      ]
    },
    {
      id: "2",
      name: "Education for All",
      description: "Supporting education in underserved areas by funding schools, books, and teacher training programs.",
      fullDescription: "Education for All is committed to breaking the cycle of poverty through education. We build schools, provide learning materials, and train teachers in underserved communities. Our holistic approach ensures that children receive quality education while empowering local educators.",
      category: "Education",
      totalRaised: 1825.30,
      backers: 18,
      status: "approved",
      creator: "EduGlobal",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
      slug: "education-for-all",
      updates: [
        {
          id: "1",
          title: "New School Building Progress",
          content: "Construction of our third school building is 60% complete. We're on track to open by the end of next month!",
          date: "2024-01-12"
        }
      ],
      backersList: [
        { id: "1", name: "Emma Johnson", amount: 300, date: "2024-01-16", message: "Education changes everything!" },
        { id: "2", name: "Frank Miller", amount: 200, date: "2024-01-15" }
      ]
    },
    {
      id: "3",
      name: "Renewable Energy Hub",
      description: "Funding solar panel installations and wind energy projects in rural communities.",
      fullDescription: "Our Renewable Energy Hub project focuses on bringing sustainable energy solutions to rural communities. We install solar panels, small wind turbines, and provide training on renewable energy maintenance. This initiative reduces dependency on fossil fuels while creating local job opportunities.",
      category: "Energy",
      totalRaised: 3200.45,
      backers: 31,
      status: "approved",
      creator: "GreenFuture",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
      slug: "renewable-energy-hub",
      updates: [
        {
          id: "1",
          title: "Solar Panel Installation Complete",
          content: "We've successfully installed 50 solar panels across 10 homes in the community. Families are now enjoying clean, renewable energy!",
          date: "2024-01-18"
        }
      ],
      backersList: [
        { id: "1", name: "Grace Lee", amount: 1000, date: "2024-01-20", message: "The future is renewable!" },
        { id: "2", name: "Henry Brown", amount: 500, date: "2024-01-19" }
      ]
    }
  ];

  useEffect(() => {
    const foundProject = mockProjects.find(p => p.slug === slug);
    setProject(foundProject || null);

    // Update page meta tags for SEO
    if (foundProject) {
      document.title = `${foundProject.name} - FastPool`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', foundProject.description);
      }

      // Update OG tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${foundProject.name} - FastPool`);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', foundProject.description);
      }

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', foundProject.image);
      }
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects">
            <SecondaryButton>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </SecondaryButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-6">
            <Link to="/app" className="text-white hover:text-orange-400 transition-colors">
              App
            </Link>
            <Link to="/projects" className="text-white hover:text-orange-400 transition-colors">
              Projects
            </Link>
            <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link to="/projects" className="inline-flex items-center text-white hover:text-orange-400 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>

          {/* Project Header */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="text-gray-300 border-gray-500 mb-2">
                  {project.category}
                </Badge>
                <h1 className="text-4xl font-bold text-white mb-4">{project.name}</h1>
                <p className="text-gray-300">{project.fullDescription || project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {project.totalRaised.toFixed(2)} STX
                  </div>
                  <div className="text-gray-300 text-sm">Total Raised</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {project.backers}
                  </div>
                  <div className="text-gray-300 text-sm">Backers</div>
                </div>
              </div>

              <div className="flex gap-4">
                <PrimaryButton className="flex-1 bg-pink-500 hover:bg-pink-600">
                  <Heart className="h-4 w-4 mr-2" />
                  Support This Project
                </PrimaryButton>
                <SecondaryButton>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </SecondaryButton>
              </div>

              <div className="text-sm text-gray-400">
                Created by <span className="text-orange-400 font-semibold">{project.creator}</span>
              </div>
            </div>
          </div>

          {/* Project Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Updates Section */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Project Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {project.updates?.map((update) => (
                    <div key={update.id} className="border-b border-white/10 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{update.title}</h3>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(update.date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-300">{update.content}</p>
                    </div>
                  ))}
                  {(!project.updates || project.updates.length === 0) && (
                    <p className="text-gray-400 text-center py-8">No updates yet. Check back soon!</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Backers */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Recent Backers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.backersList?.slice(0, 5).map((backer) => (
                    <div key={backer.id} className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-white">{backer.name}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(backer.date).toLocaleDateString()}
                        </div>
                        {backer.message && (
                          <div className="text-sm text-gray-300 mt-1 italic">
                            "{backer.message}"
                          </div>
                        )}
                      </div>
                      <div className="text-green-400 font-semibold">
                        {backer.amount} STX
                      </div>
                    </div>
                  ))}
                  {(!project.backersList || project.backersList.length === 0) && (
                    <p className="text-gray-400 text-center py-4">Be the first to support this project!</p>
                  )}
                </CardContent>
              </Card>

              {/* Project Stats */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Project Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Contribution</span>
                    <span className="text-white font-semibold">
                      {project.backers > 0 ? (project.totalRaised / project.backers).toFixed(2) : '0'} STX
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Backers</span>
                    <span className="text-white font-semibold">{project.backers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Project Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {project.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
