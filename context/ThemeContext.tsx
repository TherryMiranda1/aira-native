import React, { createContext, JSX, useContext, useEffect, useState } from "react";

import { getThemeVariants, ThemeVariantType } from "@/constants/Themes";
import {
  buildThemeVariants,
  ThemeVariants,
} from "@/utils/styles/buildThemeVariants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemePreference } from "./ThemePreferenceContext";

interface Props {
  children: JSX.Element | JSX.Element[];
  localVariant: ThemeVariantType;
}

interface ThemesReturnType {
  theme: "light" | "dark";
  variants: ThemeVariants;
  currentThemeVariant: ThemeVariantType;
  setCurrentThemeVariant: (theme: ThemeVariantType) => void;
}

const ThemesContext = createContext<ThemesReturnType>({} as ThemesReturnType);

export const useThemesContext = () => useContext(ThemesContext);

export const ThemesContainer = ({ children, localVariant }: Props) => {
  const { actualTheme } = useThemePreference();

  const [currentThemeVariant, setCurrentThemeVariant] =
    useState<ThemeVariantType>(localVariant);
  const [variants, setVariants] = useState<ThemeVariants>(
    buildThemeVariants(getThemeVariants(actualTheme)[currentThemeVariant])
  );

  const changeVariant = async (variant: ThemeVariantType) => {
    setCurrentThemeVariant(variant);
    await AsyncStorage.setItem("themeVariant", variant);
  };

  useEffect(() => {
    setVariants(
      buildThemeVariants(getThemeVariants(actualTheme)[currentThemeVariant])
    );
  }, [actualTheme, currentThemeVariant]);

  return (
    <ThemesContext.Provider
      value={{
        theme: actualTheme,
        variants,
        currentThemeVariant,
        setCurrentThemeVariant: changeVariant,
      }}
    >
      {children}
    </ThemesContext.Provider>
  );
};
