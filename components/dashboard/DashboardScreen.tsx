import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Settings, Bell } from "lucide-react-native";

import BalanceCard from "./BalanceCard";
import ActionButtons from "./ActionButtons";
import RecentTransactions from "./RecentTransactions";

interface DashboardScreenProps {
  userName?: string;
  hasNotifications?: boolean;
  onSendPress?: () => void;
  onReceivePress?: () => void;
  onHistoryPress?: () => void;
  onSettingsPress?: () => void;
}

const DashboardScreen = ({
  userName = "Alex",
  hasNotifications = true,
  onSendPress,
  onReceivePress,
  onHistoryPress,
  onSettingsPress,
}: DashboardScreenProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark" || true; // Force dark mode for now

  const handleSend = () => {
    if (onSendPress) {
      onSendPress();
    } else {
      console.log("Navigating to send screen");
    }
  };

  const handleReceive = () => {
    if (onReceivePress) {
      onReceivePress();
    } else {
      console.log("Navigating to receive screen");
    }
  };

  const handleHistory = () => {
    if (onHistoryPress) {
      onHistoryPress();
    } else {
      console.log("Navigating to transaction history");
    }
  };

  const handleViewAllTransactions = () => {
    if (onHistoryPress) {
      onHistoryPress();
    } else {
      console.log("Navigating to full transaction history");
    }
  };

  const handleTransactionPress = (transaction: any) => {
    console.log("Viewing transaction details", transaction);
  };

  const handleCurrencySelect = (currency: any) => {
    console.log("Viewing currency details", currency);
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      console.log("Navigating to settings");
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-4 pt-2 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-sm text-gray-400">Welcome back,</Text>
          <Text className="text-xl font-bold text-white">{userName}</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            className="mr-4 w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
            onPress={() => console.log("Notifications pressed")}
          >
            <Bell size={20} color="#E5E7EB" />
            {hasNotifications && (
              <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
            onPress={handleSettingsPress}
          >
            <Settings size={20} color="#E5E7EB" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View className="mb-6">
          <BalanceCard onCurrencySelect={handleCurrencySelect} />
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          <ActionButtons
            onSend={handleSend}
            onReceive={handleReceive}
            onHistory={handleHistory}
          />
        </View>

        {/* Recent Transactions */}
        <View className="mb-6">
          <RecentTransactions
            onViewAll={handleViewAllTransactions}
            onTransactionPress={handleTransactionPress}
          />
        </View>

        {/* Extra padding at bottom for scrolling past bottom nav */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
