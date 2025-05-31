import React, { createContext, JSX, useContext, useEffect, useState } from "react";

import { getThemeVariants, ThemeVariantType } from "@/constants/Themes";
import { useColorScheme } from "react-native";
import {
  buildThemeVariants,
  ThemeVariants,
} from "@/utils/styles/buildThemeVariants";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const theme = useColorScheme() ?? "light";

  const [currentThemeVariant, setCurrentThemeVariant] =
    useState<ThemeVariantType>(localVariant);
  const [variants, setVariants] = useState<ThemeVariants>(
    buildThemeVariants(getThemeVariants(theme)[currentThemeVariant])
  );

  const changeVariant = async (variant: ThemeVariantType) => {
    setCurrentThemeVariant(variant);
    await AsyncStorage.setItem("themeVariant", variant);
  };

  useEffect(() => {
    setVariants(
      buildThemeVariants(getThemeVariants(theme)[currentThemeVariant])
    );
  }, [theme, currentThemeVariant]);

  return (
    <ThemesContext.Provider
      value={{
        theme,
        variants,
        currentThemeVariant,
        setCurrentThemeVariant: changeVariant,
      }}
    >
      {children}
    </ThemesContext.Provider>
  );
};
