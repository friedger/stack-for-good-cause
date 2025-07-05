
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { disconnect, isConnected } from "@stacks/connect";

interface HeaderProps {
  showCreateProject?: boolean;
  onCreateProject?: () => void;
}

const Header = ({ showCreateProject, onCreateProject }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user data - in a real app this would come from auth context
  const user = {
    stacksAddress: "SP2H8PY27SEZ03MWRK5XABF2CVZDE6HQMGHCCRX9P",
    nostrAddress: "npub1xyz...abc123",
    profileImage: null, // Would come from Nostr profile
    name: "Stacker"
  };

  const handleLogout = () => {
    disconnect();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="container mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/projects" className="text-white hover:text-orange-400 transition-colors">
            Projects
          </Link>
          <Link to="/stacking" className="text-white hover:text-orange-400 transition-colors">
            Stacking
          </Link>
          <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
            Dashboard
          </Link>

          {showCreateProject && onCreateProject && (
            <Button
              onClick={onCreateProject}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-900"
            >
              Create Project
            </Button>
          )}

          {isConnected() ?

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImage || undefined} />
                    <AvatarFallback className="bg-orange-500 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-gray-900 border-gray-700 text-white">
                <div className="p-4 space-y-2">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-400">
                    <div className="mb-1">
                      <span className="font-medium">Stacks:</span>
                      <div className="font-mono text-xs break-all">
                        {user.stacksAddress}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Nostr:</span>
                      <div className="font-mono text-xs">
                        {user.nostrAddress}
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            : <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
              <Wallet className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Connect Wallet</span>
            </Button>
          }
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
              to="/projects"
              className="text-white hover:text-orange-400 transition-colors px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/stacking"
              className="text-white hover:text-orange-400 transition-colors px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stacking
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
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900 w-fit"
              >
                Create Project
              </SecondaryButton>
            )}

            {isConnected() ?
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profileImage || undefined} />
                    <AvatarFallback className="bg-orange-500 text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{user.name}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 space-y-2 mb-4">
                  <div>
                    <span className="font-medium">Stacks:</span>
                    <div className="font-mono text-xs break-all">
                      {user.stacksAddress}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Nostr:</span>
                    <div className="font-mono text-xs">
                      {user.nostrAddress}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-400 border-red-400 hover:bg-red-500/10 w-fit"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
              :
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 w-fit">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            }
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
