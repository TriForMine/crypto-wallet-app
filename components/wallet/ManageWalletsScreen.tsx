import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  PlusCircle,
  Edit,
  Trash2,
  Download,
  ChevronRight,
  Shield,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface Wallet {
  id: string;
  name: string;
  type: string;
  lastBackup?: string;
  isDefault?: boolean;
}

interface ManageWalletsScreenProps {
  wallets?: Wallet[];
  onAddWallet?: () => void;
  onEditWallet?: (wallet: Wallet) => void;
  onBackupWallet?: (wallet: Wallet) => void;
  onDeleteWallet?: (wallet: Wallet) => void;
}

const ManageWalletsScreen = ({
  wallets = [
    {
      id: "1",
      name: "Main Wallet",
      type: "Multi-coin",
      lastBackup: "2023-10-15",
      isDefault: true,
    },
    {
      id: "2",
      name: "Bitcoin Only",
      type: "BTC",
      lastBackup: "2023-09-22",
    },
    {
      id: "3",
      name: "Ethereum DeFi",
      type: "ETH",
      lastBackup: "2023-10-01",
    },
  ],
  onAddWallet = () => {},
  onEditWallet = () => {},
  onBackupWallet = () => {},
  onDeleteWallet = () => {},
}: ManageWalletsScreenProps) => {
  const router = useRouter();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const handleAddWallet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAddWallet();
    // In a real implementation, this would navigate to wallet creation flow
    // router.push('/create-wallet');
  };

  const handleEditWallet = (wallet: Wallet) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEditWallet(wallet);
    setSelectedWallet(wallet);
  };

  const handleBackupWallet = (wallet: Wallet) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onBackupWallet(wallet);
    // In a real implementation, this would trigger biometric auth before showing seed phrase
    Alert.alert(
      "Backup Wallet",
      "This would trigger biometric authentication before showing the seed phrase.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
    );
  };

  const handleDeleteWallet = (wallet: Wallet) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Confirmation dialog before deletion
    Alert.alert(
      "Delete Wallet",
      `Are you sure you want to delete "${wallet.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeleteWallet(wallet);
            // In a real implementation, this would actually delete the wallet
          },
        },
      ],
    );
  };

  // Header component
  const Header = () => (
    <View className="h-16 bg-gray-900 border-b border-gray-800 px-4 flex-row items-center mt-8">
      <TouchableOpacity onPress={() => router.back()}>
        <ChevronRight
          size={24}
          color="#ffffff"
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      </TouchableOpacity>
      <Text className="text-white text-xl font-semibold ml-4">
        Manage Wallets
      </Text>
    </View>
  );

  // Bottom Navigation component
  const Navigation = () => (
    <View className="h-20 bg-gray-800 border-t border-gray-700 flex-row justify-around items-center px-4">
      <TouchableOpacity className="items-center">
        <View className="bg-gray-700 p-2 rounded-full mb-1">
          <PlusCircle size={20} color="#e5e7eb" />
        </View>
        <Text className="text-gray-300 text-xs">Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center">
        <View className="bg-gray-700 p-2 rounded-full mb-1">
          <Download size={20} color="#e5e7eb" />
        </View>
        <Text className="text-gray-300 text-xs">Receive</Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center">
        <View className="bg-blue-600 p-2 rounded-full mb-1">
          <Edit size={20} color="#ffffff" />
        </View>
        <Text className="text-white text-xs">Send</Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center">
        <View className="bg-gray-700 p-2 rounded-full mb-1">
          <Shield size={20} color="#e5e7eb" />
        </View>
        <Text className="text-gray-300 text-xs">Security</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900">
      <Header />

      <ScrollView className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-4"
            onPress={handleAddWallet}
          >
            <View className="flex-row items-center">
              <PlusCircle size={24} color="#22c55e" />
              <Text className="text-white text-lg font-semibold ml-3">
                Add New Wallet
              </Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>

          <Text className="text-gray-400 text-sm mb-2 px-1">YOUR WALLETS</Text>

          {wallets.map((wallet) => (
            <View
              key={wallet.id}
              className="bg-gray-800 rounded-xl mb-3 overflow-hidden"
            >
              <TouchableOpacity
                className="p-4"
                onPress={() =>
                  setSelectedWallet(
                    selectedWallet?.id === wallet.id ? null : wallet,
                  )
                }
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <View className="flex-row items-center">
                      <Text className="text-white text-lg font-semibold">
                        {wallet.name}
                      </Text>
                      {wallet.isDefault && (
                        <View className="bg-blue-900 px-2 py-1 rounded-full ml-2">
                          <Text className="text-blue-300 text-xs">Default</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-400 mt-1">{wallet.type}</Text>
                  </View>
                  <ChevronRight
                    size={20}
                    color="#9ca3af"
                    style={{
                      transform: [
                        {
                          rotate:
                            selectedWallet?.id === wallet.id ? "90deg" : "0deg",
                        },
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>

              {selectedWallet?.id === wallet.id && (
                <View className="bg-gray-700 px-4 py-3">
                  <View className="flex-row items-center justify-between py-2 border-b border-gray-600">
                    <Text className="text-gray-300">Last backup</Text>
                    <Text className="text-gray-300">
                      {wallet.lastBackup || "Never"}
                    </Text>
                  </View>

                  <View className="flex-row mt-4 mb-2 justify-around">
                    <TouchableOpacity
                      className="items-center"
                      onPress={() => handleEditWallet(wallet)}
                    >
                      <View className="bg-gray-600 p-3 rounded-full mb-1">
                        <Edit size={20} color="#e5e7eb" />
                      </View>
                      <Text className="text-gray-300 text-xs">Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="items-center"
                      onPress={() => handleBackupWallet(wallet)}
                    >
                      <View className="bg-gray-600 p-3 rounded-full mb-1">
                        <Download size={20} color="#e5e7eb" />
                      </View>
                      <Text className="text-gray-300 text-xs">Backup</Text>
                    </TouchableOpacity>

                    {!wallet.isDefault && (
                      <TouchableOpacity
                        className="items-center"
                        onPress={() => handleDeleteWallet(wallet)}
                      >
                        <View className="bg-red-900/30 p-3 rounded-full mb-1">
                          <Trash2 size={20} color="#f87171" />
                        </View>
                        <Text className="text-red-400 text-xs">Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        <View className="mb-6 bg-gray-800 p-4 rounded-xl">
          <View className="flex-row items-center mb-3">
            <Shield size={20} color="#22d3ee" />
            <Text className="text-white text-lg font-semibold ml-2">
              Security Tips
            </Text>
          </View>
          <Text className="text-gray-300 mb-2">
            • Always backup your wallets regularly
          </Text>
          <Text className="text-gray-300 mb-2">
            • Never share your seed phrase with anyone
          </Text>
          <Text className="text-gray-300 mb-2">
            • Keep at least one offline backup of your seed phrases
          </Text>
          <Text className="text-gray-300">
            • Consider using a hardware wallet for large amounts
          </Text>
        </View>

        {/* Spacer for bottom navigation */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default ManageWalletsScreen;
