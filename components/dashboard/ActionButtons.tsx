import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react-native";

interface ActionButtonsProps {
  onSend?: () => void;
  onReceive?: () => void;
  onHistory?: () => void;
}

const ActionButtons = ({
  onSend = () => console.log("Send pressed"),
  onReceive = () => console.log("Receive pressed"),
  onHistory = () => console.log("History pressed"),
}: ActionButtonsProps) => {
  return (
    <View className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          className="flex-1 items-center py-3 mx-2 bg-blue-500 rounded-lg"
          onPress={onSend}
        >
          <View className="items-center">
            <View className="bg-blue-400 p-2 rounded-full mb-2">
              <ArrowUpRight size={24} color="white" />
            </View>
            <Text className="text-white font-medium">Send</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center py-3 mx-2 bg-green-500 rounded-lg"
          onPress={onReceive}
        >
          <View className="items-center">
            <View className="bg-green-400 p-2 rounded-full mb-2">
              <ArrowDownLeft size={24} color="white" />
            </View>
            <Text className="text-white font-medium">Receive</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center py-3 mx-2 bg-purple-500 rounded-lg"
          onPress={onHistory}
        >
          <View className="items-center">
            <View className="bg-purple-400 p-2 rounded-full mb-2">
              <Clock size={24} color="white" />
            </View>
            <Text className="text-white font-medium">History</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActionButtons;
