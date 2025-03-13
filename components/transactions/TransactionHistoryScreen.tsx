import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
} from "react-native";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Search,
  X,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import TransactionDetails from "./TransactionDetails";

interface Transaction {
  id: string;
  type: "send" | "receive";
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
}

interface TransactionHistoryScreenProps {
  transactions?: Transaction[];
  onBack?: () => void;
}

const TransactionHistoryScreen = ({
  transactions: propTransactions = [
    {
      id: "tx1",
      type: "send",
      status: "confirmed",
      amount: "0.25",
      amountFiat: "$6,250.00",
      to: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      from: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a0",
      date: "May 20, 2023 10:15",
      currency: "ETH",
      fee: "0.0005",
      feeFiat: "$12.50",
      confirmations: 256,
      blockHeight: 16242532,
      hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      id: "tx2",
      type: "receive",
      status: "confirmed",
      amount: "0.5",
      amountFiat: "$12,500.00",
      to: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a0",
      from: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a",
      date: "May 18, 2023 14:30",
      currency: "ETH",
      fee: "0.0005",
      feeFiat: "$12.50",
      confirmations: 350,
      blockHeight: 16242032,
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      id: "tx3",
      type: "send",
      status: "pending",
      amount: "0.1",
      amountFiat: "$2,500.00",
      to: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b",
      from: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a0",
      date: "May 15, 2023 09:45",
      currency: "ETH",
      fee: "0.0005",
      feeFiat: "$12.50",
      confirmations: 0,
      blockHeight: 0,
      hash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
    },
    {
      id: "tx4",
      type: "receive",
      status: "confirmed",
      amount: "0.05",
      amountFiat: "$1,250.00",
      to: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a0",
      from: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c",
      date: "May 10, 2023 16:20",
      currency: "ETH",
      fee: "0.0005",
      feeFiat: "$12.50",
      confirmations: 500,
      blockHeight: 16241532,
      hash: "0x90abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
      memo: "Payment for services",
    },
    {
      id: "tx5",
      type: "send",
      status: "failed",
      amount: "0.15",
      amountFiat: "$3,750.00",
      to: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d",
      from: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a0",
      date: "May 5, 2023 11:10",
      currency: "ETH",
      fee: "0.0005",
      feeFiat: "$12.50",
      confirmations: 0,
      blockHeight: 0,
      hash: "0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    },
  ],
  onBack,
}: TransactionHistoryScreenProps) => {
  const router = useRouter();
  const [transactions, setTransactions] =
    useState<Transaction[]>(propTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(propTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  // Filter states
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"all" | "send" | "receive">(
    "all",
  );
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "confirmed" | "pending" | "failed"
  >("all");

  useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (tx) =>
          tx.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.hash.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply currency filter
    if (selectedCurrency) {
      filtered = filtered.filter((tx) => tx.currency === selectedCurrency);
    }

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((tx) => tx.type === selectedType);
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((tx) => tx.status === selectedStatus);
    }

    setFilteredTransactions(filtered);
  }, [
    transactions,
    searchQuery,
    selectedCurrency,
    selectedType,
    selectedStatus,
  ]);

  const resetFilters = () => {
    setSelectedCurrency(null);
    setSelectedType("all");
    setSelectedStatus("all");
    setShowFilters(false);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={16} color="#10b981" />;
      case "pending":
        return <Clock size={16} color="#f59e0b" />;
      case "failed":
        return <AlertCircle size={16} color="#ef4444" />;
      default:
        return <Clock size={16} color="#f59e0b" />;
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-800"
      onPress={() => handleTransactionPress(item)}
    >
      <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mr-3">
        {item.type === "send" ? (
          <ArrowUpRight size={20} color="#ef4444" />
        ) : (
          <ArrowDownLeft size={20} color="#10b981" />
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="font-medium dark:text-white">
            {item.type === "send" ? "Sent" : "Received"} {item.currency}
          </Text>
          <View className="flex-row items-center ml-2">
            {getStatusIcon(item.status)}
            <Text className="text-xs ml-1 text-gray-500 dark:text-gray-400">
              {item.status}
            </Text>
          </View>
        </View>

        <Text className="text-gray-500 dark:text-gray-400 text-xs">
          {item.date}
        </Text>
      </View>

      <View className="items-end">
        <Text
          className={`font-medium ${item.type === "send" ? "text-red-500" : "text-green-500"}`}
        >
          {item.type === "send" ? "-" : "+"}
          {item.amount} {item.currency}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-xs">
          {item.amountFiat}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 mt-8">
        <TouchableOpacity onPress={handleBack}>
          <X size={24} color="#9ca3af" />
        </TouchableOpacity>
        <Text className="text-xl font-bold dark:text-white">
          Transaction History
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4">
        {/* Search and Filter Bar */}
        <View className="flex-row items-center mb-4 mt-4">
          <View className="flex-row items-center flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 mr-2">
            <Search size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2 text-gray-900 dark:text-white"
              placeholder="Search by address or hash"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={20} color="#9ca3af" />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={24} color={showFilters ? "#3b82f6" : "#9ca3af"} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-medium dark:text-white">Filters</Text>
              <TouchableOpacity onPress={resetFilters}>
                <Text className="text-blue-500">Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Currency Filter */}
            <View className="mb-3">
              <Text className="text-gray-500 dark:text-gray-400 mb-1">
                Currency
              </Text>
              <TouchableOpacity
                className="flex-row justify-between items-center bg-white dark:bg-gray-700 p-3 rounded-lg"
                onPress={() => {
                  // In a real app, this would open a currency selector
                  setSelectedCurrency(
                    selectedCurrency === "ETH" ? null : "ETH",
                  );
                }}
              >
                <Text className="dark:text-white">
                  {selectedCurrency || "All currencies"}
                </Text>
                <ChevronDown size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Transaction Type Filter */}
            <View className="mb-3">
              <Text className="text-gray-500 dark:text-gray-400 mb-1">
                Transaction Type
              </Text>
              <View className="flex-row">
                {["all", "send", "receive"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`mr-2 px-4 py-2 rounded-lg ${selectedType === type ? "bg-blue-500" : "bg-white dark:bg-gray-700"}`}
                    onPress={() =>
                      setSelectedType(type as "all" | "send" | "receive")
                    }
                  >
                    <Text
                      className={`${selectedType === type ? "text-white" : "text-gray-900 dark:text-white"}`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status Filter */}
            <View>
              <Text className="text-gray-500 dark:text-gray-400 mb-1">
                Status
              </Text>
              <View className="flex-row flex-wrap">
                {["all", "confirmed", "pending", "failed"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    className={`mr-2 mb-2 px-4 py-2 rounded-lg ${selectedStatus === status ? "bg-blue-500" : "bg-white dark:bg-gray-700"}`}
                    onPress={() =>
                      setSelectedStatus(
                        status as "all" | "confirmed" | "pending" | "failed",
                      )
                    }
                  >
                    <Text
                      className={`${selectedStatus === status ? "text-white" : "text-gray-900 dark:text-white"}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Transaction List */}
        {filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              No transactions found matching your filters.
            </Text>
          </View>
        )}
      </View>

      {/* Transaction Details Modal */}
      <Modal
        visible={showTransactionDetails}
        animationType="slide"
        onRequestClose={() => setShowTransactionDetails(false)}
      >
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <Text className="text-xl font-bold dark:text-white">
              Transaction Details
            </Text>
            <TouchableOpacity onPress={() => setShowTransactionDetails(false)}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {selectedTransaction && (
            <TransactionDetails
              transaction={selectedTransaction}
              onClose={() => setShowTransactionDetails(false)}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default TransactionHistoryScreen;
