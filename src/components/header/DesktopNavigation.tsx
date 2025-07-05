
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Wallet } from "lucide-react";
import { WalletInfo } from "@/services/walletService";
import WalletDropdown from "./WalletDropdown";

interface DesktopNavigationProps {
  showCreateProject?: boolean;
  onCreateProject?: () => void;
  walletInfo: WalletInfo | null;
  onConnectWallet: () => void;
  onLogout: () => void;
}

const DesktopNavigation = ({
  showCreateProject,
  onCreateProject,
  walletInfo,
  onConnectWallet,
  onLogout
}: DesktopNavigationProps) => {
  const isConnected = walletInfo?.isConnected || false;

  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link to="/stacking" className="text-white hover:text-orange-400 transition-colors">
        Stacking
      </Link>
      <Link to="/projects" className="text-white hover:text-orange-400 transition-colors">
        Projects
      </Link>
      <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
        Dashboard
      </Link>

      {showCreateProject && onCreateProject && (
        <SecondaryButton onClick={onCreateProject}>
          Create Project
        </SecondaryButton>
      )}

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
