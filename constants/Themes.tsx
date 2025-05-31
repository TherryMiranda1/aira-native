import { Colors } from "./Colors";

export interface UiTheme {
  colors: Record<string, string>;
  border: boolean;
  shadow: boolean;
  cardRadius: number;
  tagRadius: number;
  backgroundView: string;
  backgroundCard: string;
  backgroundCardTransparent: string;
  backgroundViewTransparent: string;
}

export enum ThemeVariantType {
  BORDER_ROUNDED = "BORDER_ROUNDED",
  BORDER_SQUARED = "BORDER_SQUARED",
  BUBBLE = "BUBBLE",
  BUBBLE_SQUARED = "BUBBLE_SQUARED",
  ZEN = "ZEN",
}

export const themeOptions = [
  {
    id: 1,
    title: "Bubble",
    type: ThemeVariantType.BUBBLE,
  },
  {
    id: 2,
    title: "Bubble Squared",
    type: ThemeVariantType.BUBBLE_SQUARED,
  },
  {
    id: 3,
    title: "Border Rounded",
    type: ThemeVariantType.BORDER_ROUNDED,
  },
  {
    id: 4,
    title: "Border Squared",
    type: ThemeVariantType.BORDER_SQUARED,
  },
  {
    id: 5,
    title: "Zen",
    type: ThemeVariantType.ZEN,
  },
];

export const getThemeVariants = (theme: "light" | "dark") => ({
  [ThemeVariantType.BORDER_ROUNDED]: {
    colors: Colors[theme],
    border: true,
    shadow: false,
    cardRadius: 12,
    tagRadius: 50,
    backgroundView: Colors[theme].backgroundCard,
    backgroundCard: Colors[theme].backgroundCard,
    backgroundCardTransparent: Colors[theme].backgroundCardTransparent,
    backgroundViewTransparent: Colors[theme].backgroundViewTransparent,
  },
  [ThemeVariantType.BORDER_SQUARED]: {
    colors: Colors[theme],
    border: true,
    shadow: false,
    cardRadius: 4,
    tagRadius: 4,
    backgroundView: Colors[theme].backgroundCard,
    backgroundCard: Colors[theme].backgroundCard,
    backgroundCardTransparent: Colors[theme].backgroundCardTransparent,
    backgroundViewTransparent: Colors[theme].backgroundViewTransparent,
  },
  [ThemeVariantType.ZEN]: {
    colors: Colors[theme],
    border: false,
    shadow: false,
    cardRadius: 0,
    tagRadius: 0,
    backgroundView: Colors[theme].backgroundView,
    backgroundCard: Colors[theme].backgroundView,
    backgroundCardTransparent: Colors[theme].backgroundCardTransparent,
    backgroundViewTransparent: Colors[theme].backgroundViewTransparent,
  },
  [ThemeVariantType.BUBBLE]: {
    colors: Colors[theme],
    border: false,
    shadow: false,
    cardRadius: 12,
    tagRadius: 50,
    backgroundView: Colors[theme].backgroundView,
    backgroundCard: Colors[theme].backgroundCard,
    backgroundCardTransparent: Colors[theme].backgroundCardTransparent,
    backgroundViewTransparent: Colors[theme].backgroundViewTransparent,
  },
  [ThemeVariantType.BUBBLE_SQUARED]: {
    colors: Colors[theme],
    border: false,
    shadow: false,
    cardRadius: 4,
    tagRadius: 4,
    backgroundView: Colors[theme].backgroundView,
    backgroundCard: Colors[theme].backgroundCard,
    backgroundCardTransparent: Colors[theme].backgroundCardTransparent,
    backgroundViewTransparent: Colors[theme].backgroundViewTransparent,
  },
});

export const AiraVariants = {
  cardRadius: 12,
  tagRadius: 50,
};
