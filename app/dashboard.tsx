import React from "react";
import { SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import DashboardScreen from "../components/dashboard/DashboardScreen";
import BottomNavigation from "../components/common/BottomNavigation";

export default function Dashboard() {
  const router = useRouter();

  const handleNavigation = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <DashboardScreen
        onSendPress={() => router.push("/send")}
        onReceivePress={() => router.push("/receive")}
        onHistoryPress={() => router.push("/history")}
        onSettingsPress={() => router.push("/settings")}
      />
      <BottomNavigation activeTab="home" onTabPress={handleNavigation} />
    </SafeAreaView>
  );
}
