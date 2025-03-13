import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react-native";

interface Transaction {
  id: string;
  type: "send" | "receive" | "pending";
  amount: string;
  cryptoCode: string;
  fiatValue: string;
  timestamp: string;
  address: string;
  status: "completed" | "pending" | "failed";
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  onViewAll?: () => void;
  onTransactionPress?: (transaction: Transaction) => void;
}

const RecentTransactions = ({
  transactions = [
    {
      id: "1",
      type: "receive",
      amount: "0.05",
      cryptoCode: "BTC",
      fiatValue: "$1,950.00",
      timestamp: "2 hours ago",
      address: "3FZbgi29...j7aCs",
      status: "completed",
    },
    {
      id: "2",
      type: "send",
      amount: "0.5",
      cryptoCode: "ETH",
      fiatValue: "$950.00",
      timestamp: "5 hours ago",
      address: "0x3F5E...b8F9",
      status: "completed",
    },
    {
      id: "3",
      type: "receive",
      amount: "150",
      cryptoCode: "XRP",
      fiatValue: "$75.00",
      timestamp: "Yesterday",
      address: "rGkKr...9iHn",
      status: "completed",
    },
    {
      id: "4",
      type: "pending",
      amount: "0.02",
      cryptoCode: "BTC",
      fiatValue: "$780.00",
      timestamp: "Just now",
      address: "3FZbgi29...j7aCs",
      status: "pending",
    },
  ],
  onViewAll = () => {},
  onTransactionPress = () => {},
}: RecentTransactionsProps) => {
  const renderTransactionIcon = (type: string, status: string) => {
    if (status === "pending") {
      return (
        <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
          <Clock size={20} color="#6B7280" />
        </View>
      );
    }

    return (
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${
          type === "receive" ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {type === "receive" ? (
          <ArrowDownLeft size={20} color="#10B981" />
        ) : (
          <ArrowUpRight size={20} color="#EF4444" />
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      className="flex-row items-center py-3 border-b border-gray-100"
      onPress={() => onTransactionPress(item)}
    >
      {renderTransactionIcon(item.type, item.status)}

      <View className="flex-1 ml-3">
        <View className="flex-row justify-between">
          <Text className="font-medium text-gray-900">
            {item.type === "receive"
              ? "Received"
              : item.type === "send"
                ? "Sent"
                : "Pending"}
          </Text>
          <Text
            className={`font-medium ${
              item.type === "receive"
                ? "text-green-600"
                : item.type === "send"
                  ? "text-red-600"
                  : "text-gray-500"
            }`}
          >
            {item.type === "send" ? "-" : "+"}
            {item.amount} {item.cryptoCode}
          </Text>
        </View>

        <View className="flex-row justify-between mt-1">
          <Text className="text-xs text-gray-500">{item.timestamp}</Text>
          <Text className="text-xs text-gray-500">{item.fiatValue}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text className="text-blue-600 font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      ) : (
        <View className="py-8 items-center justify-center">
          <Image
            source={{
              uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=transactions",
            }}
            className="w-16 h-16 mb-4"
          />
          <Text className="text-gray-500 text-center">No transactions yet</Text>
          <Text className="text-gray-400 text-center text-sm mt-1">
            Your transaction history will appear here
          </Text>
        </View>
      )}
    </View>
  );
};

export default RecentTransactions;
