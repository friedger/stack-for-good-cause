
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bitcoin } from "lucide-react";

interface RewardTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const RewardTypeSelector = ({ value, onChange }: RewardTypeSelectorProps) => {
  const options = [
    {
      id: "stx",
      name: "STX",
      description: "Stacks Token",
      icon: "🟠",
      color: "from-orange-500 to-orange-600"
    },
    {
      id: "sbtc",
      name: "sBTC",
      description: "Synthetic Bitcoin",
      icon: <Bitcoin className="h-8 w-8" />,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="space-y-3">
      <label className="text-white font-medium">Receive Rewards In</label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 ${
              value === option.id
                ? "bg-white/20 border-white/40 ring-2 ring-orange-400"
                : "bg-white/5 border-white/20 hover:bg-white/10"
            }`}
            onClick={() => onChange(option.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-3 rounded-full bg-gradient-to-r ${option.color}`}>
                  {typeof option.icon === 'string' ? (
                    <span className="text-2xl">{option.icon}</span>
                  ) : (
                    <div className="text-white">{option.icon}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{option.name}</h3>
                  <p className="text-gray-400 text-sm">{option.description}</p>
                </div>
                {value === option.id && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    Selected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RewardTypeSelector;
