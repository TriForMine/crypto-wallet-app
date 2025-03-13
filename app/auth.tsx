import React from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AuthScreen from "../components/auth/AuthScreen";

export default function Auth() {
  const router = useRouter();

  const handleAuthComplete = () => {
    SecureStore.setItemAsync("isAuthenticated", "true").catch(console.error);
    router.replace("/dashboard");
  };

  return <AuthScreen onAuthenticated={handleAuthComplete} />;
}
