import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
} from "lucide-react-native";

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
    <View className="h-16 flex-row items-center justify-between px-4 border-b border-gray-200">
      {leftIcon ? (
        <TouchableOpacity onPress={onLeftPress} className="p-2">
          {leftIcon}
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}

      <Text className="text-lg font-bold">{title}</Text>

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
  const [seedPhrase, setSeedPhrase] = useState<string>(
    "abandon ability able about above absent absorb abstract absurd abuse access accident",
  );
  const [isVisible, setIsVisible] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const words = seedPhrase.split(" ");

  const generateNewSeedPhrase = () => {
    // In a real implementation, this would use a secure library to generate a BIP-39 seed phrase
    const dummySeedPhrases = [
      "abandon ability able about above absent absorb abstract absurd abuse access accident",
      "zoo youth water volcano utility upgrade table athlete abuse acoustic armed auction",
      "magic kingdom jungle island harvest galaxy exit dawn curious broken butterfly attract",
    ];
    const randomIndex = Math.floor(Math.random() * dummySeedPhrases.length);
    setSeedPhrase(dummySeedPhrases[randomIndex]);
    setHasCopied(false);
    setHasConfirmed(false);
  };

  const copySeedPhrase = () => {
    // In a real implementation, this would use Clipboard.setString(seedPhrase)
    setHasCopied(true);
    Alert.alert("Copied", "Seed phrase copied to clipboard");
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
    <View className="flex-1 bg-white">
      <AppHeader
        title="Create Wallet"
        leftIcon={<ArrowLeft size={24} color="#000" />}
        onLeftPress={onBack}
      />

      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-2xl font-bold text-center">
            Your Seed Phrase
          </Text>
          <Text className="text-center text-gray-600 mt-2 px-4">
            This is your wallet's recovery phrase. Write it down and keep it in
            a secure location.
          </Text>
        </View>

        <View className="bg-gray-100 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={generateNewSeedPhrase}
              className="bg-gray-200 rounded-full p-2"
            >
              <RefreshCw size={20} color="#4b5563" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleVisibility}
              className="bg-gray-200 rounded-full p-2"
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
                  className="w-[30%] bg-white rounded-lg p-2 mb-3"
                >
                  <Text className="text-gray-500 text-xs">{index + 1}</Text>
                  <Text className="font-medium">{word}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="h-48 items-center justify-center">
              <Shield size={48} color="#4b5563" />
              <Text className="text-gray-500 mt-2">Hidden for security</Text>
              <Text className="text-gray-500 text-xs mt-1">
                Tap the eye icon to reveal
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={copySeedPhrase}
            className={`flex-row items-center justify-center mt-4 p-3 rounded-lg ${hasCopied ? "bg-green-100" : "bg-blue-100"}`}
          >
            <Copy size={18} color={hasCopied ? "#059669" : "#3b82f6"} />
            <Text
              className={`ml-2 font-medium ${hasCopied ? "text-green-700" : "text-blue-700"}`}
            >
              {hasCopied ? "Copied to Clipboard" : "Copy to Clipboard"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-yellow-50 p-4 rounded-xl mb-6">
          <Text className="text-yellow-800 font-bold text-lg mb-2">
            Important Security Tips
          </Text>
          <Text className="text-yellow-700 mb-2">
            • Never share your seed phrase with anyone
          </Text>
          <Text className="text-yellow-700 mb-2">
            • Store it offline in multiple secure locations
          </Text>
          <Text className="text-yellow-700 mb-2">
            • Anyone with this phrase can access your funds
          </Text>
          <Text className="text-yellow-700">
            • If you lose it, you lose access to your wallet
          </Text>
        </View>

        <TouchableOpacity
          onPress={confirmBackup}
          className={`p-4 rounded-lg mb-4 ${hasConfirmed ? "bg-green-100" : "bg-gray-100"}`}
        >
          <Text
            className={`text-center font-medium ${hasConfirmed ? "text-green-700" : "text-gray-700"}`}
          >
            {hasConfirmed
              ? "✓ I have securely backed up my seed phrase"
              : "I have securely backed up my seed phrase"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={continueToNextStep}
          className="bg-blue-600 p-4 rounded-lg"
        >
          <Text className="text-white font-bold text-center">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateWalletScreen;
