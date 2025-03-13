import { ethers } from "ethers";
import { NetworkConfig } from "./constants";

// Transaction types
export interface Transaction {
  id: string;
  type: "send" | "receive" | "pending";
  status: "confirmed" | "pending" | "failed";
  amount: string;
  amountFiat: string;
  to: string;
  from: string;
  date: string;
  currency: string;
  fee: string;
  feeFiat: string;
  confirmations: number;
  blockHeight: number;
  hash: string;
  memo?: string;
  networkName: string;
}

// Fetch transactions for an address
export const fetchTransactions = async (
  address: string,
  network: NetworkConfig,
): Promise<Transaction[]> => {
  try {
    if (network.chainId) {
      // Ethereum-based network
      return await fetchEthereumTransactions(address, network);
    } else {
      // Bitcoin network
      return await fetchBitcoinTransactions(address, network);
    }
  } catch (error) {
    console.error(`Error fetching transactions for ${network.name}:`, error);
    return [];
  }
};

// Fetch Ethereum transactions
const fetchEthereumTransactions = async (
  address: string,
  network: NetworkConfig,
): Promise<Transaction[]> => {
  try {
    // In a real app, you would use a block explorer API like Etherscan
    // For this example, we'll create mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: `eth_tx_${Date.now()}_1`,
        type: "receive",
        status: "confirmed",
        amount: "0.5",
        amountFiat: "$1,250.00",
        to: address,
        from: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a",
        date: new Date(Date.now() - 86400000 * 2).toLocaleString(), // 2 days ago
        currency: network.symbol,
        fee: "0.0005",
        feeFiat: "$1.25",
        confirmations: 150,
        blockHeight: 16242032,
        hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        networkName: network.name,
      },
      {
        id: `eth_tx_${Date.now()}_2`,
        type: "send",
        status: "confirmed",
        amount: "0.2",
        amountFiat: "$500.00",
        to: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b",
        from: address,
        date: new Date(Date.now() - 86400000).toLocaleString(), // 1 day ago
        currency: network.symbol,
        fee: "0.0005",
        feeFiat: "$1.25",
        confirmations: 80,
        blockHeight: 16242532,
        hash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
        networkName: network.name,
      },
      {
        id: `eth_tx_${Date.now()}_3`,
        type: "send",
        status: "pending",
        amount: "0.1",
        amountFiat: "$250.00",
        to: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c",
        from: address,
        date: new Date().toLocaleString(), // Now
        currency: network.symbol,
        fee: "0.0005",
        feeFiat: "$1.25",
        confirmations: 0,
        blockHeight: 0,
        hash: "0x90abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
        networkName: network.name,
      },
    ];

    return mockTransactions;
  } catch (error) {
    console.error("Error fetching Ethereum transactions:", error);
    return [];
  }
};

// Fetch Bitcoin transactions
const fetchBitcoinTransactions = async (
  address: string,
  network: NetworkConfig,
): Promise<Transaction[]> => {
  try {
    // In a real app, you would use a block explorer API like Blockstream
    // For this example, we'll create mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: `btc_tx_${Date.now()}_1`,
        type: "receive",
        status: "confirmed",
        amount: "0.05",
        amountFiat: "$2,500.00",
        to: address,
        from: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        date: new Date(Date.now() - 86400000 * 3).toLocaleString(), // 3 days ago
        currency: network.symbol,
        fee: "0.0001",
        feeFiat: "$5.00",
        confirmations: 300,
        blockHeight: 800123,
        hash: "6a9013b8684862e9ccfb3c4a1a34126eef4665b1e4a1e8a0eb8a5108e15c61ec",
        networkName: network.name,
      },
      {
        id: `btc_tx_${Date.now()}_2`,
        type: "send",
        status: "confirmed",
        amount: "0.02",
        amountFiat: "$1,000.00",
        to: "bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej",
        from: address,
        date: new Date(Date.now() - 86400000 * 1.5).toLocaleString(), // 1.5 days ago
        currency: network.symbol,
        fee: "0.0001",
        feeFiat: "$5.00",
        confirmations: 150,
        blockHeight: 800223,
        hash: "7a9013b8684862e9ccfb3c4a1a34126eef4665b1e4a1e8a0eb8a5108e15c61ed",
        networkName: network.name,
      },
    ];

    return mockTransactions;
  } catch (error) {
    console.error("Error fetching Bitcoin transactions:", error);
    return [];
  }
};

// Get transaction details
export const getTransactionDetails = async (
  txHash: string,
  network: NetworkConfig,
): Promise<Transaction | null> => {
  try {
    if (network.chainId) {
      // Ethereum-based transaction
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      const tx = await provider.getTransaction(txHash);
      const receipt = await provider.getTransactionReceipt(txHash);

      if (!tx) return null;

      const block = receipt
        ? await provider.getBlock(receipt.blockNumber)
        : null;

      return {
        id: txHash,
        type:
          tx.from.toLowerCase() === tx.to?.toLowerCase() ? "send" : "receive",
        status: receipt ? (receipt.status ? "confirmed" : "failed") : "pending",
        amount: ethers.utils.formatEther(tx.value),
        amountFiat: "$0.00", // Would need price data in a real app
        to: tx.to || "",
        from: tx.from,
        date: block
          ? new Date(block.timestamp * 1000).toLocaleString()
          : new Date().toLocaleString(),
        currency: network.symbol,
        fee: ethers.utils.formatEther(
          tx.gasPrice.mul(receipt ? receipt.gasUsed : tx.gasLimit),
        ),
        feeFiat: "$0.00", // Would need price data in a real app
        confirmations: receipt
          ? (await provider.getBlockNumber()) - receipt.blockNumber + 1
          : 0,
        blockHeight: receipt ? receipt.blockNumber : 0,
        hash: txHash,
        networkName: network.name,
      };
    } else {
      // Bitcoin transaction - would use a block explorer API in a real app
      return null;
    }
  } catch (error) {
    console.error("Error getting transaction details:", error);
    return null;
  }
};

// Estimate transaction fee
export const estimateTransactionFee = async (
  network: NetworkConfig,
  amount: string = "0",
): Promise<{ fee: string; feeFiat: string }> => {
  try {
    if (network.chainId) {
      // Ethereum-based network
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      const gasPrice = await provider.getGasPrice();
      const gasLimit = 21000; // Standard ETH transfer gas limit

      const fee = ethers.utils.formatEther(gasPrice.mul(gasLimit));
      // In a real app, you would convert this to fiat using current exchange rates
      const feeFiat = `$${(parseFloat(fee) * 2500).toFixed(2)}`; // Assuming $2500 per ETH

      return { fee, feeFiat };
    } else {
      // Bitcoin network - would use a fee estimation API in a real app
      return { fee: "0.0001", feeFiat: "$5.00" };
    }
  } catch (error) {
    console.error("Error estimating transaction fee:", error);
    return { fee: "0", feeFiat: "$0.00" };
  }
};
