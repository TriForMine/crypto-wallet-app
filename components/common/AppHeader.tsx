import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Settings, Bell } from "lucide-react-native";

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSettings?: boolean;
  showNotifications?: boolean;
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
  backgroundColor?: string;
}

const AppHeader = ({
  title = "Crypto Wallet",
  showBackButton = false,
  showSettings = false,
  showNotifications = false,
  onSettingsPress,
  onNotificationsPress,
  backgroundColor = "bg-gray-900",
}: AppHeaderProps) => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      // Default navigation to settings
      router.push("/settings");
    }
  };

  const handleNotificationsPress = () => {
    if (onNotificationsPress) {
      onNotificationsPress();
    } else {
      // Default navigation to notifications
      router.push("/notifications");
    }
  };

  return (
    <View
      className={`${backgroundColor} px-4 py-3 flex-row items-center justify-between mt-8`}
      style={styles.header}
    >
      <View className="flex-row items-center">
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            className="mr-3 p-1"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <Text className="text-white font-bold text-xl">{title}</Text>
      </View>

      <View className="flex-row items-center">
        {showNotifications && (
          <TouchableOpacity
            onPress={handleNotificationsPress}
            className="ml-4 p-1"
            accessibilityLabel="Notifications"
          >
            <Bell size={22} color="#fff" />
          </TouchableOpacity>
        )}
        {showSettings && (
          <TouchableOpacity
            onPress={handleSettingsPress}
            className="ml-4 p-1"
            accessibilityLabel="Settings"
          >
            <Settings size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    elevation: 4,
    // Using boxShadow instead of deprecated shadow* props
  },
});

export default AppHeader;
