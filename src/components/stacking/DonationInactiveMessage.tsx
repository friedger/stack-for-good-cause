
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Gift } from "lucide-react";

const DonationInactiveMessage = () => {
  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-purple-500/20">
            <Heart className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold mb-2">Keep All Your Rewards</h3>
            <p className="text-gray-600 text-sm mb-4">
              You've chosen to keep 100% of your stacking rewards. You can always change this later!
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-purple-400">
              <Gift className="h-4 w-4" />
              <span>Maximum earnings mode</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationInactiveMessage;
