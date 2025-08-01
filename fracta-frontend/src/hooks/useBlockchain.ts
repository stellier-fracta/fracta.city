/**
 * React hooks for blockchain data in Fracta.city
 * Provides real-time contract data with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { 
  blockchainService, 
  BlockchainProperty, 
  NetworkInfo, 
  UserKYCStatus,
  isSaleActive
} from '../lib/blockchain';



/**
 * Hook to automatically switch to Base Sepolia when wallet connects
 */
export function useAutoNetworkSwitch() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const addBaseSepoliaNetwork = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        console.log('Attempting to add Base Sepolia network to wallet...');
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x14a33', // 84532 in hex
            chainName: 'Base Sepolia',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org'],
            iconUrls: ['https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/Base_Network_Logo.svg']
          }]
        });
        console.log('Base Sepolia network added successfully');
      } catch (error) {
        console.error('Failed to add Base Sepolia network:', error);
        // If user rejects, show a message
        if ((error as any)?.code === 4001) {
          console.log('User rejected adding Base Sepolia network');
        }
      }
    }
  };

  const switchToBaseSepolia = async () => {
    try {
      console.log(`Attempting to switch from chain ${chainId} to Base Sepolia (${baseSepolia.id})`);
      await switchChain({ chainId: baseSepolia.id });
      console.log('Successfully switched to Base Sepolia');
    } catch (error) {
      console.log('Failed to switch chain, attempting to add network:', error);
      // If switching fails (usually because network doesn't exist), try to add the network
      await addBaseSepoliaNetwork();
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      if (chainId !== baseSepolia.id) {
        console.log(`Wallet connected but on wrong network. Current: ${chainId}, Target: ${baseSepolia.id}`);
        // Use setTimeout to ensure the wallet is fully connected before attempting to switch
        const timer = setTimeout(() => {
          switchToBaseSepolia();
        }, 1000);
        
        return () => clearTimeout(timer);
      } else {
        console.log('Wallet connected and on correct network (Base Sepolia)');
      }
    }
  }, [isConnected, address, chainId]);

  return {
    isCorrectNetwork: chainId === baseSepolia.id,
    isSwitching: isPending,
    currentChainId: chainId,
    targetChainId: baseSepolia.id,
    addNetwork: addBaseSepoliaNetwork,
    switchNetwork: switchToBaseSepolia
  };
}

/**
 * Hook to fetch Duna Studio property data from blockchain
 */
export function useDunaStudioProperty() {
  const [property, setProperty] = useState<BlockchainProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await blockchainService.getDunaStudioProperty();
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property data');
      console.error('Error fetching Duna Studio property:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty
  };
}

/**
 * Hook to fetch all live properties (blockchain + mock)
 */
export function useLiveProperties() {
  const [properties, setProperties] = useState<BlockchainProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await blockchainService.getAllLiveProperties();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      console.error('Error fetching live properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties
  };
}

/**
 * Hook to get blockchain network status
 */
export function useNetworkStatus() {
  const [network, setNetwork] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworkStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await blockchainService.getNetworkStatus();
      setNetwork(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch network status');
      console.error('Error fetching network status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworkStatus();
  }, [fetchNetworkStatus]);

  return {
    network,
    loading,
    error,
    refetch: fetchNetworkStatus
  };
}

/**
 * Hook to get user KYC status from blockchain
 */
export function useUserKYC() {
  const { address } = useAccount();
  const [kycStatus, setKycStatus] = useState<UserKYCStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKYCStatus = useCallback(async (walletAddress?: string) => {
    const addressToCheck = walletAddress || address;
    
    if (!addressToCheck) {
      setKycStatus(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await blockchainService.getUserKYCStatus(addressToCheck);
      setKycStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch KYC status');
      console.error('Error fetching KYC status:', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchKYCStatus();
    } else {
      setKycStatus(null);
      setLoading(false);
    }
  }, [address, fetchKYCStatus]);

  return {
    kycStatus,
    loading,
    error,
    refetch: fetchKYCStatus,
    hasValidKYC: kycStatus?.kyc_valid || false,
    hasProspectsPermit: kycStatus?.has_prospera_permit || false
  };
}

/**
 * Hook to get user token balance from blockchain
 */
export function useUserTokenBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async (walletAddress?: string) => {
    const addressToCheck = walletAddress || address;
    
    if (!addressToCheck) {
      setBalance(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await blockchainService.getUserTokenBalance(addressToCheck);
      setBalance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch token balance');
      console.error('Error fetching token balance:', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchBalance();
    } else {
      setBalance(0);
      setLoading(false);
    }
  }, [address, fetchBalance]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
    hasTokens: balance > 0
  };
}

/**
 * Hook for real-time blockchain stats (used in Hero component)
 */
export function useBlockchainStats() {
  const { properties, loading: propertiesLoading } = useLiveProperties();
  const { network, loading: networkLoading } = useNetworkStatus();

  const stats = {
    totalProperties: properties.length,
    liveProperties: properties.filter(p => p.status === 'live').length,
    totalValueLocked: properties.reduce((sum, p) => sum + (p.fullPrice * p.tokensSold / p.totalTokens), 0),
    totalTokensSold: properties.reduce((sum, p) => sum + p.tokensSold, 0),
    networkConnected: network?.connected || false,
    chainId: network?.chain_id || 0
  };

  return {
    stats,
    loading: propertiesLoading || networkLoading,
    properties,
    network
  };
}

/**
 * Hook to check if user can invest in a specific property
 */
export function useCanInvest(property: BlockchainProperty | null) {
  const { kycStatus, hasValidKYC, hasProspectsPermit } = useUserKYC();
  const { address } = useAccount();

  if (!property) {
    return {
      canInvest: false,
      reason: 'Property not found',
      requiresKYC: false
    };
  }

  // For testing, allow investment if wallet is connected
  if (!address) {
      return {
        canInvest: false,
      reason: 'Wallet not connected',
      requiresKYC: false
      };
  }

  // Check property status
  if (property.status !== 'live') {
    return {
      canInvest: false,
      reason: `Property is ${property.status}`,
      requiresKYC: false
    };
  }

  // Check if tokens available
  if (property.tokensRemaining <= 0) {
    return {
      canInvest: false,
      reason: 'No tokens available',
      requiresKYC: false
    };
  }

  // Check if sale is active
  if (!isSaleActive(property)) {
    return {
      canInvest: false,
      reason: 'Token sale is not active',
      requiresKYC: false
    };
  }

  // For testing, allow investment if KYC is valid or if we're in development
  if (property.kycRequired === 'prospera-permit') {
    if (!hasValidKYC && !hasProspectsPermit) {
      return {
        canInvest: false,
        reason: 'Prospera permit required for this property',
        requiresKYC: true
      };
    }
  }

  return {
    canInvest: true,
    reason: '',
    requiresKYC: false
  };
} 