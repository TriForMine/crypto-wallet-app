// Network definitions for supported blockchains

export interface NetworkConfig {
  name: string;
  symbol: string;
  chainId?: number; // For EVM chains
  rpcUrl?: string;
  blockExplorerUrl?: string;
  isTestnet?: boolean;
  decimals: number;
  logoUrl?: string;
}

export interface NetworkGroup {
  name: string;
  networks: NetworkConfig[];
  type: "bitcoin" | "ethereum";
  defaultNetwork: string;
}

// Ethereum networks
export const ETHEREUM_NETWORKS: NetworkConfig[] = [
  {
    name: "Ethereum Mainnet",
    symbol: "ETH",
    chainId: 1,
    rpcUrl: "https://eth.llamarpc.com",
    blockExplorerUrl: "https://etherscan.io",
    isTestnet: false,
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    name: "Sepolia Testnet",
    symbol: "ETH",
    chainId: 11155111,
    rpcUrl: "https://rpc.sepolia.org",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    isTestnet: true,
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    name: "BNB Smart Chain",
    symbol: "BNB",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
    blockExplorerUrl: "https://bscscan.com",
    isTestnet: false,
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    blockExplorerUrl: "https://polygonscan.com",
    isTestnet: false,
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  {
    name: "Arbitrum",
    symbol: "ETH",
    chainId: 42161,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorerUrl: "https://arbiscan.io",
    isTestnet: false,
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  },
  {
    name: "Optimism",
    symbol: "ETH",
    chainId: 10,
    rpcUrl: "https://mainnet.optimism.io",
    blockExplorerUrl: "https://optimistic.etherscan.io",
    isTestnet: false,
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  },
];

// Bitcoin networks
export const BITCOIN_NETWORKS: NetworkConfig[] = [
  {
    name: "Bitcoin Mainnet",
    symbol: "BTC",
    rpcUrl: "https://blockstream.info/api",
    blockExplorerUrl: "https://blockstream.info",
    isTestnet: false,
    decimals: 8,
    logoUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    name: "Bitcoin Testnet",
    symbol: "tBTC",
    rpcUrl: "https://blockstream.info/testnet/api",
    blockExplorerUrl: "https://blockstream.info/testnet",
    isTestnet: true,
    decimals: 8,
    logoUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
];

// Network groups
export const NETWORK_GROUPS: NetworkGroup[] = [
  {
    name: "Ethereum",
    networks: ETHEREUM_NETWORKS,
    type: "ethereum",
    defaultNetwork: "Ethereum Mainnet",
  },
  {
    name: "Bitcoin",
    networks: BITCOIN_NETWORKS,
    type: "bitcoin",
    defaultNetwork: "Bitcoin Mainnet",
  },
];

// Get all networks
export const getAllNetworks = (): NetworkConfig[] => {
  return [...ETHEREUM_NETWORKS, ...BITCOIN_NETWORKS];
};

// Find network by name
export const findNetworkByName = (name: string): NetworkConfig | undefined => {
  return getAllNetworks().find((network) => network.name === name);
};

// Find network by chain ID (for EVM chains)
export const findNetworkByChainId = (
  chainId: number,
): NetworkConfig | undefined => {
  return ETHEREUM_NETWORKS.find((network) => network.chainId === chainId);
};

// Get default networks
export const getDefaultNetworks = (): NetworkConfig[] => {
  return NETWORK_GROUPS.map((group) => {
    return group.networks.find(
      (network) => network.name === group.defaultNetwork,
    )!;
  });
};
