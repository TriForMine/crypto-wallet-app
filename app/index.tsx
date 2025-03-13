import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Slot, Stack, useRouter } from "expo-router";

import AuthScreen from "../components/auth/AuthScreen";
import OnboardingScreen from "../components/onboarding/OnboardingScreen";
import DashboardScreen from "../components/dashboard/DashboardScreen";
import SendScreen from "../components/transactions/SendScreen";
import ReceiveScreen from "../components/transactions/ReceiveScreen";
import TransactionHistoryScreen from "../components/transactions/TransactionHistoryScreen";
import ManageWalletsScreen from "../components/wallet/ManageWalletsScreen";
import SecuritySettingsScreen from "../components/settings/SecuritySettingsScreen";
import BottomNavigation from "../components/common/BottomNavigation";

export default function HomeScreen() {
  const [appState, setAppState] = useState<
    | "loading"
    | "onboarding"
    | "auth"
    | "dashboard"
    | "send"
    | "receive"
    | "history"
    | "wallets"
    | "settings"
  >("loading");
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
          setAppState("onboarding");
        } else if (!isAuthenticated) {
          setAppState("auth");
        } else {
          setAppState("dashboard");
        }
      } catch (error) {
        console.error("Error checking app state:", error);
        // Default to onboarding if there's an error
        setAppState("onboarding");
      }
    };

    // Add a small delay to simulate loading
    setTimeout(() => {
      checkAppState();
    }, 1000);
  }, []);

  const handleOnboardingComplete = () => {
    // In a real app, we would save the wallet info securely
    SecureStore.setItemAsync("hasWallet", "true").catch(console.error);
    setAppState("auth");
  };

  const handleAuthComplete = () => {
    SecureStore.setItemAsync("isAuthenticated", "true").catch(console.error);
    setAppState("dashboard");
  };

  const handleNavigation = (screen: string) => {
    setAppState(screen as any);
  };

  const handleBack = () => {
    setAppState("dashboard");
  };

  // Loading state
  if (appState === "loading") {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
        <StatusBar barStyle="light-content" />
        <Text className="text-white text-2xl font-bold">Crypto Wallet</Text>
        <Text className="text-slate-400 mt-2">
          Loading your secure wallet...
        </Text>
      </SafeAreaView>
    );
  }

  // Onboarding flow
  if (appState === "onboarding") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Authentication screen
  if (appState === "auth") {
    return <AuthScreen onAuthenticated={handleAuthComplete} />;
  }

  // Transaction screens
  if (appState === "send") {
    return <SendScreen onClose={handleBack} />;
  }

  if (appState === "receive") {
    return <ReceiveScreen onBack={handleBack} />;
  }

  if (appState === "history") {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <TransactionHistoryScreen />
        <BottomNavigation activeTab="history" onTabPress={handleNavigation} />
      </SafeAreaView>
    );
  }

  if (appState === "wallets") {
    return <ManageWalletsScreen />;
  }

  if (appState === "settings") {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <SecuritySettingsScreen onBack={handleBack} />
        <BottomNavigation activeTab="settings" onTabPress={handleNavigation} />
      </SafeAreaView>
    );
  }

  // Main dashboard
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <DashboardScreen
        onSendPress={() => handleNavigation("send")}
        onReceivePress={() => handleNavigation("receive")}
        onHistoryPress={() => handleNavigation("history")}
        onSettingsPress={() => handleNavigation("settings")}
      />
      <BottomNavigation activeTab="home" onTabPress={handleNavigation} />
    </SafeAreaView>
  );
}
