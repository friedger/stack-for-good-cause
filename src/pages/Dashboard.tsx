
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { stackingService, type UserStats, type StackingData, type SupportedProject } from "@/services/stackingService";
import { projectService } from "@/services/projectService";
import { cartService } from "@/services/cartService";
import StatsOverview from "@/components/dashboard/StatsOverview";
import StackingActivity from "@/components/dashboard/StackingActivity";
import SupportedProjectsList from "@/components/dashboard/SupportedProjectsList";
import ImpactSummary from "@/components/dashboard/ImpactSummary";
import FastPoolName from "@/components/shared/FastPoolName";
import Header from "@/components/Header";

const Dashboard = () => {
  const [stackingHistory, setStackingHistory] = useState<StackingData[]>([]);
  const [supportedProjects, setSupportedProjects] = useState<SupportedProject[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalStacked: 0,
    totalEarned: 0,
    totalDonated: 0,
    activeStacks: 0,
    supportedProjects: 0
  });

  useEffect(() => {
    // Load data from services
    setStackingHistory(stackingService.getStackingHistory());

    // Get supported projects from cart service and project service
    const cartProjects = cartService.getCartProjects();
    const allProjects = projectService.getAllProjects();

    const supportedProjectsData: SupportedProject[] = cartProjects.map(cartProject => {
      const fullProject = allProjects.find(p => p.id === cartProject.id);
      return {
        name: cartProject.name,
        totalDonated: Math.random() * 100, // Mock donation amount
        lastDonation: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };
    });

    setSupportedProjects(supportedProjectsData);

    // Update user stats
    const updatedStats = {
      ...stackingService.getUserStats(),
      supportedProjects: supportedProjectsData.length,
      totalDonated: supportedProjectsData.reduce((sum, project) => sum + project.totalDonated, 0)
    };
    setUserStats(updatedStats);
  }, []);

  return (


    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Your Dashboard
        </h1>

        <StatsOverview />

        <div className="grid lg:grid-cols-2 gap-8">
          <StackingActivity stackingHistory={stackingHistory} />
          <SupportedProjectsList supportedProjects={supportedProjects} userStats={userStats} />
        </div>

        <ImpactSummary />
      </div>
    </div>
  );
};

export default Dashboard;
