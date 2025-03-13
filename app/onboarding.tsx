import React from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import OnboardingScreen from "../components/onboarding/OnboardingScreen";

export default function Onboarding() {
  const router = useRouter();

  const handleOnboardingComplete = () => {
    // In a real app, we would save the wallet info securely
    SecureStore.setItemAsync("hasWallet", "true").catch(console.error);
    router.replace("/auth");
  };

  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
}
