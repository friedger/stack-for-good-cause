
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { stackingService, type UserStats, type StackingData, type SupportedProject } from "@/services/stackingService";
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
    setSupportedProjects(stackingService.getSupportedProjects());
    setUserStats(stackingService.getUserStats());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />

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
    </div>
  );
};

export default Dashboard;
