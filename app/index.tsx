import React, { useEffect } from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has completed onboarding and has a wallet
    const checkAppState = async () => {
      try {
        // In a real app, we would check for wallet existence and auth state
        // For this scaffold, we'll simulate the check with SecureStore
        const hasWallet = await SecureStore.getItemAsync("hasWallet");
        const isAuthenticated =
          await SecureStore.getItemAsync("isAuthenticated");

        if (!hasWallet) {
          router.replace("/onboarding");
        } else if (!isAuthenticated) {
          router.replace("/auth");
        } else {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error checking app state:", error);
        // Default to onboarding if there's an error
        router.replace("/onboarding");
      }
    };

    // Add a small delay to simulate loading
    setTimeout(() => {
      checkAppState();
    }, 1000);
  }, [router]);

  // Loading state
  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
      <StatusBar barStyle="light-content" />
      <Text className="text-white text-2xl font-bold">Crypto Wallet</Text>
      <Text className="text-slate-400 mt-2">Loading your secure wallet...</Text>
    </SafeAreaView>
  );
}
