
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const AppNavigation = () => {
  return (
    <nav className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-6">
          <Link to="/projects" className="text-white hover:text-orange-400 transition-colors">
            Projects
          </Link>
          <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
            Dashboard
          </Link>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AppNavigation;
