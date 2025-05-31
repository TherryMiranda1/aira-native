import { Colors } from "@/constants/Colors";

export const buildDeleteBorderColor = (
  theme: "light" | "dark",
  isOnDeleteArea: boolean
) => ({
  borderColor: isOnDeleteArea ? Colors[theme].tint : Colors[theme].border,
});
