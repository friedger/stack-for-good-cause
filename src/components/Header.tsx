
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Wallet, Menu, X, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Logo from "./Logo";
import { walletService, WalletInfo } from "@/services/walletService";
import { useToast } from "@/hooks/use-toast";

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
    // Check periodically for wallet connection changes
    const interval = setInterval(checkWalletConnection, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleConnectWallet = async () => {
    const info = await walletService.connectWallet();
    if (info) {
      setWalletInfo(info);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${info.stxAddress.slice(0, 8)}...${info.stxAddress.slice(-4)}`,
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

  const isConnected = walletInfo?.isConnected || false;
  const shortAddress = walletInfo?.stxAddress 
    ? `${walletInfo.stxAddress.slice(0, 6)}...${walletInfo.stxAddress.slice(-4)}`
    : '';

  return (
    <nav className="container mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
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

          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-orange-500 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-gray-900 border-gray-700 text-white">
                <div className="p-4 space-y-2">
                  <div className="text-sm font-medium">Connected Wallet</div>
                  <div className="text-xs text-gray-400">
                    <div className="mb-1">
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
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SecondaryButton onClick={handleConnectWallet}>
              <Wallet className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Connect Wallet</span>
            </SecondaryButton>
          )}
        </div>

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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
          <div className="flex flex-col space-y-4 pt-4">
            <Link
              to="/stacking"
              className="text-white hover:text-orange-400 transition-colors px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stacking
            </Link>
            <Link
              to="/projects"
              className="text-white hover:text-orange-400 transition-colors px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/dashboard"
              className="text-white hover:text-orange-400 transition-colors px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>

            {showCreateProject && onCreateProject && (
              <SecondaryButton
                onClick={() => {
                  onCreateProject();
                  setIsMobileMenuOpen(false);
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
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-400 border-red-400 hover:bg-red-500/10 w-fit"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <SecondaryButton onClick={handleConnectWallet} className="w-fit">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </SecondaryButton>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
