
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { stackingService, type UserStats, type StackingData, type SupportedProject } from "@/services/stackingService";
import StatsOverview from "@/components/dashboard/StatsOverview";
import StackingActivity from "@/components/dashboard/StackingActivity";
import SupportedProjectsList from "@/components/dashboard/SupportedProjectsList";
import ImpactSummary from "@/components/dashboard/ImpactSummary";

const Dashboard = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalStacked: 0,
    totalEarned: 0,
    totalDonated: 0,
    activeStacks: 0,
    supportedProjects: 0
  });
  const [stackingHistory, setStackingHistory] = useState<StackingData[]>([]);
  const [supportedProjects, setSupportedProjects] = useState<SupportedProject[]>([]);

  useEffect(() => {
    // Load data from services
    setUserStats(stackingService.getUserStats());
    setStackingHistory(stackingService.getStackingHistory());
    setSupportedProjects(stackingService.getSupportedProjects());
  }, []);

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
            <Link to="/stacking" className="text-white hover:text-orange-400 transition-colors">
              Stacking
            </Link>
            <Link to="/projects" className="text-white hover:text-orange-400 transition-colors">
              Projects
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Your Dashboard
          </h1>
          
          <StatsOverview userStats={userStats} />

          <div className="grid lg:grid-cols-2 gap-8">
            <StackingActivity stackingHistory={stackingHistory} />
            <SupportedProjectsList supportedProjects={supportedProjects} userStats={userStats} />
          </div>

          <ImpactSummary userStats={userStats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
