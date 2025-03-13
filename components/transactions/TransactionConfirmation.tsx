import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ArrowRight, Check, AlertCircle, Info } from "lucide-react-native";
import { useRouter } from "expo-router";

interface TransactionConfirmationProps {
  recipientAddress?: string;
  amount?: string;
  currency?: string;
  fee?: string;
  total?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const TransactionConfirmation = ({
  recipientAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  amount = "0.05",
  currency = "ETH",
  fee = "0.002",
  total = "0.052",
  onConfirm = () => {},
  onCancel = () => {},
}: TransactionConfirmationProps) => {
  const router = useRouter();

  // Format address for display
  const formatAddress = (address: string) => {
    if (address.length > 20) {
      return `${address.substring(0, 10)}...${address.substring(address.length - 10)}`;
    }
    return address;
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <ScrollView className="flex-1">
        <View className="items-center mb-6 mt-2">
          <View className="bg-gray-800 rounded-full p-4 mb-2">
            <ArrowRight size={32} color="#10b981" />
          </View>
          <Text className="text-white text-2xl font-bold">
            Confirm Transaction
          </Text>
          <Text className="text-gray-400 text-center mt-1">
            Please review the details before confirming
          </Text>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-4">
          <Text className="text-gray-400 mb-1">You are sending</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-3xl font-bold">{amount}</Text>
            <Text className="text-white text-2xl">{currency}</Text>
          </View>
          <Text className="text-gray-400 mt-1">
            ≈ ${parseFloat(amount) * 3000} USD
          </Text>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-4">
          <Text className="text-gray-400 mb-2">Recipient</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-base">
              {formatAddress(recipientAddress)}
            </Text>
            <TouchableOpacity className="bg-gray-700 rounded-full p-1">
              <Info size={16} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-400">Network Fee</Text>
            <Text className="text-white">
              {fee} {currency}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-400">Amount</Text>
            <Text className="text-white">
              {amount} {currency}
            </Text>
          </View>
          <View className="border-t border-gray-700 my-2" />
          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-400 font-bold">Total</Text>
            <Text className="text-white font-bold">
              {total} {currency}
            </Text>
          </View>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <View className="flex-row items-start">
            <AlertCircle size={20} color="#fbbf24" className="mr-2 mt-0.5" />
            <Text className="text-gray-300 flex-1">
              This transaction will require biometric authentication to
              complete. Make sure all details are correct.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="mt-4 space-y-3">
        <TouchableOpacity
          className="bg-green-600 p-4 rounded-xl flex-row justify-center items-center"
          onPress={onConfirm}
        >
          <Check size={20} color="#ffffff" className="mr-2" />
          <Text className="text-white font-bold text-lg">
            Confirm Transaction
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-800 p-4 rounded-xl flex-row justify-center items-center"
          onPress={onCancel}
        >
          <Text className="text-gray-300 font-bold text-lg">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionConfirmation;
