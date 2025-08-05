
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { truncAddress } from "@/lib/format";
import { parseUserData } from "@/lib/user-data";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface UserDataVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface VerificationResult {
  version: number;
  currency: string;
  addresses: string[];
  shares: number[];
  source: string;
}

const UserDataVerificationModal = ({ open, onOpenChange }: UserDataVerificationModalProps) => {
  const [hexString, setHexString] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!hexString.trim()) {
      toast({
        title: "Missing Input",
        description: "Please enter a hex string to verify.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = parseUserData(hexString);
      if (result) {
        const { version, currency, addresses, ratios, source } = result;

        setVerificationResult({
          version,
          currency,
          addresses,
          shares: ratios,
          source,
        });

        toast({
          title: "Verification Successful",
          description: "User data has been successfully decoded and verified.",
        });
      } else {
        throw new Error("Invalid data structure");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Failed to decode the hex string. Please check the format and try again.",
        variant: "destructive",
      });
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Address copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setHexString("");
    setVerificationResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verify user-data</DialogTitle>
          <DialogDescription>
            Paste the hex string from your stacking transaction to verify the encoded user data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          The hex-encoded string <code>user-data</code> defines the distribution of the stacking rewards.
          It contains the version, the currency for rewards, and a list of STX addresses of supported projects with their respective shares.
          <br />
          <div className="space-y-2">
            <Label htmlFor="hex-input">Hex String</Label>
            <Input
              id="hex-input"
              placeholder="Paste your hex string here..."
              value={hexString}
              onChange={(e) => setHexString(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || !hexString.trim()}
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Verify Data"}
          </Button>

          {verificationResult && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Verification Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Version</Label>
                    <p className="text-lg font-mono">{verificationResult.version}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Token for Rewards</Label>
                    <p className="text-lg font-mono uppercase">{verificationResult.currency}</p>
                  </div>
                </div>

                {verificationResult.addresses.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">
                      STX Addresses & Shares
                    </Label>
                    <div className="space-y-2">
                      {verificationResult.addresses.map((address, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-mono truncate">{truncAddress(address)}</p>
                            <p className="text-xs">
                              <span className="text-gray-500">Share:</span> {verificationResult.shares[index] || 0} ‰
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(address)}
                            className="ml-2 flex-shrink-0"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {verificationResult.addresses.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No project addresses found in the verification data.
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-600">Referral</Label>
                  <p className="text-lg font-mono uppercase">{verificationResult.source || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDataVerificationModal;
