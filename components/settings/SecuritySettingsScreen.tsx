import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Lock,
  Fingerprint,
  Clock,
  Eye,
  EyeOff,
  ChevronRight,
  Shield,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface SecuritySettingsScreenProps {
  onBack?: () => void;
}

const SecuritySettingsScreen = ({ onBack }: SecuritySettingsScreenProps) => {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [autoLockTimeout, setAutoLockTimeout] = useState("5");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean,
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(value);
  };

  const handleChangePassword = () => {
    // In a real implementation, this would validate and update the password
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-4 pb-4 px-4 bg-gray-800 border-b border-gray-700">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <ChevronRight
              size={24}
              color="#4f46e5"
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-200">
            Security Settings
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mt-6 mb-8">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-gray-200">
              Security Settings
            </Text>
            <Shield size={24} color="#4f46e5" />
          </View>
          <Text className="text-sm text-gray-400">
            Configure security options to protect your wallet
          </Text>
        </View>

        {/* Biometric Authentication */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Fingerprint size={24} color="#4f46e5" />
              <View className="ml-3">
                <Text className="text-base font-medium text-gray-800 dark:text-gray-200">
                  Biometric Authentication
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Use fingerprint or face ID to unlock
                </Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={(value) =>
                handleToggle(setBiometricEnabled, value)
              }
              trackColor={{ false: "#d1d5db", true: "#818cf8" }}
              thumbColor={biometricEnabled ? "#4f46e5" : "#f3f4f6"}
            />
          </View>
        </View>

        {/* Auto-Lock */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Lock size={24} color="#4f46e5" />
              <View className="ml-3">
                <Text className="text-base font-medium text-gray-800 dark:text-gray-200">
                  Auto-Lock
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Lock wallet after inactivity
                </Text>
              </View>
            </View>
            <Switch
              value={autoLockEnabled}
              onValueChange={(value) => handleToggle(setAutoLockEnabled, value)}
              trackColor={{ false: "#d1d5db", true: "#818cf8" }}
              thumbColor={autoLockEnabled ? "#4f46e5" : "#f3f4f6"}
            />
          </View>

          {autoLockEnabled && (
            <View className="flex-row items-center mt-2 ml-10">
              <Clock size={18} color="#6b7280" />
              <Text className="mx-2 text-sm text-gray-600 dark:text-gray-300">
                Lock after
              </Text>
              <TextInput
                className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-gray-800 dark:text-gray-200 w-12 text-center"
                keyboardType="number-pad"
                value={autoLockTimeout}
                onChangeText={setAutoLockTimeout}
                maxLength={2}
              />
              <Text className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                minutes
              </Text>
            </View>
          )}
        </View>

        {/* Change Password */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4">
            Change Password
          </Text>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Current Password
            </Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
              <TextInput
                className="flex-1 text-gray-800 dark:text-gray-200"
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              New Password
            </Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
              <TextInput
                className="flex-1 text-gray-800 dark:text-gray-200"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Confirm New Password
            </Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
              <TextInput
                className="flex-1 text-gray-800 dark:text-gray-200"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="bg-indigo-600 py-3 rounded-lg mt-2"
            onPress={handleChangePassword}
          >
            <Text className="text-white font-medium text-center">
              Update Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Advanced Security Options */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-sm">
          <Text className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
            Advanced Security
          </Text>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-gray-700 dark:text-gray-300">
              Backup Recovery Phrase
            </Text>
            <ChevronRight size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-gray-700 dark:text-gray-300">
              Reset Wallet
            </Text>
            <ChevronRight size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <Text className="text-red-500">Delete Wallet</Text>
            <ChevronRight size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SecuritySettingsScreen;
