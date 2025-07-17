import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Activity } from "lucide-react";
import { CycleData } from "@/services/analyticsService";
import { stacksNodeService } from "@/services/stacksNodeService";

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
        const PREPARE_PHASE_BLOCKS = 100;
        const EXTENSION_PHASE_BLOCKS = 200;
        
        const currentBlockInCycle = cycleData.currentBlockHeight - cycleData.cycleStartBlock;
        
        let phase = "";
        let phaseProgress = 0;
        let blocksRemaining = 0;
        let phaseStartBlock = 0;
        let phaseEndBlock = 0;
        
        const openPhaseEnd = CYCLE_LENGTH - PREPARE_PHASE_BLOCKS - EXTENSION_PHASE_BLOCKS;
        const extendingPhaseEnd = CYCLE_LENGTH - PREPARE_PHASE_BLOCKS;
        
        if (currentBlockInCycle < openPhaseEnd) {
          phase = "Fast Pool Open";
          phaseStartBlock = 0;
          phaseEndBlock = openPhaseEnd;
          phaseProgress = (currentBlockInCycle / openPhaseEnd) * 100;
          blocksRemaining = openPhaseEnd - currentBlockInCycle;
        } else if (currentBlockInCycle < extendingPhaseEnd) {
          phase = "Fast Pool Extending";
          phaseStartBlock = openPhaseEnd;
          phaseEndBlock = extendingPhaseEnd;
          phaseProgress = ((currentBlockInCycle - openPhaseEnd) / EXTENSION_PHASE_BLOCKS) * 100;
          blocksRemaining = extendingPhaseEnd - currentBlockInCycle;
        } else {
          phase = "Prepare Phase";
          phaseStartBlock = extendingPhaseEnd;
          phaseEndBlock = CYCLE_LENGTH;
          phaseProgress = ((currentBlockInCycle - extendingPhaseEnd) / PREPARE_PHASE_BLOCKS) * 100;
          blocksRemaining = CYCLE_LENGTH - currentBlockInCycle;
        }

        const phases = [
          {
            name: "Fast Pool Open",
            startBlock: 0,
            endBlock: openPhaseEnd,
            blocks: openPhaseEnd,
            percentage: ((openPhaseEnd / CYCLE_LENGTH) * 100).toFixed(1),
            color: "#10B981", // emerald-500
            bgColor: "#065F46", // emerald-800
            active: phase === "Fast Pool Open"
          },
          {
            name: "Fast Pool Extending", 
            startBlock: openPhaseEnd,
            endBlock: extendingPhaseEnd,
            blocks: EXTENSION_PHASE_BLOCKS,
            percentage: ((EXTENSION_PHASE_BLOCKS / CYCLE_LENGTH) * 100).toFixed(1),
            color: "#F59E0B", // amber-500
            bgColor: "#92400E", // amber-800
            active: phase === "Fast Pool Extending"
          },
          {
            name: "Prepare Phase",
            startBlock: extendingPhaseEnd,
            endBlock: CYCLE_LENGTH,
            blocks: PREPARE_PHASE_BLOCKS, 
            percentage: ((PREPARE_PHASE_BLOCKS / CYCLE_LENGTH) * 100).toFixed(1),
            color: "#EF4444", // red-500
            bgColor: "#991B1B", // red-800
            active: phase === "Prepare Phase"
          }
        ];

        setCycleProgress({
          phase,
          phaseProgress: Math.min(100, Math.max(0, phaseProgress)),
          blocksRemaining: Math.max(0, blocksRemaining),
          currentBlockInCycle: Math.max(0, currentBlockInCycle),
          phases,
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
              <Activity className="h-5 w-5" style={{ color: cycleProgress.phases.find((p: any) => p.active)?.color }} />
              <span 
                className="text-xl font-bold"
                style={{ color: cycleProgress.phases.find((p: any) => p.active)?.color }}
              >
                {cycleProgress.phase}
              </span>
            </div>
            <div className="text-sm text-gray-300 mb-1">
              Cycle #{cycleProgress.currentCycle} • {cycleProgress.blocksRemaining} blocks remaining
            </div>
            <div className="text-xs text-gray-400">
              Block {cycleProgress.currentBlockInCycle} of {cycleProgress.cycleLength} 
              ({cycleProgress.cycleProgress.toFixed(1)}% complete)
            </div>
          </div>

          {/* Phase Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Phase Breakdown</h4>
            {cycleProgress.phases.map((phase: any, index: number) => {
              const isCompleted = cycleProgress.currentBlockInCycle >= phase.endBlock;
              const isActive = phase.active;
              const progressInPhase = isActive ? 
                ((cycleProgress.currentBlockInCycle - phase.startBlock) / phase.blocks) * 100 : 
                isCompleted ? 100 : 0;

              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    isActive 
                      ? 'border-gray-600 bg-gray-700/30' 
                      : 'border-gray-700/50 bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: isCompleted || isActive ? phase.color : phase.bgColor 
                        }}
                      />
                      <span 
                        className={`font-medium ${
                          isActive ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-400'
                        }`}
                      >
                        {phase.name}
                      </span>
                      {isActive && (
                        <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                          Active
                        </span>
                      )}
                      {isCompleted && !isActive && (
                        <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">
                          Complete
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {phase.blocks} blocks ({phase.percentage}%)
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Block {phase.startBlock}</span>
                      <span>{progressInPhase.toFixed(1)}% complete</span>
                      <span>Block {phase.endBlock}</span>
                    </div>
                    <Progress 
                      value={progressInPhase}
                      className="h-2"
                      style={{
                        '--progress-foreground': isCompleted || isActive ? phase.color : phase.bgColor
                      } as any}
                    />
                  </div>
                </div>
              );
            })}
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