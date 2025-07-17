import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Clock } from "lucide-react";
import { CycleData } from "@/services/analyticsService";

interface CycleProgressCardProps {
  currentCycle: CycleData | null;
}

const CycleProgressCard = ({ currentCycle }: CycleProgressCardProps) => {
  // Calculate cycle progress based on current block height and cycle boundaries
  const calculateCycleProgress = () => {
    if (!currentCycle) return null;

    // Assuming a cycle is ~2100 blocks (approximately 2 weeks)
    const CYCLE_LENGTH = 2100;
    const PREPARE_PHASE_BLOCKS = 100; // Last 100 blocks are prepare phase
    const EXTENSION_PHASE_BLOCKS = 200; // Blocks where extension might happen
    
    // Mock current block position within cycle (this would come from real-time data)
    const currentBlockInCycle = Math.floor(Math.random() * CYCLE_LENGTH);
    
    let phase = "";
    let color = "";
    let blocksRemaining = 0;
    
    if (currentBlockInCycle < CYCLE_LENGTH - PREPARE_PHASE_BLOCKS - EXTENSION_PHASE_BLOCKS) {
      phase = "Fast Pool Open";
      color = "#22c55e"; // green
      blocksRemaining = CYCLE_LENGTH - PREPARE_PHASE_BLOCKS - EXTENSION_PHASE_BLOCKS - currentBlockInCycle;
    } else if (currentBlockInCycle < CYCLE_LENGTH - PREPARE_PHASE_BLOCKS) {
      phase = "Fast Pool Extending";
      color = "#eab308"; // yellow
      blocksRemaining = CYCLE_LENGTH - PREPARE_PHASE_BLOCKS - currentBlockInCycle;
    } else {
      phase = "Prepare Phase";
      color = "#7c2d12"; // dark red/brown
      blocksRemaining = CYCLE_LENGTH - currentBlockInCycle;
    }

    // Calculate percentages for pie chart
    const openBlocks = CYCLE_LENGTH - PREPARE_PHASE_BLOCKS - EXTENSION_PHASE_BLOCKS;
    const extendingBlocks = EXTENSION_PHASE_BLOCKS;
    const prepareBlocks = PREPARE_PHASE_BLOCKS;
    
    const data = [
      {
        name: "Fast Pool Open",
        value: openBlocks,
        percentage: ((openBlocks / CYCLE_LENGTH) * 100).toFixed(1),
        color: "#d1fae5", // light green
        activeColor: "#22c55e" // green
      },
      {
        name: "Fast Pool Extending", 
        value: extendingBlocks,
        percentage: ((extendingBlocks / CYCLE_LENGTH) * 100).toFixed(1),
        color: "#fef3c7", // light yellow
        activeColor: "#eab308" // yellow
      },
      {
        name: "Prepare Phase",
        value: prepareBlocks, 
        percentage: ((prepareBlocks / CYCLE_LENGTH) * 100).toFixed(1),
        color: "#fed7aa", // light orange
        activeColor: "#ea580c" // orange
      }
    ];

    return {
      phase,
      color,
      blocksRemaining,
      currentBlockInCycle,
      data,
      cycleLength: CYCLE_LENGTH
    };
  };

  const progressData = calculateCycleProgress();

  if (!progressData) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Cycle Progress</CardTitle>
          <Clock className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400">No cycle data available</div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300">{data.value} blocks ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">Cycle Progress</CardTitle>
        <Clock className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Phase Info */}
          <div className="text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: progressData.color }}>
              {progressData.phase}
            </div>
            <div className="text-sm text-gray-400">
              Cycle #{currentCycle?.cycle} • {progressData.blocksRemaining} blocks remaining
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Block {progressData.currentBlockInCycle} of {progressData.cycleLength}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressData.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {progressData.data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={progressData.phase === entry.name ? entry.activeColor : entry.color}
                      stroke={progressData.phase === entry.name ? entry.activeColor : "transparent"}
                      strokeWidth={progressData.phase === entry.name ? 2 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#9ca3af' }}
                  formatter={(value: string, entry: any) => (
                    <span style={{ color: entry.color }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CycleProgressCard;