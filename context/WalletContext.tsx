import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import {
  WalletInfo,
  getWallets,
  getDefaultWallet,
  createWallet,
  deleteWallet,
  setDefaultWallet,
  updateWalletBalances,
  sendTransaction,
  addNetworkToWallet,
  removeNetworkFromWallet,
  generateSeedPhrase,
  validateSeedPhrase,
} from "../utils/crypto/wallet";
import {
  NetworkConfig,
  getAllNetworks,
  findNetworkByName,
} from "../utils/crypto/constants";

// Authentication state key
const AUTH_STATE_KEY = "isAuthenticated";
const HAS_WALLET_KEY = "hasWallet";

interface WalletContextType {
  wallets: WalletInfo[];
  currentWallet: WalletInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasWallet: boolean;
  networks: NetworkConfig[];
  createNewWallet: (
    name: string,
    type: "multi-coin" | "bitcoin" | "ethereum",
    seedPhrase: string,
    password: string,
    networks: NetworkConfig[],
  ) => Promise<WalletInfo>;
  importWallet: (
    name: string,
    seedPhrase: string,
    password: string,
  ) => Promise<WalletInfo>;
  removeWallet: (id: string) => Promise<void>;
  setAsDefaultWallet: (id: string) => Promise<void>;
  refreshWalletBalances: (id?: string) => Promise<void>;
  sendCrypto: (
    walletId: string,
    networkName: string,
    toAddress: string,
    amount: string,
    password: string,
  ) => Promise<string>;
  addNetwork: (
    walletId: string,
    networkName: string,
  ) => Promise<WalletInfo | null>;
  removeNetwork: (
    walletId: string,
    networkName: string,
  ) => Promise<WalletInfo | null>;
  setAuthenticated: (value: boolean) => Promise<void>;
  logout: () => Promise<void>;
  generateNewSeedPhrase: () => string;
  validateSeedPhraseFormat: (phrase: string) => boolean;
  selectWallet: (id: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [currentWallet, setCurrentWallet] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [networks] = useState<NetworkConfig[]>(getAllNetworks());

  // Initialize wallet context
  useEffect(() => {
    const initWalletContext = async () => {
      try {
        // Check authentication state
        const authState = await SecureStore.getItemAsync(AUTH_STATE_KEY);
        const walletState = await SecureStore.getItemAsync(HAS_WALLET_KEY);

        setIsAuthenticated(authState === "true");
        setHasWallet(walletState === "true");

        // Load wallets if authenticated
        if (authState === "true") {
          const loadedWallets = await getWallets();
          setWallets(loadedWallets);

          // Set current wallet to default or first wallet
          const defaultWallet = await getDefaultWallet();
          if (defaultWallet) {
            setCurrentWallet(defaultWallet);
          } else if (loadedWallets.length > 0) {
            setCurrentWallet(loadedWallets[0]);
          }
        }
      } catch (error) {
        console.error("Error initializing wallet context:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initWalletContext();
  }, []);

  // Create a new wallet
  const createNewWallet = async (
    name: string,
    type: "multi-coin" | "bitcoin" | "ethereum",
    seedPhrase: string,
    password: string,
    selectedNetworks: NetworkConfig[],
  ): Promise<WalletInfo> => {
    try {
      setIsLoading(true);

      // Create wallet
      const wallet = await createWallet(
        name,
        type,
        seedPhrase,
        password,
        selectedNetworks,
      );

      // Update state
      setWallets((prev) => [...prev, wallet]);
      if (!currentWallet) {
        setCurrentWallet(wallet);
      }

      // Set wallet state
      await SecureStore.setItemAsync(HAS_WALLET_KEY, "true");
      setHasWallet(true);

      return wallet;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Import an existing wallet
  const importWallet = async (
    name: string,
    seedPhrase: string,
    password: string,
  ): Promise<WalletInfo> => {
    try {
      setIsLoading(true);

      // Validate seed phrase
      if (!validateSeedPhrase(seedPhrase)) {
        throw new Error("Invalid seed phrase");
      }

      // Create multi-coin wallet with all networks
      const wallet = await createWallet(
        name,
        "multi-coin",
        seedPhrase,
        password,
        networks,
      );

      // Update state
      setWallets((prev) => [...prev, wallet]);
      if (!currentWallet) {
        setCurrentWallet(wallet);
      }

      // Set wallet state
      await SecureStore.setItemAsync(HAS_WALLET_KEY, "true");
      setHasWallet(true);

      return wallet;
    } catch (error) {
      console.error("Error importing wallet:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a wallet
  const removeWallet = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);

      // Delete wallet
      await deleteWallet(id);

      // Update state
      const updatedWallets = wallets.filter((wallet) => wallet.id !== id);
      setWallets(updatedWallets);

      // Update current wallet if needed
      if (currentWallet?.id === id) {
        const defaultWallet =
          updatedWallets.find((wallet) => wallet.isDefault) ||
          updatedWallets[0] ||
          null;
        setCurrentWallet(defaultWallet);
      }

      // Update wallet state if no wallets left
      if (updatedWallets.length === 0) {
        await SecureStore.setItemAsync(HAS_WALLET_KEY, "false");
        setHasWallet(false);
      }
    } catch (error) {
      console.error("Error removing wallet:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Set a wallet as default
  const setAsDefaultWallet = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);

      // Set default wallet
      await setDefaultWallet(id);

      // Update state
      const updatedWallets = wallets.map((wallet) => ({
        ...wallet,
        isDefault: wallet.id === id,
      }));
      setWallets(updatedWallets);

      // Update current wallet if needed
      const newDefaultWallet =
        updatedWallets.find((wallet) => wallet.id === id) || null;
      if (newDefaultWallet) {
        setCurrentWallet(newDefaultWallet);
      }
    } catch (error) {
      console.error("Error setting default wallet:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh wallet balances
  const refreshWalletBalances = async (id?: string): Promise<void> => {
    try {
      setIsLoading(true);

      if (id) {
        // Update specific wallet
        const updatedWallet = await updateWalletBalances(id);
        if (updatedWallet) {
          setWallets((prev) =>
            prev.map((wallet) => (wallet.id === id ? updatedWallet : wallet)),
          );
          if (currentWallet?.id === id) {
            setCurrentWallet(updatedWallet);
          }
        }
      } else {
        // Update all wallets
        const updatedWallets = [];
        for (const wallet of wallets) {
          const updatedWallet = await updateWalletBalances(wallet.id);
          if (updatedWallet) {
            updatedWallets.push(updatedWallet);
          } else {
            updatedWallets.push(wallet);
          }
        }
        setWallets(updatedWallets);

        // Update current wallet
        if (currentWallet) {
          const updatedCurrentWallet =
            updatedWallets.find((wallet) => wallet.id === currentWallet.id) ||
            null;
          setCurrentWallet(updatedCurrentWallet);
        }
      }
    } catch (error) {
      console.error("Error refreshing wallet balances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send cryptocurrency
  const sendCrypto = async (
    walletId: string,
    networkName: string,
    toAddress: string,
    amount: string,
    password: string,
  ): Promise<string> => {
    try {
      setIsLoading(true);

      // Send transaction
      const txHash = await sendTransaction(
        walletId,
        networkName,
        toAddress,
        amount,
        password,
      );

      // Refresh wallet balances
      await refreshWalletBalances(walletId);

      return txHash;
    } catch (error) {
      console.error("Error sending cryptocurrency:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add network to wallet
  const addNetwork = async (
    walletId: string,
    networkName: string,
  ): Promise<WalletInfo | null> => {
    try {
      setIsLoading(true);

      // Add network
      const updatedWallet = await addNetworkToWallet(walletId, networkName);

      // Update state
      if (updatedWallet) {
        setWallets((prev) =>
          prev.map((wallet) =>
            wallet.id === walletId ? updatedWallet : wallet,
          ),
        );
        if (currentWallet?.id === walletId) {
          setCurrentWallet(updatedWallet);
        }
      }

      return updatedWallet;
    } catch (error) {
      console.error("Error adding network to wallet:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove network from wallet
  const removeNetwork = async (
    walletId: string,
    networkName: string,
  ): Promise<WalletInfo | null> => {
    try {
      setIsLoading(true);

      // Remove network
      const updatedWallet = await removeNetworkFromWallet(
        walletId,
        networkName,
      );

      // Update state
      if (updatedWallet) {
        setWallets((prev) =>
          prev.map((wallet) =>
            wallet.id === walletId ? updatedWallet : wallet,
          ),
        );
        if (currentWallet?.id === walletId) {
          setCurrentWallet(updatedWallet);
        }
      }

      return updatedWallet;
    } catch (error) {
      console.error("Error removing network from wallet:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Set authenticated state
  const setAuthenticated = async (value: boolean): Promise<void> => {
    try {
      await SecureStore.setItemAsync(AUTH_STATE_KEY, value ? "true" : "false");
      setIsAuthenticated(value);

      // Load wallets if authenticated
      if (value) {
        const loadedWallets = await getWallets();
        setWallets(loadedWallets);

        // Set current wallet to default or first wallet
        const defaultWallet = await getDefaultWallet();
        if (defaultWallet) {
          setCurrentWallet(defaultWallet);
        } else if (loadedWallets.length > 0) {
          setCurrentWallet(loadedWallets[0]);
        }
      }
    } catch (error) {
      console.error("Error setting authenticated state:", error);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await SecureStore.setItemAsync(AUTH_STATE_KEY, "false");
      setIsAuthenticated(false);
      setCurrentWallet(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Generate new seed phrase
  const generateNewSeedPhrase = (): string => {
    return generateSeedPhrase();
  };

  // Validate seed phrase format
  const validateSeedPhraseFormat = (phrase: string): boolean => {
    return validateSeedPhrase(phrase);
  };

  // Select a wallet
  const selectWallet = (id: string): void => {
    const wallet = wallets.find((w) => w.id === id) || null;
    setCurrentWallet(wallet);
  };

  const contextValue: WalletContextType = {
    wallets,
    currentWallet,
    isLoading,
    isAuthenticated,
    hasWallet,
    networks,
    createNewWallet,
    importWallet,
    removeWallet,
    setAsDefaultWallet,
    refreshWalletBalances,
    sendCrypto,
    addNetwork,
    removeNetwork,
    setAuthenticated,
    logout,
    generateNewSeedPhrase,
    validateSeedPhraseFormat,
    selectWallet,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
