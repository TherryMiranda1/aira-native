import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { StyleProp, ViewStyle } from "react-native";

export interface ThemedGradientProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ThemedGradient = ({ children, style }: ThemedGradientProps) => {
  const firstColor = useThemeColor({}, "airaLavender");
  const secondColor = useThemeColor({}, "airaSage");
  const thirdColor = useThemeColor({}, "airaCoral");
  const fourthColor = useThemeColor({}, "background");
  return (
    <LinearGradient
      colors={[firstColor, secondColor, thirdColor, fourthColor]}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};
