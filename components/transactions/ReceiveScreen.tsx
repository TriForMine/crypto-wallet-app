import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ChevronLeft, Copy, Share2, QrCode } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";

interface ReceiveScreenProps {
  walletAddress?: string;
  selectedCurrency?: string;
  onBack?: () => void;
}

const ReceiveScreen = ({
  walletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  selectedCurrency = "ETH",
  onBack = () => {},
}: ReceiveScreenProps) => {
  const router = useRouter();
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Available cryptocurrencies
  const currencies = [
    { id: "ETH", name: "Ethereum" },
    { id: "BTC", name: "Bitcoin" },
    { id: "USDT", name: "Tether" },
    { id: "XRP", name: "Ripple" },
  ];

  // Handle copying address to clipboard
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(walletAddress);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 3000);
  };

  // Handle sharing address
  const shareAddress = async () => {
    try {
      await Share.share({
        message: `My ${selectedCurrency} wallet address: ${walletAddress}`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error sharing address:", error);
    }
  };

  // Format address for display (truncate middle)
  const formatAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.substring(0, 10)}...${address.substring(address.length - 10)}`;
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar style="light" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-8 pb-4 bg-gray-800">
        <TouchableOpacity onPress={onBack} className="p-2">
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">
          Receive {selectedCurrency}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Currency Selector */}
        <View className="mb-6 bg-gray-800 rounded-xl p-4">
          <Text className="text-white text-base mb-3">Select Currency</Text>
          <View className="flex-row flex-wrap">
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.id}
                className={`mr-2 mb-2 px-4 py-2 rounded-full ${currency.id === selectedCurrency ? "bg-blue-600" : "bg-gray-700"}`}
              >
                <Text className="text-white">{currency.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* QR Code */}
        <View className="items-center mb-6">
          <View className="bg-white p-6 rounded-xl">
            <Image
              source={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`}
              style={{ width: 200, height: 200 }}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Wallet Address */}
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-gray-400 text-sm mb-2">Wallet Address</Text>
          <View className="flex-row items-center justify-between bg-gray-700 rounded-lg p-3">
            <Text className="text-white flex-1" numberOfLines={1}>
              {formatAddress(walletAddress)}
            </Text>
            <TouchableOpacity onPress={copyToClipboard} className="ml-2 p-2">
              <Copy size={20} color={copiedToClipboard ? "#4ade80" : "#fff"} />
            </TouchableOpacity>
          </View>
          {copiedToClipboard && (
            <Text className="text-green-400 text-sm mt-2">
              Address copied to clipboard!
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity
            onPress={copyToClipboard}
            className="flex-1 mr-2 bg-gray-800 rounded-xl p-4 items-center"
          >
            <Copy size={24} color="#fff" />
            <Text className="text-white mt-2">Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={shareAddress}
            className="flex-1 ml-2 bg-gray-800 rounded-xl p-4 items-center"
          >
            <Share2 size={24} color="#fff" />
            <Text className="text-white mt-2">Share</Text>
          </TouchableOpacity>
        </View>

        {/* Information */}
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-white text-base mb-2">
            Important Information
          </Text>
          <Text className="text-gray-400 text-sm">
            • Only send {selectedCurrency} to this address.{"\n"}• Sending any
            other cryptocurrency may result in permanent loss.{"\n"}•
            Transactions may take several minutes to appear in your wallet.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReceiveScreen;
