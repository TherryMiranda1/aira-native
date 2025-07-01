import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Alert, Platform } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { NotesContainer } from "@/context/NotesContext";
import { CategoriesContainer } from "@/context/CategoriesContext";
import { NotificationProvider } from "@/components/ui/notifications";
import Purchases from "react-native-purchases";
Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratItalic: require("../assets/fonts/Montserrat-Italic.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    CormorantSemiBold: require("../assets/fonts/CormorantGaramond-SemiBold.ttf"),
  });

  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    if (Platform.OS === "ios") {
      if (!process.env.EXPO_PUBLIC_RC_IOS) {
        Alert.alert("Error", "EXPO_PUBLIC_RC_IOS is not set");
        return;
      }
      Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_IOS });
    } else if (Platform.OS === "android") {
      if (!process.env.EXPO_PUBLIC_RC_ANDROID) {
        Alert.alert("Error", "EXPO_PUBLIC_RC_ANDROID is not set");
        return;
      }
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
      <NotificationProvider>
        <NotesContainer>
          <CategoriesContainer>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="dashboard" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="default-paywall" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ThemeProvider>
          </CategoriesContainer>
        </NotesContainer>
      </NotificationProvider>
    </ClerkProvider>
  );
}
