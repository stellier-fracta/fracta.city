'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export function WalletConnectFallback() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card p-8 rounded-2xl border border-white/10 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Wallet Connection Unavailable
        </h2>
        <p className="text-gray-300 mb-6">
          WalletConnect is not properly configured. Please check your environment variables and try again.
        </p>
        <div className="text-sm text-gray-400 bg-black/20 p-4 rounded-lg">
          <p>Required environment variable:</p>
          <code className="text-yellow-400">NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID</code>
        </div>
      </div>
    </div>
  );
} 