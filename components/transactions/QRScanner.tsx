import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import { Scan, X } from "lucide-react-native";

interface QRScannerProps {
  onScan?: (data: string) => void;
  onClose?: () => void;
}

const QRScanner = ({
  onScan = () => {},
  onClose = () => {},
}: QRScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    // Validate if the scanned data is a valid cryptocurrency address
    // This is a simplified validation - in a real app, you would implement proper validation
    if (data.length > 25) {
      onScan(data);
    } else {
      Alert.alert(
        "Invalid Address",
        "The scanned QR code does not contain a valid cryptocurrency address.",
      );
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-white text-lg">
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-white text-lg mb-4">No access to camera</Text>
        <Text className="text-gray-300 text-center mx-4 mb-6">
          Please grant camera permissions in your device settings to scan QR
          codes.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg"
          onPress={handleClose}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <Camera
        className="flex-1"
        type={Camera.Constants.Type.back}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View className="flex-1 justify-between">
          {/* Overlay with scanning frame */}
          <View className="flex-1 items-center justify-center">
            <View className="w-64 h-64 border-2 border-white rounded-lg opacity-70" />
            <View className="absolute top-1/2 left-1/2 -ml-4 -mt-4">
              <Scan size={32} color="white" />
            </View>
          </View>

          {/* Bottom controls */}
          <View className="bg-black bg-opacity-50 p-4">
            <Text className="text-white text-center mb-4">
              Position the QR code within the frame to scan
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-red-500 p-3 rounded-full"
                onPress={handleClose}
              >
                <X size={24} color="white" />
              </TouchableOpacity>

              {scanned && (
                <TouchableOpacity
                  className="bg-blue-500 p-3 rounded-full"
                  onPress={() => setScanned(false)}
                >
                  <Scan size={24} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Camera>
    </View>
  );
};

export default QRScanner;
