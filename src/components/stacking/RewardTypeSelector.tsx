
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface RewardTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RewardTypeSelector = ({ value, onChange, disabled = false }: RewardTypeSelectorProps) => {
  const options = [
    {
      id: "stx",
      name: "STX",
      description: "Stacks Token",
      icon: <img src="/img/stx.jpg" className="h-8 w-8 rounded-sm" />,
      color: "from-gray-500 to-gray-600"
    },
    {
      id: "sbtc",
      name: "sBTC",
      description: "Synthetic Bitcoin",
      icon: <img src="/img/sbtc.png" className="h-8 w-8 rounded-sm" />,
      color: "from-gray-500 to-gray-600"
    }
  ];

  return (
    <div className="space-y-3">
      <label className="text-white font-medium">Receive Rewards In</label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${value === option.id
                ? "bg-white/20 border-white/40 ring-2 ring-blue-400"
                : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
            onClick={() => !disabled && onChange(option.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-3`}>
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
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
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
