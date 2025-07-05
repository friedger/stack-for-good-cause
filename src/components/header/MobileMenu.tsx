
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Wallet } from "lucide-react";
import { WalletInfo } from "@/services/walletService";
import { useStackingNotification } from "@/hooks/useStackingNotification";

interface MobileMenuProps {
  isOpen: boolean;
  showCreateProject?: boolean;
  onCreateProject?: () => void;
  walletInfo: WalletInfo | null;
  onConnectWallet: () => void;
  onLogout: () => void;
  onClose: () => void;
}

const MobileMenu = ({
  isOpen,
  showCreateProject,
  onCreateProject,
  walletInfo,
  onConnectWallet,
  onLogout,
  onClose
}: MobileMenuProps) => {
  const isConnected = walletInfo?.isConnected || false;
  const shortAddress = walletInfo?.stxAddress 
    ? `${walletInfo.stxAddress.slice(0, 6)}...${walletInfo.stxAddress.slice(-4)}`
    : '';
  const { projectCount, isStacking, showNotification } = useStackingNotification();

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
      <div className="flex flex-col space-y-4 pt-4">
        <div className="relative">
          <Link
            to="/stacking"
            className="text-white hover:text-orange-400 transition-colors px-2 py-1 block"
            onClick={onClose}
          >
            Stacking
          </Link>
          {showNotification && (
            <div className="absolute top-0 left-16">
              {isStacking ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {projectCount}
                </div>
              )}
            </div>
          )}
        </div>
        <Link
          to="/projects"
          className="text-white hover:text-orange-400 transition-colors px-2 py-1"
          onClick={onClose}
        >
          Projects
        </Link>
        <Link
          to="/dashboard"
          className="text-white hover:text-orange-400 transition-colors px-2 py-1"
          onClick={onClose}
        >
          Dashboard
        </Link>

        {showCreateProject && onCreateProject && (
          <SecondaryButton
            onClick={() => {
              onCreateProject();
              onClose();
            }}
            className="w-fit"
          >
            Create Project
          </SecondaryButton>
        )}

        {isConnected ? (
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-orange-500 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{shortAddress}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 space-y-2 mb-4">
              <div>
                <span className="font-medium">Stacks:</span>
                <div className="font-mono text-xs break-all">
                  {walletInfo?.stxAddress}
                </div>
              </div>
              {walletInfo?.btcAddress && (
                <div>
                  <span className="font-medium">Bitcoin:</span>
                  <div className="font-mono text-xs break-all">
                    {walletInfo.btcAddress}
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-red-400 border-red-400 hover:bg-red-500/10 w-fit"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        ) : (
          <SecondaryButton onClick={onConnectWallet} className="w-fit">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </SecondaryButton>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
