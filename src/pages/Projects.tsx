
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Heart, Users, DollarSign, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ImageUpload } from "@/components/ui/image-upload";

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Clean Water Initiative",
      description: "Bringing clean water to communities in developing regions through sustainable infrastructure projects.",
      category: "Environment",
      totalRaised: 2450.75,
      backers: 23,
      status: "approved",
      creator: "WaterForAll",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop"
    },
    {
      id: "2",
      name: "Education for All",
      description: "Supporting education in underserved areas by funding schools, books, and teacher training programs.",
      category: "Education",
      totalRaised: 1825.30,
      backers: 18,
      status: "approved",
      creator: "EduGlobal",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop"
    },
    {
      id: "3",
      name: "Renewable Energy Hub",
      description: "Funding solar panel installations and wind energy projects in rural communities.",
      category: "Energy",
      totalRaised: 3200.45,
      backers: 31,
      status: "approved",
      creator: "GreenFuture",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop"
    },
    {
      id: "4",
      name: "Tech Skills Training",
      description: "Providing coding bootcamps and digital literacy programs for unemployed youth.",
      category: "Technology",
      totalRaised: 0,
      backers: 0,
      status: "pending",
      creator: "CodeBridge",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop"
    }
  ]);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    category: "",
    image: null as File | null
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.description || !newProject.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all project details.",
        variant: "destructive",
      });
      return;
    }

    const project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      category: newProject.category,
      totalRaised: 0,
      backers: 0,
      status: "pending" as const,
      creator: "You",
      image: newProject.image ? URL.createObjectURL(newProject.image) : "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop"
    };

    setProjects([...projects, project]);
    setNewProject({ name: "", description: "", category: "", image: null });
    setIsDialogOpen(false);

    toast({
      title: "Project Submitted!",
      description: "Your project has been submitted for admin approval.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending Review</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center text-white hover:text-orange-400 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-2xl font-bold">Stack<span className="text-orange-400">Give</span></span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/app" className="text-white hover:text-orange-400 transition-colors">
              App
            </Link>
            <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
              Dashboard
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <PrimaryButton>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </PrimaryButton>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-category">Category</Label>
                    <Input
                      id="project-category"
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="e.g., Education, Environment, Technology"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Describe your project and its impact"
                      rows={4}
                    />
                  </div>
                  <ImageUpload
                    onImageSelect={(file) => setNewProject({ ...newProject, image: file })}
                  />
                  <PrimaryButton onClick={handleCreateProject} className="w-full">
                    Submit for Approval
                  </PrimaryButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Projects Making a Difference
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col">
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(project.status)}
                  </div>
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                  <Badge variant="outline" className="text-gray-300 border-gray-500 w-fit">
                    {project.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <p className="text-gray-300 text-sm flex-grow">{project.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Raised
                      </span>
                      <span className="text-green-400 font-semibold">
                        {project.totalRaised.toFixed(2)} STX
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Backers
                      </span>
                      <span className="text-blue-400 font-semibold">{project.backers}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Creator</span>
                      <span className="text-orange-400 font-semibold">{project.creator}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    {project.status === "approved" && (
                      <PrimaryButton className="w-full bg-pink-500 hover:bg-pink-600" size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        Support This Project
                      </PrimaryButton>
                    )}

                    {project.status === "pending" && (
                      <div className="flex items-center justify-center py-2 text-yellow-400 text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        Awaiting Admin Approval
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to create a project and make a difference!</p>
              <Dialog>
                <DialogTrigger asChild>
                  <PrimaryButton>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Project
                  </PrimaryButton>
                </DialogTrigger>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
