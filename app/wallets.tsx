import React from "react";
import { useRouter } from "expo-router";
import ManageWalletsScreen from "../components/wallet/ManageWalletsScreen";

export default function Wallets() {
  const router = useRouter();

  return <ManageWalletsScreen />;
}
