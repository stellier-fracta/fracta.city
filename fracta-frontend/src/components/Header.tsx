'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Building2, Menu, X, User, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useAutoNetworkSwitch } from '@/hooks/useBlockchain';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isConnected } = useAccount();
  const { isCorrectNetwork, isSwitching, currentChainId, addNetwork, switchNetwork } = useAutoNetworkSwitch();

  const handleNetworkAction = async () => {
    if (isCorrectNetwork) return;
    
    try {
      // First try to switch to the network
      await switchNetwork();
    } catch (error) {
      console.log('Switch failed, trying to add network');
      // If switching fails, try to add the network
      try {
        await addNetwork();
      } catch (addError) {
        console.error('Failed to add network:', addError);
        // Show user-friendly error message
        alert('Please manually add Base Sepolia network to your wallet. You can find the network details in your wallet settings.');
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-card/80 backdrop-blur-glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FractaCity</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link href="/kyc" className="text-gray-300 hover:text-white transition-colors">
              KYC
            </Link>
            {isConnected && (
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
            <Link href="/admin/kyc" className="text-gray-300 hover:text-white transition-colors">
              Admin
            </Link>
            
            {/* Network Status */}
            {isConnected && (
              <div className="flex items-center space-x-2">
                {isSwitching ? (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Switching...</span>
                  </div>
                ) : isCorrectNetwork ? (
                  <div className="flex items-center space-x-1 text-green-400">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm">Base Sepolia</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-400">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm">Wrong Network</span>
                    <button 
                      onClick={handleNetworkAction}
                      className="ml-2 px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
                    >
                      Fix Network
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <ConnectButton 
              showBalance={false}
              chainStatus="none"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'avatar',
              }}
            />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/marketplace" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/kyc" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                KYC
              </Link>
              {isConnected && (
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link 
                href="/admin/kyc" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              
              {/* Mobile Network Status */}
              {isConnected && (
                <div className="flex items-center space-x-2 py-2">
                  {isSwitching ? (
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Switching to Base Sepolia...</span>
                    </div>
                  ) : isCorrectNetwork ? (
                    <div className="flex items-center space-x-1 text-green-400">
                      <Wifi className="w-4 h-4" />
                      <span className="text-sm">Connected to Base Sepolia</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-red-400">
                      <WifiOff className="w-4 h-4" />
                      <span className="text-sm">Please switch to Base Sepolia</span>
                      <button 
                        onClick={handleNetworkAction}
                        className="ml-2 px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
                      >
                        Fix Network
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="pt-2">
                <ConnectButton 
                  showBalance={false}
                  chainStatus="none"
                  accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'avatar',
                  }}
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 