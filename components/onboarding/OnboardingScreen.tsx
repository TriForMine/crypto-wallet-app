import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, Shield, Wallet, Import } from "lucide-react-native";
import CreateWalletScreen from "./CreateWalletScreen";
import ImportWalletScreen from "./ImportWalletScreen";
import SecuritySetupScreen from "./SecuritySetupScreen";

interface OnboardingScreenProps {
  onComplete?: () => void;
}

const OnboardingScreen = ({ onComplete = () => {} }: OnboardingScreenProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "create" | "import" | "security"
  >("welcome");
  const [seedPhrase, setSeedPhrase] = useState<string>("");

  const handleCreateWallet = () => {
    setCurrentStep("create");
  };

  const handleImportWallet = () => {
    setCurrentStep("import");
  };

  const handleCreateComplete = (generatedSeedPhrase: string) => {
    setSeedPhrase(generatedSeedPhrase);
    setCurrentStep("security");
  };

  const handleImportComplete = (importedSeedPhrase: string) => {
    setSeedPhrase(importedSeedPhrase);
    setCurrentStep("security");
  };

  const handleSecurityComplete = () => {
    // In a real app, we would save the encrypted wallet here
    onComplete();
  };

  const handleBack = () => {
    if (currentStep === "create" || currentStep === "import") {
      setCurrentStep("welcome");
    } else if (currentStep === "security") {
      // If we came from create or import, go back to that step
      setCurrentStep(seedPhrase ? "create" : "import");
    }
  };

  // Render the appropriate screen based on the current step
  if (currentStep === "create") {
    return (
      <CreateWalletScreen
        onComplete={handleCreateComplete}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "import") {
    return (
      <ImportWalletScreen
        onComplete={handleImportComplete}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "security") {
    return <SecuritySetupScreen onComplete={handleSecurityComplete} />;
  }

  // Welcome screen (default)
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1">
        <View className="items-center justify-center pt-12 pb-8 px-6">
          <View className="bg-blue-100 dark:bg-blue-900 p-5 rounded-full mb-6">
            <Shield size={48} color="#3b82f6" />
          </View>
          <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Secure Crypto Wallet
          </Text>
          <Text className="text-center text-gray-600 dark:text-gray-300 mb-8 px-4">
            A secure, offline-first cryptocurrency wallet for managing multiple
            cryptocurrencies
          </Text>

          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&q=80",
            }}
            className="w-full h-64 rounded-xl mb-8"
            resizeMode="cover"
          />
        </View>

        <View className="px-6 pb-8">
          <Text className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Get Started
          </Text>

          <TouchableOpacity
            onPress={handleCreateWallet}
            className="flex-row items-center bg-white dark:bg-gray-800 p-4 rounded-xl mb-4 border border-gray-200 dark:border-gray-700"
          >
            <View className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mr-4">
              <Wallet size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-medium text-gray-900 dark:text-white">
                Create New Wallet
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">
                Generate a new secure wallet with a seed phrase
              </Text>
            </View>
            <ChevronRight size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleImportWallet}
            className="flex-row items-center bg-white dark:bg-gray-800 p-4 rounded-xl mb-6 border border-gray-200 dark:border-gray-700"
          >
            <View className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full mr-4">
              <Import size={24} color="#8b5cf6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-medium text-gray-900 dark:text-white">
                Import Existing Wallet
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">
                Restore your wallet using a seed phrase
              </Text>
            </View>
            <ChevronRight size={20} color="#6b7280" />
          </TouchableOpacity>

          <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
