import React from "react";
import { useRouter } from "expo-router";
import SendScreen from "../components/transactions/SendScreen";

export default function Send() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return <SendScreen onClose={handleBack} />;
}
