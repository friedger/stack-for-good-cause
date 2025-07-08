
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Wallet } from "lucide-react";
import { WalletInfo } from "@/services/walletService";
import { useStackingNotification } from "@/hooks/useStackingNotification";
import { configService } from "@/services/configService";
import WalletDropdown from "./WalletDropdown";

interface DesktopNavigationProps {
  showCreateProject?: boolean;
  onCreateProject?: () => void;
  walletInfo: WalletInfo | null;
  onConnectWallet: () => void;
  onLogout: () => void;
}

const DesktopNavigation = ({
  walletInfo,
  onConnectWallet,
  onLogout
}: DesktopNavigationProps) => {
  const isConnected = walletInfo?.isConnected || false;
  const { projectCount, isStacking, showNotification } = useStackingNotification();
  const showProjectsInHeader = configService.shouldShowProjectsInHeader();

  return (
    <div className="hidden md:flex items-center space-x-6">
      <div className="relative">
        <Link to="/stacking" className="text-white hover:text-orange-400 transition-colors">
          Stacking
        </Link>
        {showNotification && (
          <div className="absolute -top-2 -right-2">
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
      {showProjectsInHeader && (
        <Link to="/projects" className="text-white hover:text-orange-400 transition-colors">
          Projects
        </Link>
      )}
      {/* <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
        Dashboard
      </Link> */}

      {isConnected && walletInfo ? (
        <WalletDropdown walletInfo={walletInfo} onLogout={onLogout} />
      ) : (
        <SecondaryButton onClick={onConnectWallet}>
          <Wallet className="h-4 w-4 mr-2" />
          <span className="hidden lg:inline">Connect Wallet</span>
        </SecondaryButton>
      )}
    </div>
  );
};

export default DesktopNavigation;
