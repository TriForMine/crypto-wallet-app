import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
} from "lucide-react-native";
import { useWallet } from "../../context/WalletContext";

interface AppHeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

const AppHeader = ({
  title = "Title",
  leftIcon,
  rightIcon,
  onLeftPress = () => {},
  onRightPress = () => {},
}: AppHeaderProps) => {
  return (
    <View className="h-16 flex-row items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
      {leftIcon ? (
        <TouchableOpacity onPress={onLeftPress} className="p-2">
          {leftIcon}
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}

      <Text className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </Text>

      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} className="p-2">
          {rightIcon}
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}
    </View>
  );
};

interface CreateWalletScreenProps {
  onComplete?: (seedPhrase: string) => void;
  onBack?: () => void;
}

const CreateWalletScreen = ({
  onComplete = () => {},
  onBack = () => {},
}: CreateWalletScreenProps) => {
  const { generateNewSeedPhrase } = useWallet();
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    // Generate a new seed phrase when the component mounts
    const newSeedPhrase = generateNewSeedPhrase();
    setSeedPhrase(newSeedPhrase);
  }, []);

  const words = seedPhrase.split(" ");

  const generateNewSeedPhraseHandler = () => {
    const newSeedPhrase = generateNewSeedPhrase();
    setSeedPhrase(newSeedPhrase);
    setHasCopied(false);
    setHasConfirmed(false);
  };

  const copySeedPhrase = async () => {
    try {
      await Clipboard.setStringAsync(seedPhrase);
      setHasCopied(true);
      Alert.alert("Copied", "Seed phrase copied to clipboard");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Error", "Failed to copy seed phrase to clipboard");
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const confirmBackup = () => {
    setHasConfirmed(true);
  };

  const continueToNextStep = () => {
    if (!hasConfirmed) {
      Alert.alert(
        "Backup Required",
        "Please confirm you have backed up your seed phrase before continuing.",
        [{ text: "OK" }],
      );
      return;
    }
    onComplete(seedPhrase);
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <AppHeader
        title="Create Wallet"
        leftIcon={<ArrowLeft size={24} color="#000" />}
        onLeftPress={onBack}
      />

      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Your Seed Phrase
          </Text>
          <Text className="text-center text-gray-600 dark:text-gray-400 mt-2 px-4">
            This is your wallet's recovery phrase. Write it down and keep it in
            a secure location.
          </Text>
        </View>

        <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={generateNewSeedPhraseHandler}
              className="bg-gray-200 dark:bg-gray-700 rounded-full p-2"
            >
              <RefreshCw size={20} color="#4b5563" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleVisibility}
              className="bg-gray-200 dark:bg-gray-700 rounded-full p-2"
            >
              {isVisible ? (
                <EyeOff size={20} color="#4b5563" />
              ) : (
                <Eye size={20} color="#4b5563" />
              )}
            </TouchableOpacity>
          </View>

          {isVisible ? (
            <View className="flex-row flex-wrap justify-between">
              {words.map((word, index) => (
                <View
                  key={index}
                  className="w-[30%] bg-white dark:bg-gray-700 rounded-lg p-2 mb-3"
                >
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">
                    {index + 1}
                  </Text>
                  <Text className="font-medium text-gray-900 dark:text-white">
                    {word}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="h-48 items-center justify-center">
              <Shield size={48} color="#4b5563" />
              <Text className="text-gray-500 dark:text-gray-400 mt-2">
                Hidden for security
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Tap the eye icon to reveal
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={copySeedPhrase}
            className={`flex-row items-center justify-center mt-4 p-3 rounded-lg ${hasCopied ? "bg-green-100 dark:bg-green-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}
          >
            <Copy size={18} color={hasCopied ? "#059669" : "#3b82f6"} />
            <Text
              className={`ml-2 font-medium ${hasCopied ? "text-green-700 dark:text-green-400" : "text-blue-700 dark:text-blue-400"}`}
            >
              {hasCopied ? "Copied to Clipboard" : "Copy to Clipboard"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl mb-6">
          <Text className="text-yellow-800 dark:text-yellow-400 font-bold text-lg mb-2">
            Important Security Tips
          </Text>
          <Text className="text-yellow-700 dark:text-yellow-500 mb-2">
            • Never share your seed phrase with anyone
          </Text>
          <Text className="text-yellow-700 dark:text-yellow-500 mb-2">
            • Store it offline in multiple secure locations
          </Text>
          <Text className="text-yellow-700 dark:text-yellow-500 mb-2">
            • Anyone with this phrase can access your funds
          </Text>
          <Text className="text-yellow-700 dark:text-yellow-500">
            • If you lose it, you lose access to your wallet
          </Text>
        </View>

        <TouchableOpacity
          onPress={confirmBackup}
          className={`p-4 rounded-lg mb-4 ${hasConfirmed ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"}`}
        >
          <Text
            className={`text-center font-medium ${hasConfirmed ? "text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}
          >
            {hasConfirmed
              ? "✓ I have securely backed up my seed phrase"
              : "I have securely backed up my seed phrase"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="p-4 border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={continueToNextStep}
          className="bg-blue-600 dark:bg-blue-700 p-4 rounded-lg"
        >
          <Text className="text-white font-bold text-center">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateWalletScreen;
