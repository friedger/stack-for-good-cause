
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, Heart, Wallet, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const userStats = {
    totalStacked: 5000,
    totalEarned: 425.50,
    totalDonated: 127.65,
    activeStacks: 2,
    supportedProjects: 3
  };

  const stackingHistory = [
    {
      id: "1",
      amount: 3000,
      project: "Clean Water Initiative",
      donationPercentage: 15,
      startDate: "2024-01-10",
      status: "active",
      earned: 255.30,
      donated: 76.59
    },
    {
      id: "2",
      amount: 2000,
      project: "Education for All",
      donationPercentage: 10,
      startDate: "2024-01-05",
      status: "active",
      earned: 170.20,
      donated: 51.06
    }
  ];

  const supportedProjects = [
    {
      name: "Clean Water Initiative",
      totalDonated: 76.59,
      lastDonation: "2024-01-15"
    },
    {
      name: "Education for All",
      totalDonated: 51.06,
      lastDonation: "2024-01-15"
    }
  ];

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
          
          {/* Stats Overview */}
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Wallet className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.totalStacked}</div>
                <div className="text-gray-300 text-sm">STX Stacked</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.totalEarned.toFixed(2)}</div>
                <div className="text-gray-300 text-sm">STX Earned</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats.totalDonated.toFixed(2)}</div>
                <div className="text-gray-300 text-sm">STX Donated</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white">{userStats.activeStacks}</div>
                <div className="text-gray-300 text-sm">Active Stacks</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white">{userStats.supportedProjects}</div>
                <div className="text-gray-300 text-sm">Projects Supported</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Stacking History */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-orange-400" />
                  Your Stacking Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stackingHistory.map((stack) => (
                  <div key={stack.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{stack.amount} STX</h4>
                        <p className="text-gray-400 text-sm">Supporting {stack.project}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {stack.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Donation %:</span>
                        <span className="text-pink-400">{stack.donationPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Earned:</span>
                        <span className="text-green-400">{stack.earned.toFixed(2)} STX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Donated:</span>
                        <span className="text-pink-400">{stack.donated.toFixed(2)} STX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Started:</span>
                        <span className="text-gray-300">{stack.startDate}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Donation Progress</span>
                        <span>{stack.donationPercentage}%</span>
                      </div>
                      <Progress value={stack.donationPercentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Supported Projects */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart className="h-6 w-6 mr-2 text-pink-400" />
                  Projects You Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportedProjects.map((project, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-2">{project.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Donated:</span>
                        <span className="text-pink-400 font-semibold">{project.totalDonated.toFixed(2)} STX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Last Donation:
                        </span>
                        <span className="text-gray-300">{project.lastDonation}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm mb-3">
                    Your donations are making a real impact!
                  </p>
                  <div className="text-2xl font-bold text-pink-400">
                    {userStats.totalDonated.toFixed(2)} STX
                  </div>
                  <div className="text-gray-300 text-sm">Total Impact</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Summary */}
          <Card className="mt-8 bg-gradient-to-r from-pink-500/10 to-orange-500/10 border-pink-500/20 backdrop-blur-sm">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Your Impact Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">8.5%</div>
                  <div className="text-gray-300">Average APY Earned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-400 mb-2">30%</div>
                  <div className="text-gray-300">Of Earnings Donated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400 mb-2">2</div>
                  <div className="text-gray-300">Projects Supported</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
