import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface TransactionDetailsProps {
  transaction?: {
    id: string;
    type: "send" | "receive";
    status: "confirmed" | "pending" | "failed";
    amount: string;
    amountFiat: string;
    fee: string;
    feeFiat: string;
    to: string;
    from: string;
    date: string;
    confirmations: number;
    blockHeight: number;
    hash: string;
    memo?: string;
    currency: string;
  };
  onClose?: () => void;
}

const TransactionDetails = ({
  transaction = {
    id: "tx123456789",
    type: "send",
    status: "confirmed",
    amount: "0.05",
    amountFiat: "$1,250.00",
    fee: "0.0005",
    feeFiat: "$12.50",
    to: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    from: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a0",
    date: "May 15, 2023 14:30",
    confirmations: 128,
    blockHeight: 16242032,
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    memo: "Payment for services",
    currency: "ETH",
  },
  onClose = () => {},
}: TransactionDetailsProps) => {
  const copyToClipboard = (text: string) => {
    // In a real implementation, this would use Clipboard.setString(text)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Show toast notification
  };

  const openInExplorer = (hash: string) => {
    // This would open the transaction in a block explorer
    Linking.openURL(`https://etherscan.io/tx/${hash}`);
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "confirmed":
        return <CheckCircle size={20} color="#10b981" />;
      case "pending":
        return <Clock size={20} color="#f59e0b" />;
      case "failed":
        return <AlertCircle size={20} color="#ef4444" />;
      default:
        return <Clock size={20} color="#f59e0b" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "confirmed":
        return "text-green-500";
      case "pending":
        return "text-amber-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-amber-500";
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 p-4">
        {/* Transaction Header */}
        <View className="items-center mb-6 mt-2">
          <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
            {transaction.type === "send" ? (
              <ArrowUpRight size={32} color="#ef4444" />
            ) : (
              <ArrowDownLeft size={32} color="#10b981" />
            )}
          </View>

          <Text className="text-2xl font-bold dark:text-white">
            {transaction.type === "send" ? "-" : "+"}
            {transaction.amount} {transaction.currency}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-lg">
            {transaction.amountFiat}
          </Text>

          <View className="flex-row items-center mt-2">
            {getStatusIcon()}
            <Text className={`ml-2 ${getStatusColor()} font-medium`}>
              {transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm">
          <View className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Date
            </Text>
            <Text className="text-gray-900 dark:text-white">
              {transaction.date}
            </Text>
          </View>

          <View className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              From
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 dark:text-white flex-1">
                {formatAddress(transaction.from)}
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(transaction.from)}
              >
                <Copy size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              To
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 dark:text-white flex-1">
                {formatAddress(transaction.to)}
              </Text>
              <TouchableOpacity onPress={() => copyToClipboard(transaction.to)}>
                <Copy size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {transaction.memo && (
            <View className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
              <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Memo
              </Text>
              <Text className="text-gray-900 dark:text-white">
                {transaction.memo}
              </Text>
            </View>
          )}

          <View className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Network Fee
            </Text>
            <View className="flex-row">
              <Text className="text-gray-900 dark:text-white">
                {transaction.fee} {transaction.currency}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 ml-2">
                ({transaction.feeFiat})
              </Text>
            </View>
          </View>

          <View className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Confirmations
            </Text>
            <Text className="text-gray-900 dark:text-white">
              {transaction.confirmations}
            </Text>
          </View>

          <View>
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Transaction Hash
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 dark:text-white flex-1">
                {formatAddress(transaction.hash)}
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(transaction.hash)}
                className="mr-2"
              >
                <Copy size={18} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openInExplorer(transaction.hash)}
              >
                <ExternalLink size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Block Information */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-medium mb-3 dark:text-white">
            Block Information
          </Text>
          <View className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Block Height
            </Text>
            <Text className="text-gray-900 dark:text-white">
              {transaction.blockHeight}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg items-center mb-6"
          onPress={() => openInExplorer(transaction.hash)}
        >
          <Text className="text-white font-medium">View on Block Explorer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TransactionDetails;
