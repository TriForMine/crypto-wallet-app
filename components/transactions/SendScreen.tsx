import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Scan, Send, Info, ChevronDown } from "lucide-react-native";
import QRScanner from "./QRScanner";
import TransactionConfirmation from "./TransactionConfirmation";

interface SendScreenProps {
  onClose?: () => void;
}

const SendScreen = ({ onClose = () => {} }: SendScreenProps) => {
  const router = useRouter();
  const [step, setStep] = useState<
    "address" | "amount" | "confirmation" | "scanning"
  >("address");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("ETH");
  const [fee, setFee] = useState("0.002"); // Default network fee

  const currencies = [
    { symbol: "ETH", name: "Ethereum", balance: "1.245" },
    { symbol: "BTC", name: "Bitcoin", balance: "0.0324" },
    { symbol: "USDT", name: "Tether", balance: "150.00" },
  ];

  const handleScan = (data: string) => {
    setRecipientAddress(data);
    setStep("address");
  };

  const handleContinue = () => {
    if (step === "address" && recipientAddress) {
      setStep("amount");
    } else if (step === "amount" && amount) {
      setStep("confirmation");
    }
  };

  const handleBack = () => {
    if (step === "amount") {
      setStep("address");
    } else if (step === "confirmation") {
      setStep("amount");
    } else if (step === "scanning") {
      setStep("address");
    } else {
      onClose();
    }
  };

  const handleConfirmTransaction = () => {
    // In a real app, this would trigger the actual transaction
    // and biometric authentication
    alert("Transaction initiated!");
    onClose();
  };

  const renderHeader = () => (
    <View className="flex-row items-center justify-between p-4 bg-gray-900 mt-8">
      <TouchableOpacity onPress={handleBack}>
        <ArrowLeft size={24} color="#ffffff" />
      </TouchableOpacity>
      <Text className="text-white text-lg font-semibold">
        {step === "address" && "Send Crypto"}
        {step === "amount" && "Enter Amount"}
        {step === "confirmation" && "Confirm Transaction"}
        {step === "scanning" && "Scan QR Code"}
      </Text>
      <View style={{ width: 24 }} />
    </View>
  );

  const renderAddressStep = () => (
    <View className="flex-1 p-4">
      <Text className="text-white text-lg mb-2">Recipient Address</Text>
      <View className="flex-row items-center bg-gray-800 rounded-xl p-3 mb-4">
        <TextInput
          className="flex-1 text-white text-base"
          placeholder="Enter or paste address"
          placeholderTextColor="#9ca3af"
          value={recipientAddress}
          onChangeText={setRecipientAddress}
        />
        <TouchableOpacity
          className="ml-2 bg-gray-700 p-2 rounded-lg"
          onPress={() => setStep("scanning")}
        >
          <Scan size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <Text className="text-white text-lg mb-2">Select Currency</Text>
      <View className="bg-gray-800 rounded-xl mb-6">
        {currencies.map((currency, index) => (
          <TouchableOpacity
            key={currency.symbol}
            className={`flex-row items-center justify-between p-4 ${index !== currencies.length - 1 ? "border-b border-gray-700" : ""}`}
            onPress={() => setSelectedCurrency(currency.symbol)}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">
                  {currency.symbol.substring(0, 1)}
                </Text>
              </View>
              <View>
                <Text className="text-white font-semibold">
                  {currency.name}
                </Text>
                <Text className="text-gray-400">{currency.symbol}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white mr-2">{currency.balance}</Text>
              {selectedCurrency === currency.symbol && (
                <View className="w-4 h-4 bg-green-500 rounded-full" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className={`bg-blue-600 p-4 rounded-xl flex-row justify-center items-center ${!recipientAddress ? "opacity-50" : ""}`}
        onPress={handleContinue}
        disabled={!recipientAddress}
      >
        <Text className="text-white font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAmountStep = () => {
    const selectedCurrencyObj = currencies.find(
      (c) => c.symbol === selectedCurrency,
    );
    const maxAmount = selectedCurrencyObj ? selectedCurrencyObj.balance : "0";

    return (
      <View className="flex-1 p-4">
        <View className="items-center mb-6">
          <Text className="text-gray-400 mb-2">Available Balance</Text>
          <Text className="text-white text-2xl font-bold">
            {maxAmount} {selectedCurrency}
          </Text>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-400">Amount</Text>
            <TouchableOpacity
              className="flex-row items-center bg-gray-700 px-3 py-1 rounded-lg"
              onPress={() => {}}
            >
              <Text className="text-white mr-1">{selectedCurrency}</Text>
              <ChevronDown size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between">
            <TextInput
              className="text-white text-3xl font-bold flex-1"
              placeholder="0"
              placeholderTextColor="#4b5563"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity
              className="bg-blue-600 px-3 py-1 rounded-lg"
              onPress={() => setAmount(maxAmount)}
            >
              <Text className="text-white font-semibold">MAX</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-gray-400 mt-2">
            ≈ ${amount ? (parseFloat(amount) * 3000).toFixed(2) : "0.00"} USD
          </Text>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Text className="text-white mr-2">Network Fee</Text>
              <TouchableOpacity>
                <Info size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <Text className="text-white">
              {fee} {selectedCurrency}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className={`bg-blue-600 p-4 rounded-xl flex-row justify-center items-center ${!amount ? "opacity-50" : ""}`}
          onPress={handleContinue}
          disabled={!amount}
        >
          <Send size={20} color="#ffffff" className="mr-2" />
          <Text className="text-white font-bold text-lg">
            Review Transaction
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (step === "scanning") {
    return <QRScanner onScan={handleScan} onClose={() => setStep("address")} />;
  }

  if (step === "confirmation") {
    return (
      <TransactionConfirmation
        recipientAddress={recipientAddress}
        amount={amount}
        currency={selectedCurrency}
        fee={fee}
        total={(parseFloat(amount) + parseFloat(fee)).toString()}
        onConfirm={handleConfirmTransaction}
        onCancel={handleBack}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-900"
    >
      {renderHeader()}
      <ScrollView className="flex-1">
        {step === "address" && renderAddressStep()}
        {step === "amount" && renderAmountStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SendScreen;
