/**
 * Transaction service for Fracta.city frontend
 * Handles blockchain transactions and API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface PurchaseParams {
  propertyId: string;
  tokenAmount: number;
  walletAddress: string;
}

export class TransactionService {
  static async purchaseTokens(params: PurchaseParams): Promise<TransactionResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: params.propertyId,
          token_amount: params.tokenAmount,
          wallet_address: params.walletAddress
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Transaction failed');
      }

      const result = await response.json();
      return {
        success: true,
        transactionHash: result.transaction_hash
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async getTransactionStatus(transactionHash: string): Promise<{
    status: 'pending' | 'success' | 'failed';
    blockNumber?: number;
    gasUsed?: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/status/${transactionHash}`);
      
      if (!response.ok) {
        throw new Error('Failed to get transaction status');
      }

      const result = await response.json();
      return {
        status: result.status,
        blockNumber: result.block_number,
        gasUsed: result.gas_used
      };
    } catch (error) {
      return {
        status: 'failed'
      };
    }
  }
} 