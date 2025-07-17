import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Activity, PieChart as PieChartIcon } from "lucide-react";
import { CycleData } from "@/services/analyticsService";
import { stacksNodeService } from "@/services/stacksNodeService";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CycleProgressCardProps {
  currentCycle: CycleData | null;
}

const CycleProgressCard = ({ currentCycle }: CycleProgressCardProps) => {
  const [cycleProgress, setCycleProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCycleProgress = async () => {
      setLoading(true);
      try {
        const cycleData = await stacksNodeService.getCycleBlockHeights();
        
        // Calculate cycle progress based on real block heights
        const CYCLE_LENGTH = 2100;
        const currentBlockInCycle = cycleData.currentBlockHeight - cycleData.cycleStartBlock;
        
        // Phases from the When page
        const phases = [
          {
            name: "Cycle Start",
            startBlock: 0,
            endBlock: cycleData.rewardDistributionEndBlock - cycleData.cycleStartBlock,
            color: "#10B981", // emerald-500
            bgColor: "#065F46", // emerald-800
            description: "Beginning of the stacking cycle"
          },
          {
            name: "Rewards Distribution",
            startBlock: cycleData.rewardDistributionEndBlock - cycleData.cycleStartBlock,
            endBlock: cycleData.extendingStartBlock - cycleData.cycleStartBlock,
            color: "#3B82F6", // blue-500
            bgColor: "#1E40AF", // blue-800
            description: "Fast Pool distributes rewards to members"
          },
          {
            name: "Extension Phase",
            startBlock: cycleData.extendingStartBlock - cycleData.cycleStartBlock,
            endBlock: cycleData.aggregateCommitsBlock - cycleData.cycleStartBlock,
            color: "#F59E0B", // amber-500
            bgColor: "#92400E", // amber-800
            description: "Existing stackers can extend commitments"
          },
          {
            name: "Aggregate Commits",
            startBlock: cycleData.aggregateCommitsBlock - cycleData.cycleStartBlock,
            endBlock: cycleData.lisaClosesBlock - cycleData.cycleStartBlock,
            color: "#8B5CF6", // violet-500
            bgColor: "#5B21B6", // violet-800
            description: "Fast Pool combines partial stacking commitments"
          },
          {
            name: "Lisa Closing",
            startBlock: cycleData.lisaClosesBlock - cycleData.cycleStartBlock,
            endBlock: cycleData.fastPoolClosesBlock - cycleData.cycleStartBlock,
            color: "#EC4899", // pink-500
            bgColor: "#9D174D", // pink-800
            description: "Lisa protocol closes accepting new delegations"
          },
          {
            name: "Fast Pool Closing",
            startBlock: cycleData.fastPoolClosesBlock - cycleData.cycleStartBlock,
            endBlock: cycleData.preparePhaseStartBlock - cycleData.cycleStartBlock,
            color: "#F43F5E", // rose-500
            bgColor: "#9F1239", // rose-800
            description: "Fast Pool stops accepting new members"
          },
          {
            name: "Prepare Phase",
            startBlock: cycleData.preparePhaseStartBlock - cycleData.cycleStartBlock,
            endBlock: CYCLE_LENGTH,
            color: "#EF4444", // red-500
            bgColor: "#991B1B", // red-800
            description: "No new stacking operations allowed"
          }
        ];

        // Determine which phase is currently active
        let currentPhase = null;
        let blocksRemainingInPhase = 0;
        
        // Enhance phases with additional data for the chart
        const enhancedPhases = phases.map(phase => {
          const blockCount = phase.endBlock - phase.startBlock;
          const isActive = currentBlockInCycle >= phase.startBlock && currentBlockInCycle < phase.endBlock;
          const isCompleted = currentBlockInCycle >= phase.endBlock;
          
          if (isActive) {
            currentPhase = phase;
            blocksRemainingInPhase = phase.endBlock - currentBlockInCycle;
          }
          
          return {
            ...phase,
            blockCount,
            percentage: ((blockCount / CYCLE_LENGTH) * 100).toFixed(1),
            active: isActive,
            completed: isCompleted,
            value: blockCount, // for pie chart
            // For pie chart visualization - split current phase into completed and remaining
            valueCompleted: isActive ? currentBlockInCycle - phase.startBlock : isCompleted ? blockCount : 0,
            valueRemaining: isActive ? phase.endBlock - currentBlockInCycle : isCompleted ? 0 : blockCount
          };
        });
        
        // Prepare data for the pie chart
        const pieChartData = [];
        
        enhancedPhases.forEach(phase => {
          if (phase.completed) {
            // Completed phases
            pieChartData.push({
              name: phase.name,
              value: phase.blockCount,
              color: phase.color,
              type: 'completed'
            });
          } else if (phase.active) {
            // Active phase - split into completed and remaining portions
            pieChartData.push({
              name: `${phase.name} (Completed)`,
              value: phase.valueCompleted,
              color: phase.color,
              type: 'active-completed'
            });
            pieChartData.push({
              name: `${phase.name} (Remaining)`,
              value: phase.valueRemaining,
              color: phase.bgColor,
              type: 'active-remaining'
            });
          } else {
            // Upcoming phases
            pieChartData.push({
              name: phase.name,
              value: phase.blockCount,
              color: phase.bgColor,
              type: 'upcoming'
            });
          }
        });
        
        setCycleProgress({
          currentPhase: currentPhase?.name || "Unknown",
          currentPhaseColor: currentPhase?.color || "#CCCCCC",
          blocksRemainingInPhase,
          currentBlockInCycle: Math.max(0, currentBlockInCycle),
          phases: enhancedPhases,
          pieChartData,
          cycleLength: CYCLE_LENGTH,
          currentCycle: cycleData.currentCycle,
          currentBlockHeight: cycleData.currentBlockHeight,
          cycleProgress: (currentBlockInCycle / CYCLE_LENGTH) * 100
        });
      } catch (error) {
        console.error('Error fetching cycle progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCycleProgress();
  }, [currentCycle]);

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Cycle Progress</CardTitle>
          <p className="text-sm text-gray-400">Current Stacking Cycle</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <Skeleton className="h-8 w-32 bg-gray-700 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 bg-gray-700 mx-auto mb-1" />
              <Skeleton className="h-3 w-36 bg-gray-700 mx-auto" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full bg-gray-700" />
              <Skeleton className="h-20 w-full bg-gray-700" />
              <Skeleton className="h-20 w-full bg-gray-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cycleProgress) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Cycle Progress</CardTitle>
          <p className="text-sm text-gray-400">Current Stacking Cycle</p>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400">No cycle data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">Cycle Progress</CardTitle>
        <p className="text-sm text-gray-400">Current Stacking Cycle</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Phase Status */}
          <div className="text-center bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="h-5 w-5" style={{ color: cycleProgress.currentPhaseColor }} />
              <span 
                className="text-xl font-bold"
                style={{ color: cycleProgress.currentPhaseColor }}
              >
                {cycleProgress.currentPhase}
              </span>
            </div>
            <div className="text-sm text-gray-300 mb-1">
              Cycle #{cycleProgress.currentCycle} • {cycleProgress.blocksRemainingInPhase} blocks remaining in phase
            </div>
            <div className="text-xs text-gray-400">
              Block {cycleProgress.currentBlockInCycle} of {cycleProgress.cycleLength} 
              ({cycleProgress.cycleProgress.toFixed(1)}% complete)
            </div>
          </div>

          {/* Pie Chart Visualization */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-300">Cycle Phases</h4>
              <PieChartIcon className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cycleProgress.pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={1}
                    startAngle={90}
                    endAngle={-270}
                    label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {cycleProgress.pieChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} blocks`, 'Size']}
                    labelFormatter={(name) => name}
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#374151',
                      color: 'white',
                      borderRadius: '0.375rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {cycleProgress.phases.map((phase: any, index: number) => {
                const isCompleted = phase.completed;
                const isActive = phase.active;
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: isCompleted || isActive ? phase.color : phase.bgColor 
                      }}
                    />
                    <span className={`text-xs truncate ${
                      isActive ? 'text-white font-medium' : 
                      isCompleted ? 'text-gray-300' : 'text-gray-400'
                    }`}>
                      {phase.name}
                      {isActive && <span className="ml-1 text-blue-400">(Active)</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Cycle Progress */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">Overall Cycle Progress</span>
              <span className="text-sm text-gray-400">{cycleProgress.cycleProgress.toFixed(1)}%</span>
            </div>
            <Progress 
              value={cycleProgress.cycleProgress}
              className="h-3"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Block 0</span>
              <span>Current: #{cycleProgress.currentBlockHeight?.toLocaleString()}</span>
              <span>Block {cycleProgress.cycleLength}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CycleProgressCard;