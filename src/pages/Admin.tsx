
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, X, Users, TrendingUp, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FastPoolName from "@/components/shared/FastPoolName";

const Admin = () => {
  const [pendingProjects, setPendingProjects] = useState([
    {
      id: "4",
      name: "Tech Skills Training",
      description: "Providing coding bootcamps and digital literacy programs for unemployed youth in urban areas. Our program includes mentorship, job placement assistance, and ongoing support.",
      category: "Technology",
      creator: "CodeBridge",
      submittedDate: "2024-01-15",
      email: "contact@codebridge.org"
    },
    {
      id: "5",
      name: "Community Garden Network",
      description: "Establishing sustainable community gardens in food deserts to improve nutrition and build community connections. Each garden will include educational workshops.",
      category: "Environment",
      creator: "GreenNeighbors",
      submittedDate: "2024-01-14",
      email: "info@greenneighbors.com"
    }
  ]);

  const [approvedProjects] = useState([
    {
      id: "1",
      name: "Clean Water Initiative",
      totalRaised: 2450.75,
      backers: 23,
      approvedDate: "2024-01-10"
    },
    {
      id: "2",
      name: "Education for All",
      totalRaised: 1825.30,
      backers: 18,
      approvedDate: "2024-01-08"
    },
    {
      id: "3",
      name: "Renewable Energy Hub",
      totalRaised: 3200.45,
      backers: 31,
      approvedDate: "2024-01-05"
    }
  ]);

  const { toast } = useToast();

  const handleApproveProject = (projectId: string) => {
    setPendingProjects(pendingProjects.filter(p => p.id !== projectId));
    toast({
      title: "Project Approved!",
      description: "The project has been approved and is now live for donations.",
    });
  };

  const handleRejectProject = (projectId: string) => {
    setPendingProjects(pendingProjects.filter(p => p.id !== projectId));
    toast({
      title: "Project Rejected",
      description: "The project has been rejected. The creator will be notified.",
      variant: "destructive",
    });
  };

  const totalStats = {
    totalRaised: approvedProjects.reduce((sum, p) => sum + p.totalRaised, 0),
    totalBackers: approvedProjects.reduce((sum, p) => sum + p.backers, 0),
    activeProjects: approvedProjects.length,
    pendingReviews: pendingProjects.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center text-white hover:text-orange-400 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <FastPoolName />
          </Link>
          <div className="flex items-center space-x-6">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Admin Panel
            </Badge>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Admin Dashboard
          </h1>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalStats.totalRaised.toFixed(2)}</div>
                <div className="text-gray-300 text-sm">Total STX Raised</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalStats.totalBackers}</div>
                <div className="text-gray-300 text-sm">Total Backers</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalStats.activeProjects}</div>
                <div className="text-gray-300 text-sm">Active Projects</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalStats.pendingReviews}</div>
                <div className="text-gray-300 text-sm">Pending Reviews</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
              <TabsTrigger value="pending" className="data-[state=active]:bg-orange-500">
                Pending Reviews ({pendingProjects.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-green-500">
                Approved Projects ({approvedProjects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              <div className="space-y-6">
                {pendingProjects.map((project) => (
                  <Card key={project.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-xl">{project.name}</CardTitle>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                            <span>By: {project.creator}</span>
                            <span>Category: {project.category}</span>
                            <span>Submitted: {project.submittedDate}</span>
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Pending Review
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">{project.description}</p>

                      <div className="text-sm text-gray-400">
                        <strong>Contact:</strong> {project.email}
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleApproveProject(project.id)}
                          className="bg-green-500 hover:bg-green-600 flex-1"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve Project
                        </Button>
                        <Button
                          onClick={() => handleRejectProject(project.id)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {pendingProjects.length === 0 && (
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="py-16 text-center">
                      <Shield className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Pending Reviews</h3>
                      <p className="text-gray-400">All projects have been reviewed!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedProjects.map((project) => (
                  <Card key={project.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">{project.name}</CardTitle>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 w-fit">
                        Approved
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Raised:</span>
                        <span className="text-green-400 font-semibold">{project.totalRaised.toFixed(2)} STX</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Backers:</span>
                        <span className="text-blue-400 font-semibold">{project.backers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Approved:</span>
                        <span className="text-gray-300">{project.approvedDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
