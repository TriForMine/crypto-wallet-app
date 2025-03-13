import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react-native";

interface AppHeaderProps {
  title: string;
  leftIcon?: React.ComponentType<any>;
  onLeftPress?: () => void;
}

// Placeholder AppHeader component since we can't import it properly
const AppHeader = ({
  title,
  leftIcon: LeftIcon,
  onLeftPress,
}: AppHeaderProps) => {
  return (
    <View className="h-16 flex-row items-center px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {LeftIcon && (
        <TouchableOpacity onPress={onLeftPress} className="mr-4">
          <LeftIcon size={24} color="#4b5563" />
        </TouchableOpacity>
      )}
      <Text className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </Text>
    </View>
  );
};

interface ImportWalletScreenProps {
  onComplete?: (seedPhrase: string) => void;
  onBack?: () => void;
}

const ImportWalletScreen = ({
  onComplete = () => {},
  onBack = () => {},
}: ImportWalletScreenProps) => {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [showPhrase, setShowPhrase] = useState(false);
  const [error, setError] = useState("");

  const validateSeedPhrase = (phrase: string) => {
    // Basic validation - check if it has 12, 15, 18, 21, or 24 words
    const words = phrase.trim().split(/\s+/);
    const validWordCounts = [12, 15, 18, 21, 24];

    if (!validWordCounts.includes(words.length)) {
      setError(
        `Invalid seed phrase. Expected 12, 15, 18, 21, or 24 words but got ${words.length}.`,
      );
      return false;
    }

    // Additional validation would be implemented here in a real app
    setError("");
    return true;
  };

  const handleImport = () => {
    if (validateSeedPhrase(seedPhrase)) {
      // In a real app, we would properly validate and process the seed phrase
      onComplete(seedPhrase);
    }
  };

  const toggleShowPhrase = () => {
    setShowPhrase(!showPhrase);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <AppHeader
        title="Import Wallet"
        leftIcon={ArrowLeft}
        onLeftPress={onBack}
      />

      <ScrollView className="flex-1 px-4 py-6">
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Import Existing Wallet
          </Text>
          <Text className="text-gray-600 dark:text-gray-300">
            Enter your seed phrase to restore your wallet. Make sure you're in a
            private location.
          </Text>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-700 dark:text-gray-300 font-medium">
              Seed Phrase
            </Text>
            <TouchableOpacity
              onPress={toggleShowPhrase}
              className="flex-row items-center"
            >
              {showPhrase ? (
                <Eye size={18} color="#6b7280" />
              ) : (
                <EyeOff size={18} color="#6b7280" />
              )}
              <Text className="text-gray-500 dark:text-gray-400 ml-1">
                {showPhrase ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="relative">
            <TextInput
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-gray-900 dark:text-white min-h-[120px] text-base"
              placeholder="Enter your 12, 15, 18, 21, or 24 word seed phrase, separated by spaces"
              placeholderTextColor="#9ca3af"
              value={seedPhrase}
              onChangeText={setSeedPhrase}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showPhrase}
            />
          </View>

          {error ? (
            <View className="flex-row items-center mt-2">
              <AlertCircle size={16} color="#ef4444" />
              <Text className="text-red-500 ml-1">{error}</Text>
            </View>
          ) : null}
        </View>

        <View className="mb-4">
          <Text className="text-amber-600 dark:text-amber-400 font-medium mb-2 flex-row items-center">
            <AlertCircle size={16} color="#d97706" className="mr-1" />
            Security Warning
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-sm">
            Never share your seed phrase with anyone. Anyone with your seed
            phrase can access and control your funds.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleImport}
          className={`rounded-lg py-4 px-6 ${seedPhrase.trim() ? "bg-blue-600" : "bg-blue-400"} flex-row justify-center items-center`}
          disabled={!seedPhrase.trim()}
        >
          <Check size={20} color="#ffffff" />
          <Text className="text-white font-semibold ml-2">Import Wallet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ImportWalletScreen;
