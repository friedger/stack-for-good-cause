
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, X, Users, TrendingUp, Heart, Shield, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FastPoolName from "@/components/shared/FastPoolName";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { projectService, Project } from "@/services/projectService";
import { walletService, WalletInfo } from "@/services/walletService";
import { nostrService } from "@/services/nostrService";

const Admin = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check wallet connection on component mount
    const wallet = walletService.getWalletInfo();
    setWalletInfo(wallet);
    
    // Load projects
    const projects = projectService.getAllProjects();
    setAllProjects(projects);
    setIsLoading(false);
  }, []);

  const handleConnectWallet = async () => {
    const wallet = await walletService.connectWallet();
    if (wallet) {
      setWalletInfo(wallet);
      toast({
        title: "Wallet Connected",
        description: "You can now access the admin panel.",
      });
    }
  };

  const handleApproveProject = async (project: Project) => {
    try {
      // Update project status
      const updatedProject = projectService.updateProject(project.id, { status: "approved" });
      
      if (updatedProject) {
        // Create Nostr approval event (kind 4550)
        await nostrService.publishUpdate({
          title: `Project Approved: ${project.name}`,
          content: JSON.stringify({
            kind: 4550,
            tags: [
              ["a", `34550:${walletInfo?.stxAddress}:fastpool-community`],
              ["e", project.id],
              ["p", project.stxAddress],
              ["k", "1"]
            ],
            content: JSON.stringify(project),
            action: "approve"
          }),
          projectId: project.id,
          author: "FastPool Admin",
          tags: ["project-approval", "nip-72", "kind-4550"]
        });

        // Update local state
        setAllProjects(prev => prev.map(p => 
          p.id === project.id ? { ...p, status: "approved" as const } : p
        ));

        toast({
          title: "Project Approved!",
          description: "The project has been approved and announced on Nostr.",
        });
      }
    } catch (error) {
      console.error("Failed to approve project:", error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectProject = async (project: Project) => {
    try {
      // Create Nostr removal event (kind 4551)
      await nostrService.publishUpdate({
        title: `Project Rejected: ${project.name}`,
        content: JSON.stringify({
          kind: 4551,
          tags: [
            ["a", `34550:${walletInfo?.stxAddress}:fastpool-community`],
            ["e", project.id],
            ["p", project.stxAddress],
            ["k", "1"]
          ],
          content: JSON.stringify(project),
          action: "reject"
        }),
        projectId: project.id,
        author: "FastPool Admin",
        tags: ["project-rejection", "nip-72", "kind-4551"]
      });

      // Remove project from local state
      setAllProjects(prev => prev.filter(p => p.id !== project.id));

      toast({
        title: "Project Rejected",
        description: "The project has been rejected and removed from the platform.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Failed to reject project:", error);
      toast({
        title: "Rejection Failed",
        description: "Failed to reject the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter projects by status
  const pendingProjects = allProjects.filter(p => p.status === "pending");
  const approvedProjects = allProjects.filter(p => p.status === "approved");

  const totalStats = {
    totalRaised: approvedProjects.reduce((sum, p) => sum + p.totalRaised, 0),
    totalBackers: approvedProjects.reduce((sum, p) => sum + p.backers, 0),
    activeProjects: approvedProjects.length,
    pendingReviews: pendingProjects.length
  };

  // Show wallet connection prompt if not connected
  if (!walletInfo?.isConnected) {
    return (
      <>
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-white hover:text-orange-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <FastPoolName />
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="py-16">
                <Shield className="h-16 w-16 text-orange-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">
                  Admin Access Required
                </h1>
                <p className="text-gray-300 mb-8">
                  You need to connect your wallet to access the admin panel. This ensures secure access to project moderation features.
                </p>
                <SecondaryButton onClick={handleConnectWallet} className="mx-auto">
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet to Continue
                </SecondaryButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
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
            <div className="text-sm text-gray-400">
              Connected: {walletInfo.stxAddress.slice(0, 6)}...{walletInfo.stxAddress.slice(-4)}
            </div>
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
                            <span>STX Address: {project.stxAddress.slice(0, 8)}...</span>
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Pending Review
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">{project.description}</p>

                      <div className="flex space-x-3">
                        <PrimaryButton
                          onClick={() => handleApproveProject(project)}
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve Project
                        </PrimaryButton>
                        <Button
                          onClick={() => handleRejectProject(project)}
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
                        <span className="text-gray-400">Creator:</span>
                        <span className="text-gray-300">{project.creator}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
