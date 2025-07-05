import {
  connect,
  disconnect,
  getLocalStorage,
  isConnected,
  request,
} from "@stacks/connect";
import { CallContractParams } from "@stacks/connect/dist/types/methods";
import {
  bufferCVFromString,
  listCV,
  principalCV,
  serializeCV,
  stringAsciiCV,
  tupleCV,
  uintCV,
} from "@stacks/transactions";

export interface WalletInfo {
  stxAddress: string;
  btcAddress?: string;
  isConnected: boolean;
}

class WalletService {
  async connectWallet(): Promise<WalletInfo | null> {
    try {
      const response = await connect();
      console.log("Wallet connected:", response);

      const userData = getLocalStorage();
      return {
        stxAddress: userData?.addresses?.stx?.[0]?.address || "",
        btcAddress: userData?.addresses?.btc?.[0]?.address,
        isConnected: true,
      };
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return null;
    }
  }

  disconnectWallet(): void {
    disconnect();
    console.log("Wallet disconnected");
  }

  getWalletInfo(): WalletInfo | null {
    if (!isConnected()) {
      return { stxAddress: "", isConnected: false };
    }

    const userData = getLocalStorage();
    if (!userData?.addresses?.stx?.[0]?.address) {
      return { stxAddress: "", isConnected: false };
    }

    return {
      stxAddress: userData.addresses.stx[0].address,
      btcAddress: userData.addresses.btc?.[0]?.address,
      isConnected: true,
    };
  }

  async delegateStx(
    amount: string,
    poolAddress: string,
    currency: "stx" | "sbtc",
    projects: { addr: string; part: number }[] = []
  ): Promise<string | null> {
    try {
      const response = await request("stx_callContract", {
        contract: poolAddress,
        functionName: "delegate-stx",
        functionArgs: [
          uintCV(amount),
          bufferCVFromString(
            serializeCV(
              tupleCV({
                v: uintCV(1),
                c: stringAsciiCV(currency),
                p: listCV(projects.map((p) => principalCV(p.addr))),
                r: listCV(projects.map((p) => uintCV(p.part))),
              })
            )
          ),
        ],
      } as CallContractParams);

      console.log("Stacking transaction broadcast:", response.txid);
      return response.txid;
    } catch (error) {
      console.error("Failed to broadcast stacking transaction:", error);
      return null;
    }
  }

  async revokeStacking(): Promise<string | null> {
    try {
      // This would typically involve calling a contract function to revoke delegation
      // For now, we'll simulate with a simple transfer back
      const response = await request("stx_callContract", {
        contract: "SP000000000000000000002Q6VF78.pox-4",
        functionName: "revoke-delegate-stx",
        functionArgs: [],
      });

      console.log("Revoke stacking transaction broadcast:", response.txid);
      return response.txid;
    } catch (error) {
      console.error("Failed to broadcast revoke transaction:", error);
      return null;
    }
  }

  isWalletConnected(): boolean {
    return isConnected();
  }
}

export const walletService = new WalletService();
