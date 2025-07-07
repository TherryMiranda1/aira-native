import { Platform } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import { NotificationProvider } from "@/components/ui/notifications";
import { ThemePreferenceProvider } from "@/context/ThemePreferenceContext";
import Purchases from "react-native-purchases";
Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratItalic: require("../assets/fonts/Montserrat-Italic.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    CormorantSemiBold: require("../assets/fonts/CormorantGaramond-SemiBold.ttf"),
  });

  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    if (Platform.OS === "android") {
      Purchases.configure({ apiKey: "goog_YGbPRMuuRtsvhNqQeCuzOZbifIv" });
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={
        "pk_test_dXByaWdodC1idXp6YXJkLTQ1LmNsZXJrLmFjY291bnRzLmRldiQ"
      }
    >
      <ThemePreferenceProvider>
        <NotificationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="default-paywall" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </NotificationProvider>
      </ThemePreferenceProvider>
    </ClerkProvider>
  );
}
