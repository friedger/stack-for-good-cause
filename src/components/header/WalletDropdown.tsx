
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { WalletInfo } from "@/services/walletService";

interface WalletDropdownProps {
  walletInfo: WalletInfo;
  onLogout: () => void;
}

const WalletDropdown = ({ walletInfo, onLogout }: WalletDropdownProps) => {
  return (
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
                {walletInfo.stxAddress}
              </div>
            </div>
            {walletInfo.btcAddress && (
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
          onClick={onLogout}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletDropdown;
