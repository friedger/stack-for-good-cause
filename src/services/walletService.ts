
import { connect, disconnect, isConnected, getLocalStorage, request } from '@stacks/connect';

export interface WalletInfo {
  stxAddress: string;
  btcAddress?: string;
  isConnected: boolean;
}

class WalletService {
  async connectWallet(): Promise<WalletInfo | null> {
    try {
      const response = await connect();
      console.log('Wallet connected:', response);
      
      const userData = getLocalStorage();
      return {
        stxAddress: userData?.addresses?.stx?.[0]?.address || '',
        btcAddress: userData?.addresses?.btc?.[0]?.address,
        isConnected: true
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }

  disconnectWallet(): void {
    disconnect();
    console.log('Wallet disconnected');
  }

  getWalletInfo(): WalletInfo | null {
    if (!isConnected()) {
      return { stxAddress: '', isConnected: false };
    }

    const userData = getLocalStorage();
    if (!userData?.addresses?.stx?.[0]?.address) {
      return { stxAddress: '', isConnected: false };
    }

    return {
      stxAddress: userData.addresses.stx[0].address,
      btcAddress: userData.addresses.btc?.[0]?.address,
      isConnected: true
    };
  }

  async stackStx(amount: string, poolAddress: string): Promise<string | null> {
    try {
      const response = await request('stx_transferStx', {
        recipient: poolAddress,
        amount: (parseFloat(amount) * 1000000).toString(), // Convert to micro-STX
        memo: 'Fast Pool Stacking',
      });

      console.log('Stacking transaction broadcast:', response.txId);
      return response.txId;
    } catch (error) {
      console.error('Failed to broadcast stacking transaction:', error);
      return null;
    }
  }

  async revokeStacking(): Promise<string | null> {
    try {
      // This would typically involve calling a contract function to revoke delegation
      // For now, we'll simulate with a simple transfer back
      const response = await request('stx_transferStx', {
        recipient: 'SP000000000000000000002Q6VF78', // Burn address for simulation
        amount: '1', // Minimal amount for revoke transaction
        memo: 'Revoke Fast Pool Stacking',
      });

      console.log('Revoke stacking transaction broadcast:', response.txId);
      return response.txId;
    } catch (error) {
      console.error('Failed to broadcast revoke transaction:', error);
      return null;
    }
  }

  isWalletConnected(): boolean {
    return isConnected();
  }
}

export const walletService = new WalletService();
