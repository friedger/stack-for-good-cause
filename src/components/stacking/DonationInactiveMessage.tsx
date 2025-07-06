
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Heart } from "lucide-react";

const DonationInactiveMessage = () => {
  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 shadow-sm">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-5 rounded-full bg-purple-500/30 shadow-lg">
            <Heart className="h-10 w-10 text-purple-300" />
          </div>
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg tracking-wide">
              Keep All Your Rewards
            </h3>
            <p className="text-gray-300 text-base leading-relaxed max-w-md mx-auto">
              You've chosen to keep your stacking rewards.
              You can enable
              contributions at any time to support projects in the ecosystem.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4 px-4 py-2">
              <Coins className="h-5 w-5 text-purple-300" />
              <span className="text-white font-medium">Maximum Earnings Mode</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationInactiveMessage;
