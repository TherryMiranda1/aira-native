import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { NotesContainer } from "@/context/NotesContext";
import { CategoriesContainer } from "@/context/CategoriesContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratItalic: require("../assets/fonts/Montserrat-Italic.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    CormorantSemiBold: require("../assets/fonts/CormorantGaramond-SemiBold.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={
        "pk_test_dXByaWdodC1idXp6YXJkLTQ1LmNsZXJrLmFjY291bnRzLmRldiQ"
      }
    >
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
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </CategoriesContainer>
      </NotesContainer>
    </ClerkProvider>
  );
}
