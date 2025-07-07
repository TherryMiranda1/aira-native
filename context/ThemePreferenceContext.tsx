import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";
type ActualTheme = "light" | "dark";

interface ThemePreferenceContextType {
  themeMode: ThemeMode;
  actualTheme: ActualTheme;
  setThemeMode: (mode: ThemeMode) => void;
  isLoading: boolean;
}

const ThemePreferenceContext = createContext<ThemePreferenceContextType | undefined>(undefined);

interface ThemePreferenceProviderProps {
  children: ReactNode;
}

export const ThemePreferenceProvider = ({ children }: ThemePreferenceProviderProps) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);
  const systemColorScheme = useColorScheme();

  const actualTheme: ActualTheme = themeMode === "system" 
    ? (systemColorScheme || "light") 
    : themeMode;

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("themePreference");
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem("themePreference", mode);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  return (
    <ThemePreferenceContext.Provider
      value={{
        themeMode,
        actualTheme,
        setThemeMode,
        isLoading,
      }}
    >
      {children}
    </ThemePreferenceContext.Provider>
  );
};

export const useThemePreference = () => {
  const context = useContext(ThemePreferenceContext);
  if (context === undefined) {
    throw new Error("useThemePreference must be used within a ThemePreferenceProvider");
  }
  return context;
}; 