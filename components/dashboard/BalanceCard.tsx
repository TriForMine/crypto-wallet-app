import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react-native";

interface CryptoCurrency {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change: number;
}

interface BalanceCardProps {
  totalValue?: number;
  currencies?: CryptoCurrency[];
  onCurrencySelect?: (currency: CryptoCurrency) => void;
}

const BalanceCard = ({
  totalValue = 12458.32,
  currencies = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: 0.42,
      value: 8234.56,
      change: 2.4,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: 5.7,
      value: 3245.89,
      change: -1.2,
    },
    {
      symbol: "XRP",
      name: "Ripple",
      balance: 2500,
      value: 977.87,
      change: 0.8,
    },
  ],
  onCurrencySelect = () => {},
}: BalanceCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <View className="bg-slate-800 rounded-xl p-4 w-full shadow-md">
      {/* Total Balance Section */}
      <View className="mb-4">
        <Text className="text-slate-400 text-sm mb-1">Total Balance</Text>
        <Text className="text-white text-3xl font-bold">
          $
          {totalValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>

      {/* Toggle Button */}
      <TouchableOpacity
        className="flex-row items-center justify-center py-2 mb-2 border-t border-slate-700"
        onPress={toggleExpanded}
      >
        <Text className="text-slate-300 mr-2">
          {expanded ? "Hide" : "Show"} Assets
        </Text>
        {expanded ? (
          <ChevronUp size={18} color="#CBD5E1" />
        ) : (
          <ChevronDown size={18} color="#CBD5E1" />
        )}
      </TouchableOpacity>

      {/* Currency List */}
      {expanded && (
        <ScrollView className="max-h-48">
          {currencies.map((currency, index) => (
            <TouchableOpacity
              key={currency.symbol}
              className={`flex-row justify-between items-center py-3 ${index !== currencies.length - 1 ? "border-b border-slate-700" : ""}`}
              onPress={() => onCurrencySelect(currency)}
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-slate-700 rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">
                    {currency.symbol.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text className="text-white font-medium">
                    {currency.symbol}
                  </Text>
                  <Text className="text-slate-400 text-xs">
                    {currency.name}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-white font-medium">
                  {currency.balance} {currency.symbol}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-slate-300 text-xs mr-1">
                    $
                    {currency.value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                  <View className="flex-row items-center">
                    {currency.change >= 0 ? (
                      <ArrowUpRight size={12} color="#4ADE80" />
                    ) : (
                      <ArrowDownRight size={12} color="#F87171" />
                    )}
                    <Text
                      className={`text-xs ${currency.change >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {Math.abs(currency.change)}%
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default BalanceCard;
