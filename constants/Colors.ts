const brand = "#d8383e";

// Función para convertir colores HSL a HEX
// Útil para convertir colores de CSS a formato compatible con React Native
export const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};

export const Color_Pallete = {
  metal_black: "#0E0C0A",
  night_shadow: "#1C1C1C",
  crystal_white: "#FFFFFF",
  silver_storm: "#808080",
};

// Colores principales de Aira convertidos de HSL a HEX
export const AiraColors = {
  // Colores base
  background: "#F0F8FF", // 208 100% 97%
  foreground: "#394959", // 210 20% 30%

  card: "#FFFFFF", // 0 0% 100%
  cardForeground: "#394959", // 210 20% 30%

  popover: "#FFFFFF", // 0 0% 100%
  popoverForeground: "#394959", // 210 20% 30%

  primary: "#77B5FE", // 209 98% 73%
  primaryForeground: "#F5FAFF", // 210 60% 98%

  secondary: "#D6EBFF", // 208 100% 92%
  secondaryForeground: "#394959", // 210 20% 30%

  muted: "#CCE4FF", // 208 100% 90%
  mutedForeground: "#738399", // 210 10% 55%

  accent: "#A9DFBF", // 149 46% 78%
  accentForeground: "#1F4D33", // 140 30% 25%

  destructive: "#E03F3F", // 0 84.2% 60.2%
  destructiveForeground: "#F8FAFC", // 0 0% 98%

  border: "#B3D9FF", // 208 100% 88%
  input: "#FFFFFF", // 0 0% 100%
  ring: "#77B5FE", // 209 98% 73%

  // Colores personalizados de Aira
  airaCreamy: "#FFFAEB", // 48 100% 96%
  airaLavender: "#F5F0FF", // 258 100% 95%
  airaLavenderSoft: "#F9F5FF", // 258 60% 97%
  airaSage: "#D9E5D6", // 140 30% 90%
  airaSageSoft: "#EFF5ED", // 140 20% 95%
  airaCoral: "#FFE5D9", // 15 100% 90%
  airaCoralSoft: "#FFF1EB", // 15 60% 95%
  airaEarth: "#E6D2B3", // 35 50% 85%
};

// Versión con transparencia para ciertos elementos
export const AiraColorsWithAlpha = {
  backgroundWithOpacity: (opacity: number) => `rgba(240, 248, 255, ${opacity})`,
  cardWithOpacity: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
  primaryWithOpacity: (opacity: number) => `rgba(119, 181, 254, ${opacity})`,
  primaryForegroundWithOpacity: (opacity: number) =>
    `rgba(245, 250, 255, ${opacity})`,
  foregroundWithOpacity: (opacity: number) => `rgba(57, 73, 89, ${opacity})`,
  borderWithOpacity: (opacity: number) => `rgba(179, 217, 255, ${opacity})`,
  lavenderWithOpacity: (opacity: number) => `rgba(245, 240, 255, ${opacity})`,
  sageWithOpacity: (opacity: number) => `rgba(217, 229, 214, ${opacity})`,
  coralWithOpacity: (opacity: number) => `rgba(255, 229, 217, ${opacity})`,
  destructiveWithOpacity: (opacity: number) => `rgba(224, 63, 63, ${opacity})`,
};

export const Colors = {
  ["light"]: {
    text: AiraColors.foreground,
    secondaryText: AiraColors.mutedForeground,
    placeholderText: AiraColors.mutedForeground,
    textNegative: AiraColors.background,
    background: AiraColors.background,
    backgroundSecondary: AiraColors.secondary,
    backgroundNegative: AiraColors.foreground,
    backgroundView: AiraColors.muted,
    backgroundViewTransparent: AiraColorsWithAlpha.backgroundWithOpacity(0.8),
    backgroundCard: AiraColors.card,
    backgroundCardTransparent: AiraColorsWithAlpha.cardWithOpacity(0.8),
    tint: AiraColors.primary,
    icon: AiraColors.mutedForeground,
    iconNegative: AiraColors.mutedForeground,
    tabIconDefault: AiraColors.mutedForeground,
    tabIconSelected: AiraColors.primary,
    border: AiraColors.border,
  },
  ["dark"]: {
    text: "#ECEDEE",
    secondaryText: "#dcdcdc",
    placeholderText: "#9BA1A6",
    textNegative: "#11181C",
    background: "#151718",
    backgroundSecondary: "#1b1b1b",
    backgroundNegative: "#fff",
    backgroundView: "#0E0C0A",
    backgroundViewTransparent: "rgba(14, 12, 10, 0.8)",
    backgroundCard: "#151718",
    backgroundCardTransparent: "rgba(21, 23, 24,0.8)",
    tint: AiraColors.primary,
    icon: "#9BA1A6",
    iconNegative: "#687076",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: AiraColors.primary,
    border: "#454545",
  },
};
