'use client';

import React, { useState } from 'react';
import { X, DollarSign, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { usePurchaseTokens, useGasEstimate } from '@/hooks/useTransactions';
import { useCanInvest } from '@/hooks/useBlockchain';
import { BlockchainProperty } from '@/lib/blockchain';

interface PurchaseModalProps {
  property: BlockchainProperty;
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ property, isOpen, onClose }: PurchaseModalProps) {
  const [tokenAmount, setTokenAmount] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { canInvest, reason, requiresKYC } = useCanInvest(property);
  const { purchaseTokens, loading } = usePurchaseTokens(property);

  const handlePurchase = async () => {
    if (!canInvest) {
      setError(reason);
      return;
    }

    try {
      setIsPurchasing(true);
      setError(null);
      
      const result = await purchaseTokens(tokenAmount);
      
      if (result.success && result.hash) {
        setTransactionHash(result.hash);
        setSuccess(true);
      } else {
        setError('Transaction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalCost = tokenAmount * property.tokenPrice;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Purchase Tokens</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Property Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{property.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-text-muted">
            <span>Token Price: {formatPrice(property.tokenPrice)}</span>
            <span>Available: {property.tokensRemaining}</span>
          </div>
        </div>

        {/* Investment Check */}
        {!canInvest && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Cannot Invest</span>
            </div>
            <p className="text-red-300 mt-2">{reason}</p>
            {requiresKYC && (
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/kyc';
                }}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Complete KYC
              </button>
            )}
          </div>
        )}

        {/* Purchase Form */}
        {canInvest && !success && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Number of Tokens
              </label>
              <input
                type="number"
                min="1"
                max={property.tokensRemaining}
                value={tokenAmount}
                onChange={(e) => setTokenAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>

            <div className="bg-bg-primary/30 rounded-lg p-4 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-muted">Total Cost:</span>
                <span className="text-xl font-bold text-accent-primary">{formatPrice(totalCost)}</span>
              </div>
              <div className="text-sm text-text-muted">
                {tokenAmount} tokens × {formatPrice(property.tokenPrice)} each
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={isPurchasing || loading}
              className="w-full bg-gradient-primary hover:shadow-button text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 ease-smooth transform hover:-translate-y-1 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isPurchasing || loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5" />
                  <span>Purchase Tokens</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Purchase Successful!</h3>
            <p className="text-text-muted mb-4">
              Your tokens have been purchased successfully.
            </p>
            {transactionHash && (
              <div className="bg-bg-primary/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-text-muted mb-1">Transaction Hash:</p>
                <p className="text-xs text-accent-primary font-mono break-all">{transactionHash}</p>
              </div>
            )}
            <button
              onClick={onClose}
              className="bg-gradient-primary hover:shadow-button text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-smooth transform hover:-translate-y-1"
            >
              Close
            </button>
          </div>
        )}

        {/* Error State */}
        {error && !success && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error</span>
            </div>
            <p className="text-red-300 mt-2">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 