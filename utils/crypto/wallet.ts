import * as bip39 from "bip39";
import { ethers } from "ethers";
import "react-native-get-random-values";
import "@ethersproject/shims";
import * as bitcoin from "bitcoinjs-lib";
import * as SecureStore from "expo-secure-store";
import { NetworkConfig, findNetworkByName } from "./constants";

// Initialize crypto-related polyfills
import "react-native-get-random-values";

// Wallet types
export interface WalletInfo {
  id: string;
  name: string;
  type: "multi-coin" | "bitcoin" | "ethereum";
  networks: string[];
  addresses: Record<string, string>;
  balances: Record<string, string>;
  isDefault?: boolean;
  lastBackup?: string;
  createdAt: number;
}

export interface WalletCredentials {
  seedPhrase: string;
  password: string;
}

// Secure storage keys
const WALLETS_STORAGE_KEY = "secure_wallets";
const CREDENTIALS_STORAGE_KEY = "secure_credentials";

// Generate a new seed phrase
export const generateSeedPhrase = (): string => {
  return bip39.generateMnemonic(256); // 24 words for maximum security
};

// Validate a seed phrase
export const validateSeedPhrase = (seedPhrase: string): boolean => {
  return bip39.validateMnemonic(seedPhrase);
};

// Create a new wallet
export const createWallet = async (
  name: string,
  type: "multi-coin" | "bitcoin" | "ethereum",
  seedPhrase: string,
  password: string,
  networks: NetworkConfig[],
): Promise<WalletInfo> => {
  // Generate wallet ID
  const id = `wallet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Generate addresses for each network
  const addresses: Record<string, string> = {};
  const balances: Record<string, string> = {};

  // Create wallet for each network
  for (const network of networks) {
    if (
      type === "multi-coin" ||
      (type === "ethereum" && network.chainId) ||
      (type === "bitcoin" && !network.chainId)
    ) {
      const address = await generateAddressForNetwork(seedPhrase, network);
      addresses[network.name] = address;
      balances[network.name] = "0";
    }
  }

  // Create wallet info
  const walletInfo: WalletInfo = {
    id,
    name,
    type,
    networks: networks.map((n) => n.name),
    addresses,
    balances,
    isDefault: false,
    lastBackup: new Date().toISOString().split("T")[0],
    createdAt: Date.now(),
  };

  // Save wallet info
  await saveWallet(walletInfo);

  // Save credentials securely
  await saveWalletCredentials(id, { seedPhrase, password });

  return walletInfo;
};

// Generate address for a specific network
export const generateAddressForNetwork = async (
  seedPhrase: string,
  network: NetworkConfig,
): Promise<string> => {
  if (network.chainId) {
    // Ethereum-based network
    const wallet = ethers.Wallet.fromMnemonic(seedPhrase);
    return wallet.address;
  } else {
    // Bitcoin network
    const seed = await bip39.mnemonicToSeed(seedPhrase);
    const root = bitcoin.bip32.fromSeed(
      seed,
      network.isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
    );
    const account = root.derivePath("m/44'/0'/0'/0/0");
    const { address } = bitcoin.payments.p2pkh({
      pubkey: account.publicKey,
      network: network.isTestnet
        ? bitcoin.networks.testnet
        : bitcoin.networks.bitcoin,
    });
    return address || "";
  }
};

// Save wallet info
export const saveWallet = async (wallet: WalletInfo): Promise<void> => {
  try {
    // Get existing wallets
    const wallets = await getWallets();

    // Check if this is the first wallet
    if (wallets.length === 0) {
      wallet.isDefault = true;
    }

    // Add or update wallet
    const existingIndex = wallets.findIndex((w) => w.id === wallet.id);
    if (existingIndex >= 0) {
      wallets[existingIndex] = wallet;
    } else {
      wallets.push(wallet);
    }

    // Save wallets
    await SecureStore.setItemAsync(
      WALLETS_STORAGE_KEY,
      JSON.stringify(wallets),
    );
  } catch (error) {
    console.error("Error saving wallet:", error);
    throw new Error("Failed to save wallet");
  }
};

// Get all wallets
export const getWallets = async (): Promise<WalletInfo[]> => {
  try {
    const walletsJson = await SecureStore.getItemAsync(WALLETS_STORAGE_KEY);
    return walletsJson ? JSON.parse(walletsJson) : [];
  } catch (error) {
    console.error("Error getting wallets:", error);
    return [];
  }
};

// Get wallet by ID
export const getWalletById = async (id: string): Promise<WalletInfo | null> => {
  const wallets = await getWallets();
  return wallets.find((wallet) => wallet.id === id) || null;
};

// Delete wallet
export const deleteWallet = async (id: string): Promise<void> => {
  try {
    // Get existing wallets
    const wallets = await getWallets();

    // Find wallet index
    const walletIndex = wallets.findIndex((wallet) => wallet.id === id);
    if (walletIndex < 0) {
      throw new Error("Wallet not found");
    }

    // Check if it's the default wallet
    const isDefault = wallets[walletIndex].isDefault;

    // Remove wallet
    wallets.splice(walletIndex, 1);

    // If it was the default wallet, set a new default
    if (isDefault && wallets.length > 0) {
      wallets[0].isDefault = true;
    }

    // Save wallets
    await SecureStore.setItemAsync(
      WALLETS_STORAGE_KEY,
      JSON.stringify(wallets),
    );

    // Remove credentials
    await SecureStore.deleteItemAsync(`${CREDENTIALS_STORAGE_KEY}_${id}`);
  } catch (error) {
    console.error("Error deleting wallet:", error);
    throw new Error("Failed to delete wallet");
  }
};

// Save wallet credentials
export const saveWalletCredentials = async (
  walletId: string,
  credentials: WalletCredentials,
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      `${CREDENTIALS_STORAGE_KEY}_${walletId}`,
      JSON.stringify(credentials),
    );
  } catch (error) {
    console.error("Error saving wallet credentials:", error);
    throw new Error("Failed to save wallet credentials");
  }
};

// Get wallet credentials
export const getWalletCredentials = async (
  walletId: string,
): Promise<WalletCredentials | null> => {
  try {
    const credentialsJson = await SecureStore.getItemAsync(
      `${CREDENTIALS_STORAGE_KEY}_${walletId}`,
    );
    return credentialsJson ? JSON.parse(credentialsJson) : null;
  } catch (error) {
    console.error("Error getting wallet credentials:", error);
    return null;
  }
};

// Set default wallet
export const setDefaultWallet = async (id: string): Promise<void> => {
  try {
    // Get existing wallets
    const wallets = await getWallets();

    // Update default status
    wallets.forEach((wallet) => {
      wallet.isDefault = wallet.id === id;
    });

    // Save wallets
    await SecureStore.setItemAsync(
      WALLETS_STORAGE_KEY,
      JSON.stringify(wallets),
    );
  } catch (error) {
    console.error("Error setting default wallet:", error);
    throw new Error("Failed to set default wallet");
  }
};

// Get default wallet
export const getDefaultWallet = async (): Promise<WalletInfo | null> => {
  const wallets = await getWallets();
  return (
    wallets.find((wallet) => wallet.isDefault) ||
    (wallets.length > 0 ? wallets[0] : null)
  );
};

// Update wallet balances
export const updateWalletBalances = async (
  walletId: string,
): Promise<WalletInfo | null> => {
  try {
    // Get wallet
    const wallet = await getWalletById(walletId);
    if (!wallet) return null;

    // Update balances for each network
    for (const networkName of wallet.networks) {
      const network = findNetworkByName(networkName);
      if (!network) continue;

      const address = wallet.addresses[networkName];
      if (!address) continue;

      // Fetch balance
      const balance = await fetchBalanceForAddress(address, network);
      wallet.balances[networkName] = balance;
    }

    // Save updated wallet
    await saveWallet(wallet);

    return wallet;
  } catch (error) {
    console.error("Error updating wallet balances:", error);
    return null;
  }
};

// Fetch balance for address
export const fetchBalanceForAddress = async (
  address: string,
  network: NetworkConfig,
): Promise<string> => {
  try {
    if (network.chainId) {
      // Ethereum-based network
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } else {
      // Bitcoin network - using a public API
      const response = await fetch(`${network.rpcUrl}/address/${address}`);
      const data = await response.json();
      // Convert satoshis to BTC
      return (
        (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) /
          100000000 +
        ""
      );
    }
  } catch (error) {
    console.error(`Error fetching balance for ${network.name}:`, error);
    return "0";
  }
};

// Send transaction
export const sendTransaction = async (
  walletId: string,
  networkName: string,
  toAddress: string,
  amount: string,
  password: string,
): Promise<string> => {
  try {
    // Get wallet and credentials
    const wallet = await getWalletById(walletId);
    if (!wallet) throw new Error("Wallet not found");

    const credentials = await getWalletCredentials(walletId);
    if (!credentials) throw new Error("Wallet credentials not found");

    // Verify password
    if (credentials.password !== password) {
      throw new Error("Invalid password");
    }

    // Get network
    const network = findNetworkByName(networkName);
    if (!network) throw new Error("Network not found");

    // Get from address
    const fromAddress = wallet.addresses[networkName];
    if (!fromAddress) throw new Error("Address not found for this network");

    // Send transaction based on network type
    let txHash: string;

    if (network.chainId) {
      // Ethereum-based transaction
      txHash = await sendEthereumTransaction(
        credentials.seedPhrase,
        network,
        toAddress,
        amount,
      );
    } else {
      // Bitcoin transaction
      txHash = await sendBitcoinTransaction(
        credentials.seedPhrase,
        network,
        fromAddress,
        toAddress,
        amount,
      );
    }

    // Update balances after transaction
    await updateWalletBalances(walletId);

    return txHash;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};

// Send Ethereum transaction
export const sendEthereumTransaction = async (
  seedPhrase: string,
  network: NetworkConfig,
  toAddress: string,
  amount: string,
): Promise<string> => {
  try {
    // Create provider
    const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);

    // Create wallet
    const wallet = ethers.Wallet.fromMnemonic(seedPhrase).connect(provider);

    // Create transaction
    const tx = {
      to: toAddress,
      value: ethers.utils.parseEther(amount),
    };

    // Send transaction
    const transaction = await wallet.sendTransaction(tx);

    // Wait for transaction to be mined
    await transaction.wait();

    return transaction.hash;
  } catch (error) {
    console.error("Error sending Ethereum transaction:", error);
    throw error;
  }
};

// Send Bitcoin transaction (simplified - in a real app, you'd use UTXO management)
export const sendBitcoinTransaction = async (
  seedPhrase: string,
  network: NetworkConfig,
  fromAddress: string,
  toAddress: string,
  amount: string,
): Promise<string> => {
  // Note: This is a simplified implementation
  // In a real app, you would need to:
  // 1. Fetch UTXOs for the address
  // 2. Create inputs from UTXOs
  // 3. Create outputs (recipient + change)
  // 4. Sign the transaction
  // 5. Broadcast the transaction

  // For this example, we'll just return a mock transaction hash
  // as implementing a full Bitcoin transaction requires more complex UTXO handling
  return `mock_btc_tx_${Date.now()}`;
};

// Add network to wallet
export const addNetworkToWallet = async (
  walletId: string,
  networkName: string,
): Promise<WalletInfo | null> => {
  try {
    // Get wallet and credentials
    const wallet = await getWalletById(walletId);
    if (!wallet) return null;

    const credentials = await getWalletCredentials(walletId);
    if (!credentials) return null;

    // Get network
    const network = findNetworkByName(networkName);
    if (!network) return null;

    // Check if network is already added
    if (wallet.networks.includes(networkName)) {
      return wallet;
    }

    // Generate address for network
    const address = await generateAddressForNetwork(
      credentials.seedPhrase,
      network,
    );

    // Update wallet
    wallet.networks.push(networkName);
    wallet.addresses[networkName] = address;
    wallet.balances[networkName] = "0";

    // Save wallet
    await saveWallet(wallet);

    return wallet;
  } catch (error) {
    console.error("Error adding network to wallet:", error);
    return null;
  }
};

// Remove network from wallet
export const removeNetworkFromWallet = async (
  walletId: string,
  networkName: string,
): Promise<WalletInfo | null> => {
  try {
    // Get wallet
    const wallet = await getWalletById(walletId);
    if (!wallet) return null;

    // Check if network exists
    const networkIndex = wallet.networks.indexOf(networkName);
    if (networkIndex < 0) return wallet;

    // Remove network
    wallet.networks.splice(networkIndex, 1);
    delete wallet.addresses[networkName];
    delete wallet.balances[networkName];

    // Save wallet
    await saveWallet(wallet);

    return wallet;
  } catch (error) {
    console.error("Error removing network from wallet:", error);
    return null;
  }
};
