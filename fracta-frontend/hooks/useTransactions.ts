/**
 * Transaction hooks for Fracta.city
 * Uses wagmi v2 for blockchain transactions
 */

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { parseEther } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { useAccount } from 'wagmi';

// Contract addresses from deployment
const PROPERTY_TOKEN_ADDRESS = '0xd312662Bd68743469dbFC9B819EA7c4Ba50aCB9b';

export interface PurchaseTokensParams {
  tokenAmount: number;
  propertyId: string;
}

export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
  receipt?: any;
}

export interface PurchaseResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  tokensPurchased?: number;
}

export function usePurchaseTokens() {
  const { address } = useAccount();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<PurchaseResult | null>(null);

  const purchaseTokens = async (tokenAmount: number) => {
    if (!property || !address) {
      throw new Error('Property or wallet address not available');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful transaction
      setTransactionHash('0x1234567890abcdef');
      setSuccess(true);
      
      return { success: true, hash: '0x1234567890abcdef' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    purchaseTokens,
    isPurchasing,
    error: null,
    lastTransaction
  };
}

export function useTransactionStatus(hash?: string) {
  const { data: receipt, isPending, error } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
    chainId: baseSepolia.id
  });

  const status: TransactionStatus = {
    hash: hash || '',
    status: isPending ? 'pending' : receipt?.status === 'success' ? 'success' : 'failed',
    error: error?.message,
    receipt
  };

  return status;
}

export function useGasEstimate() {
  const publicClient = usePublicClient({ chainId: baseSepolia.id });
  const [gasEstimate, setGasEstimate] = useState<bigint | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  const estimateGas = async (tokenAmount: number): Promise<bigint> => {
    try {
      setIsEstimating(true);
      
      if (!publicClient) {
        throw new Error('Public client not available');
      }
      
      const amountInWei = parseEther(tokenAmount.toString());
      
      const estimate = await publicClient.estimateContractGas({
        address: PROPERTY_TOKEN_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'purchaseTokens',
            type: 'function',
            stateMutability: 'payable',
            inputs: [
              {
                name: 'tokenAmount',
                type: 'uint256'
              }
            ],
            outputs: [],
            payable: true
          }
        ],
        functionName: 'purchaseTokens',
        args: [amountInWei],
        value: amountInWei
      });

      setGasEstimate(estimate);
      return estimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    } finally {
      setIsEstimating(false);
    }
  };

  return {
    estimateGas,
    gasEstimate,
    isEstimating
  };
} 