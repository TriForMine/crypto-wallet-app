import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { Fingerprint, Lock, Eye, EyeOff, Key } from "lucide-react-native";

interface AuthScreenProps {
  onAuthenticated?: () => void;
  isFirstTime?: boolean;
}

const AuthScreen = ({
  onAuthenticated = () => {},
  isFirstTime = false,
}: AuthScreenProps) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [useBiometric, setUseBiometric] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);

  useEffect(() => {
    // Simulate checking if biometric is available
    const checkBiometricAvailability = async () => {
      // In a real app, you would check if biometric auth is available
      // For this scaffold, we'll assume it is
      if (useBiometric) {
        setTimeout(() => {
          handleBiometricAuth();
        }, 500);
      }
    };

    checkBiometricAvailability();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      setIsAuthenticating(true);
      // Simulate biometric authentication
      // In a real app, you would use expo-local-authentication
      setTimeout(() => {
        // Simulate successful authentication 80% of the time
        if (Math.random() > 0.2) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          handleSuccessfulAuth();
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert(
            "Authentication Failed",
            "Biometric authentication failed. Please try again or use your password.",
          );
          setIsAuthenticating(false);
        }
      }, 1500);
    } catch (error) {
      console.error("Biometric auth error:", error);
      setIsAuthenticating(false);
      Alert.alert(
        "Error",
        "There was an error with biometric authentication. Please use your password.",
      );
    }
  };

  const handlePasswordAuth = () => {
    setIsAuthenticating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate password verification
    // In a real app, you would verify against stored credentials
    setTimeout(() => {
      if (password.length >= 6) {
        // Simple validation for scaffold
        handleSuccessfulAuth();
      } else {
        setFailedAttempts((prev) => prev + 1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          "Authentication Failed",
          "Incorrect password. Please try again.",
        );
        setIsAuthenticating(false);
      }
    }, 1000);
  };

  const handleSuccessfulAuth = () => {
    // Simulate storing auth state
    SecureStore.setItemAsync("isAuthenticated", "true").catch(console.error);

    setIsAuthenticating(false);
    onAuthenticated();
  };

  return (
    <View className="flex-1 bg-slate-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-slate-800">
        <Text className="text-xl font-bold text-white text-center">
          Wallet Authentication
        </Text>
      </View>

      <View className="flex-1 justify-center items-center px-6">
        <View className="w-full max-w-sm bg-slate-800 rounded-3xl p-8 shadow-lg">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-slate-700 rounded-full items-center justify-center mb-4">
              <Lock size={40} color="#94a3b8" />
            </View>
            <Text className="text-2xl font-bold text-white mb-2">
              Secure Access
            </Text>
            <Text className="text-slate-400 text-center">
              {useBiometric
                ? "Use biometric authentication or enter your password"
                : "Enter your password to access your wallet"}
            </Text>
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <View className="flex-row items-center bg-slate-700 rounded-xl px-4 py-3 mb-1">
              <Key size={20} color="#94a3b8" />
              <TextInput
                className="flex-1 text-white ml-3 text-base"
                placeholder="Enter your password"
                placeholderTextColor="#64748b"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isAuthenticating}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isAuthenticating}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#94a3b8" />
                ) : (
                  <Eye size={20} color="#94a3b8" />
                )}
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-slate-500 ml-1">
              Password must be at least 6 characters
            </Text>
          </View>

          {/* Auth Buttons */}
          <View className="space-y-4">
            <TouchableOpacity
              className={`bg-blue-600 py-3 rounded-xl items-center ${isAuthenticating ? "opacity-70" : ""}`}
              onPress={handlePasswordAuth}
              disabled={isAuthenticating || !password.length}
            >
              <Text className="text-white font-semibold text-base">
                {isAuthenticating
                  ? "Authenticating..."
                  : "Unlock with Password"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row justify-center items-center py-3 rounded-xl border border-slate-600 ${isAuthenticating || !useBiometric ? "opacity-50" : ""}`}
              onPress={handleBiometricAuth}
              disabled={isAuthenticating || !useBiometric}
            >
              <Fingerprint size={20} color="#94a3b8" />
              <Text className="text-slate-300 font-semibold ml-2 text-base">
                Use Biometric Authentication
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            className="mt-6 items-center"
            disabled={isAuthenticating}
            onPress={() =>
              Alert.alert(
                "Recover Wallet",
                "To recover your wallet, you will need your seed phrase. This feature would allow wallet recovery in a real app.",
              )
            }
          >
            <Text className="text-blue-400 text-sm">
              Forgot Password or Need Recovery?
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Branding */}
        <View className="mt-12 items-center">
          <Text className="text-slate-500 text-xs mb-2">
            SECURE CRYPTOCURRENCY WALLET
          </Text>
          <Text className="text-slate-400 text-sm">
            Protected with AES-256 Encryption
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AuthScreen;
