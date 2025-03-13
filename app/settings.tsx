import React from "react";
import { SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import SecuritySettingsScreen from "../components/settings/SecuritySettingsScreen";
import BottomNavigation from "../components/common/BottomNavigation";

export default function Settings() {
  const router = useRouter();

  const handleNavigation = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <SecuritySettingsScreen onBack={() => router.back()} />
      <BottomNavigation activeTab="settings" onTabPress={handleNavigation} />
    </SafeAreaView>
  );
}
