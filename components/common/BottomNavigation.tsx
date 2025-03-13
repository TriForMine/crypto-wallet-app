import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, Send, Wallet, History, Settings } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomNavigationProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

const BottomNavigation = ({
  activeTab = "home",
  onTabPress,
}: BottomNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      key: "home",
      label: "Home",
      icon: Home,
      route: "/",
    },
    {
      key: "send",
      label: "Send",
      icon: Send,
      route: "/send",
    },
    {
      key: "wallets",
      label: "Wallets",
      icon: Wallet,
      route: "/wallets",
    },
    {
      key: "history",
      label: "History",
      icon: History,
      route: "/history",
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      route: "/settings",
    },
  ];

  const handleNavigation = (tab: string) => {
    if (onTabPress) {
      onTabPress(tab);
    } else {
      router.push(tabs.find((t) => t.key === tab)?.route || "/");
    }
  };

  return (
    <View
      className="flex-row items-center justify-between bg-gray-900 px-2 pt-2 border-t border-gray-800"
      style={{ paddingBottom: Platform.OS === "ios" ? insets.bottom : 16 }}
    >
      {tabs.map((tab) => {
        const isActive =
          tab.key === activeTab || (tab.route === "/" && pathname === "/");
        const activeColor = isActive ? "text-blue-500" : "text-gray-400";

        return (
          <Pressable
            key={tab.key}
            className="flex-1 items-center py-2"
            onPress={() => handleNavigation(tab.key)}
          >
            <tab.icon
              size={24}
              className={activeColor}
              color={isActive ? "#3b82f6" : "#9ca3af"}
            />
            <Text className={`text-xs mt-1 ${activeColor}`}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default BottomNavigation;
