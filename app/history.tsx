import React from "react";
import { SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import TransactionHistoryScreen from "../components/transactions/TransactionHistoryScreen";
import BottomNavigation from "../components/common/BottomNavigation";

export default function History() {
  const router = useRouter();

  const handleNavigation = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <TransactionHistoryScreen onBack={() => router.back()} />
      <BottomNavigation activeTab="history" onTabPress={handleNavigation} />
    </SafeAreaView>
  );
}
