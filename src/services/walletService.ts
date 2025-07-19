import { useApiClient } from "@/hooks/useApiClient";
import { poolAddress } from "@/lib/consts";
import { hexToBytes } from "@stacks/common";
import {
  connect,
  disconnect,
  getLocalStorage,
  isConnected,
  request,
} from "@stacks/connect";
import { TransactionResult } from "@stacks/connect/dist/types/methods";
import {
  listCV,
  principalCV,
  serializeCV,
  stringAsciiCV,
  tupleCV,
  uintCV,
  bufferCV,
  noneCV,
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

  isWalletConnected(): boolean {
    return isConnected();
  }

  async allowPox4ContractCaller() {
    const response = await request("stx_callContract", {
      contract: "SP000000000000000000002Q6VF78.pox-4",
      functionName: "allow-contract-caller",
      functionArgs: [principalCV(poolAddress), noneCV()],
    });
    console.log("Stacking transaction broadcast:", response.txid);
    return response.txid;
  }

  async delegateStx(
    amount: number,
    rewardCurrency: "stx" | "sbtc",
    projects: { addr: string; part: number }[] = []
  ): Promise<string | null> {
    const response = await request("stx_callContract", {
      contract: poolAddress,
      functionName: "delegate-stx",
      functionArgs: [
        uintCV(amount),
        bufferCV(
          hexToBytes(
            serializeCV(
              tupleCV({
                v: uintCV(1), // version 1
                c: stringAsciiCV(rewardCurrency), // currency - payout requested in "stx" or "sbtc"
                p: listCV(projects.map((p) => principalCV(p.addr))), // list of prinicpals receiving a share of rewards
                r: listCV(projects.map((p) => uintCV(p.part))), // ratio - list of promille for each participant
              })
            )
          )
        ),
      ],
    });

    console.log("Stacking transaction broadcast:", response);
    return response.txid;
  }

  async revokeStacking(): Promise<string | null> {
    // This would typically involve calling a contract function to revoke delegation
    // For now, we'll simulate with a simple transfer back
    const response = await request("stx_callContract", {
      contract: "SP000000000000000000002Q6VF78.pox-4",
      functionName: "revoke-delegate-stx",
      functionArgs: [],
    });

    console.log("Revoke stacking transaction broadcast:", response.txid);
    return response.txid;
  }
}

export const walletService = new WalletService();

export function userRejectedRequest(error: any): boolean {
  // Check for common user rejection error codes/messages
  if (!error) return false;
  if (typeof error === "object") {
    if (
      error.code === 4001 || // User rejected request
      error.message?.toLowerCase().includes("user rejected") ||
      error.message?.toLowerCase().includes("user denied")
    ) {
      return true;
    }
  }
  if (typeof error === "string") {
    if (
      error.toLowerCase().includes("user rejected") ||
      error.toLowerCase().includes("user denied")
    ) {
      return true;
    }
  }
  return false;
}
