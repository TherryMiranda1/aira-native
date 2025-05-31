import { UiTheme } from "@/constants/Themes";

type Style = Record<string, string | number>;
export interface ThemeVariants {
  list: Style;
  areaTransparent: Style;
  selectableTag: Style;
  selectableCard: Style;
  card: Style;
  cardTransparent: Style;
  secondaryCard: Style;
  elevatedCard: Style;
  media: Style;
  input: Style;
  tag: Style;
  highlightIcon: Style;
  primaryButton: Style;
  secondaryButton: Style;
}

export const buildThemeVariants = (currentTheme: UiTheme) => ({
  list: {
    backgroundColor: currentTheme.backgroundView,
  },
  areaTransparent: {
    backgroundColor: currentTheme.backgroundCardTransparent,
  },
  selectableTag: {
    borderRadius: currentTheme.cardRadius,
  },
  selectableCard: {
    borderRadius: currentTheme.cardRadius,
  },
  card: {
    backgroundColor: currentTheme.backgroundCard,
    borderWidth: currentTheme.border ? 1 : 0,
    borderRadius: currentTheme.cardRadius,
    borderColor: currentTheme.colors.border,
  },
  cardTransparent: {
    backgroundColor: currentTheme.backgroundCardTransparent,
    borderWidth: currentTheme.border ? 1 : 0,
    borderRadius: currentTheme.cardRadius,
    borderColor: currentTheme.colors.border,
  },
  secondaryCard: {
    backgroundColor: currentTheme.backgroundView,
    borderWidth: currentTheme.border ? 1 : 0,
    borderRadius: currentTheme.cardRadius,
  },
  elevatedCard: {
    backgroundColor: currentTheme.colors.backgroundSecondary,
    borderWidth: currentTheme.border ? 1 : 0,
    borderRadius: currentTheme.cardRadius,
    borderColor: currentTheme.colors.border,
  },
  media: {
    borderColor: currentTheme.colors.border,
    borderWidth: currentTheme.border ? 1 : 0,
    borderRadius: currentTheme.cardRadius,
  },
  input: {
    backgroundColor: currentTheme.backgroundView,
    borderWidth: currentTheme.border ? 1 : 0,
    borderRadius: currentTheme.cardRadius,
    borderColor: currentTheme.colors.border,
  },
  tag: {
    backgroundColor: currentTheme.colors.backgroundSecondary,
    borderRadius: currentTheme.cardRadius,
  },
  highlightIcon: {
    borderWidth: currentTheme.border ? 1 : 0,
    borderRadius: currentTheme.cardRadius,
  },
  primaryButton: {
    backgroundColor: currentTheme.colors.tint,
    borderRadius: currentTheme.tagRadius,
  },
  secondaryButton: {
    borderColor: currentTheme.colors.border,
    borderRadius: currentTheme.tagRadius,
  },
});
