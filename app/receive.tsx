import React from "react";
import { useRouter } from "expo-router";
import ReceiveScreen from "../components/transactions/ReceiveScreen";

export default function Receive() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return <ReceiveScreen onBack={handleBack} />;
}
