import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  Shield,
  ChevronRight,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface SecuritySetupScreenProps {
  onComplete?: () => void;
}

const SecuritySetupScreen = ({
  onComplete = () => {},
}: SecuritySetupScreenProps) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [enableBiometric, setEnableBiometric] = useState(true);
  const [autoLockTimeout, setAutoLockTimeout] = useState("5"); // minutes

  const [passwordError, setPasswordError] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleBiometric = () => {
    setEnableBiometric(!enableBiometric);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleComplete = () => {
    if (validatePassword()) {
      // In a real app, we would encrypt and store the wallet here
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
      // Navigate to dashboard
      router.replace("/");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <View className="h-16 flex-row items-center justify-center border-b border-gray-200 dark:border-gray-800 px-4">
        <Text className="text-xl font-semibold text-gray-800 dark:text-white">
          Security Setup
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <View className="items-center mb-8">
            <View className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
              <Shield size={40} color="#3b82f6" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Secure Your Wallet
            </Text>
            <Text className="text-center text-gray-600 dark:text-gray-300 mb-4">
              Set up security measures to protect your cryptocurrency assets
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Create Password
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </Text>
              <View className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-3 py-2">
                <Lock size={20} color="#6b7280" className="mr-2" />
                <TextInput
                  className="flex-1 text-gray-800 dark:text-white py-2"
                  placeholder="Enter password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={toggleShowPassword}>
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-2">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </Text>
              <View className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-3 py-2">
                <Lock size={20} color="#6b7280" className="mr-2" />
                <TextInput
                  className="flex-1 text-gray-800 dark:text-white py-2"
                  placeholder="Confirm password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            {passwordError ? (
              <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
            ) : null}

            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Password must be at least 8 characters long and include a mix of
              letters, numbers, and symbols for best security.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Biometric Authentication
            </Text>

            <View className="flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
              <View className="flex-row items-center">
                <Fingerprint size={24} color="#3b82f6" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800 dark:text-white">
                    Enable Biometric Authentication
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Use fingerprint or face recognition
                  </Text>
                </View>
              </View>
              <Switch
                value={enableBiometric}
                onValueChange={toggleBiometric}
                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                thumbColor={enableBiometric ? "#3b82f6" : "#9ca3af"}
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Auto-Lock Settings
            </Text>

            <View className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <View className="p-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="font-medium text-gray-800 dark:text-white mb-1">
                  Auto-lock after inactivity
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Wallet will automatically lock after period of inactivity
                </Text>
              </View>

              {["1", "5", "15", "30", "60"].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  className={`flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 ${autoLockTimeout === minutes ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  onPress={() => {
                    setAutoLockTimeout(minutes);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text
                    className={`${autoLockTimeout === minutes ? "font-medium text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {minutes === "1" ? "1 minute" : `${minutes} minutes`}
                  </Text>
                  {autoLockTimeout === minutes && (
                    <ChevronRight size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-200 dark:border-gray-800">
        <TouchableOpacity
          className="bg-blue-600 py-4 px-6 rounded-lg items-center"
          onPress={handleComplete}
        >
          <Text className="text-white font-semibold text-lg">
            Complete Setup
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SecuritySetupScreen;
