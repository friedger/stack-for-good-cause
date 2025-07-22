import { useUser } from "@/hooks/useUser";
import { useUserStackingService } from "@/hooks/useStackingInfo";
import { ustxToLocalString } from "@/lib/format";
import { walletService } from "@/services/walletService";
import { Lock, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const UserStackingInfo = () => {
  const { loading, stxBalance, lockedStx } = useUser();
  const { stackingStatus, delegationStatus } = useUserStackingService();

  if (!stxBalance && !loading) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-blue-400 hover:text-blue-700 hover:cursor-pointer"
        onClick={() => walletService.connectWallet()}>
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet to View Stacking Info
      </div>
    );
  }

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Wallet Balance */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-blue-500/20">
              <Wallet className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Wallet Balance</p>
              <p className="text-sm font-medium text-white">
                {loading ? "Loading..." : `${ustxToLocalString(stxBalance)} STX`}
              </p>
            </div>
          </div>

          {/* Stacked Amount */}
          {stackingStatus?.stacked && (
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-green-500/20">
                <Lock className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Stacked Amount</p>
                <p className="text-sm font-medium text-white">
                  {loading ? "Loading..." : `${ustxToLocalString(lockedStx)} STX`}
                </p>
              </div>
            </div>
          )}

          {/* Delegation Status */}
          {delegationStatus && (
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-purple-500/20">
                <Lock className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Delegation Status</p>
                <p className="text-sm font-medium text-white">
                  {loading ? "Loading..." : 
                    delegationStatus.delegated ? 
                      `Delegated to: ${delegationStatus.details.delegated_to.slice(0, 8)}...` : 
                      "Revoked"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStackingInfo;