
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileMenu from "./header/MobileMenu";
import { walletService, WalletInfo } from "@/services/walletService";
import { useToast } from "@/hooks/use-toast";
import { isConnected } from "@stacks/connect";
import { truncAddress } from "@/lib/format";

interface HeaderProps {
  showCreateProject?: boolean;
  onCreateProject?: () => void;
}

const Header = ({ showCreateProject, onCreateProject }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check wallet connection status on component mount
    const checkWalletConnection = () => {
      const info = walletService.getWalletInfo();
      setWalletInfo(info);
    };

    checkWalletConnection();

  }, [isConnected()]);

  const handleConnectWallet = async () => {
    const info = await walletService.connectWallet();
    if (info) {
      setWalletInfo(info);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${truncAddress(info.stxAddress)}`,
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    walletService.disconnectWallet();
    setWalletInfo(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="container mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo />

        <DesktopNavigation
          showCreateProject={showCreateProject}
          onCreateProject={onCreateProject}
          walletInfo={walletInfo}
          onConnectWallet={handleConnectWallet}
          onLogout={handleLogout}
        />

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        showCreateProject={showCreateProject}
        onCreateProject={onCreateProject}
        walletInfo={walletInfo}
        onConnectWallet={handleConnectWallet}
        onLogout={handleLogout}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
};

export default Header;
