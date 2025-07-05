
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Wallet, TrendingUp, Heart, Share2, Bitcoin } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const App = () => {
  const [stxAmount, setStxAmount] = useState("");
  const [rewardType, setRewardType] = useState("stx");
  const [enableDonation, setEnableDonation] = useState(true);
  const [donationPercentage, setDonationPercentage] = useState([10]);
  const [selectedProject, setSelectedProject] = useState("");
  const [sharePublicly, setSharePublicly] = useState(true);
  const { toast } = useToast();

  const mockProjects = [
    { id: "1", name: "Clean Water Initiative", description: "Bringing clean water to communities" },
    { id: "2", name: "Education for All", description: "Supporting education in underserved areas" },
    { id: "3", name: "Renewable Energy", description: "Funding solar panel installations" },
  ];

  const estimatedYield = stxAmount ? (parseFloat(stxAmount) * 0.085).toFixed(2) : "0";
  const donationAmount = enableDonation && estimatedYield ? ((parseFloat(estimatedYield) * donationPercentage[0]) / 100).toFixed(4) : "0";
  const yourEarnings = estimatedYield ? (parseFloat(estimatedYield) - parseFloat(donationAmount)).toFixed(4) : "0";

  const handleStack = () => {
    if (!stxAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter STX amount to start stacking.",
        variant: "destructive",
      });
      return;
    }

    if (enableDonation && !selectedProject) {
      toast({
        title: "Select Project",
        description: "Please select a project to support with your donation.",
        variant: "destructive",
      });
      return;
    }

    const rewardText = rewardType === "sbtc" ? "sBTC" : "STX";
    const donationText = enableDonation ? ` with ${donationPercentage[0]}% donated to charity` : "";
    
    toast({
      title: "Stacking Started!",
      description: `Successfully stacked ${stxAmount} STX. Rewards in ${rewardText}${donationText}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center text-white hover:text-orange-400 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-2xl font-bold">Fast<span className="text-orange-400">Pool</span></span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/projects" className="text-white hover:text-orange-400 transition-colors">
              Projects
            </Link>
            <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
              Dashboard
            </Link>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Stack Your Way with Fast Pool
          </h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Stacking Form */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-orange-400" />
                  Configure Your Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="stx-amount" className="text-white">STX Amount</Label>
                  <Input
                    id="stx-amount"
                    type="number"
                    placeholder="Enter STX amount"
                    value={stxAmount}
                    onChange={(e) => setStxAmount(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <p className="text-sm text-gray-400 mt-1">Minimum: 1,000 STX</p>
                </div>

                <div>
                  <Label className="text-white">Receive Rewards In</Label>
                  <Select value={rewardType} onValueChange={setRewardType}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stx">STX (Stacks Token)</SelectItem>
                      <SelectItem value="sbtc">sBTC (Synthetic Bitcoin)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Donate to Project</Label>
                    <Switch
                      checked={enableDonation}
                      onCheckedChange={setEnableDonation}
                    />
                  </div>

                  {enableDonation && (
                    <>
                      <div>
                        <Label className="text-white">Donation Percentage: {donationPercentage[0]}%</Label>
                        <Slider
                          value={donationPercentage}
                          onValueChange={setDonationPercentage}
                          max={50}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-sm text-gray-400 mt-1">
                          <span>1% (Minimum)</span>
                          <span>50% (Maximum)</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">Select Project to Support</Label>
                        <Select value={selectedProject} onValueChange={setSelectedProject}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Choose a project" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProjects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-white">Share Impact Publicly</Label>
                        <Switch
                          checked={sharePublicly}
                          onCheckedChange={setSharePublicly}
                        />
                      </div>
                    </>
                  )}
                </div>

                <Button 
                  onClick={handleStack}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  Start Stacking
                </Button>
              </CardContent>
            </Card>

            {/* Earnings Breakdown */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {rewardType === "sbtc" ? <Bitcoin className="h-6 w-6 mr-2 text-orange-400" /> : <TrendingUp className="h-6 w-6 mr-2 text-orange-400" />}
                  Your Rewards Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Estimated Annual Yield</span>
                    <span className="text-white font-semibold">{estimatedYield} {rewardType.toUpperCase()}</span>
                  </div>
                  
                  {enableDonation && (
                    <div className="flex justify-between items-center p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                      <span className="text-gray-300">Donation Amount ({donationPercentage[0]}%)</span>
                      <span className="text-pink-400 font-semibold">{donationAmount} {rewardType.toUpperCase()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <span className="text-gray-300">Your Net Earnings</span>
                    <span className="text-green-400 font-semibold">{yourEarnings} {rewardType.toUpperCase()}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-white font-semibold mb-2">Fast Pool Benefits</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                      No lock-up period
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                      Daily reward distribution
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                      Choose STX or sBTC rewards
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                      Optional social impact
                    </li>
                  </ul>
                </div>

                {enableDonation && sharePublicly && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center">
                        <Share2 className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-blue-400 text-sm font-medium">Public Impact Sharing Enabled</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Current Stack Info */}
          <Card className="mt-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Fast Pool Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">0 STX</div>
                  <div className="text-gray-300">Currently Stacked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">0 {rewardType.toUpperCase()}</div>
                  <div className="text-gray-300">Total Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">0 {rewardType.toUpperCase()}</div>
                  <div className="text-gray-300">Total Donated</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;
