import React, { JSX } from "react";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemesContext } from "@/context/ThemeContext";
import { PressableButton } from "./PressableButton";
import { ICON_SIZES } from "@/constants/Icons";
import { router } from "expo-router";
import { StyleProp, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";

interface Props {
  link?: string;
  icon?: any;
  text?: string;
  children?: JSX.Element | JSX.Element[];
  iconComponent?: IconType;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
}

// Define the IconType enum here
export enum IconType {
  Entypo = "Entypo",
  FontAwesome = "FontAwesome",
  Ionicons = "Ionicons",
  AntDesign = "AntDesign",
}

// Map the icon types to the actual components
export const IconComponents: Record<IconType, React.ComponentType<any>> = {
  Entypo,
  FontAwesome,
  Ionicons,
  AntDesign,
};

export const PrimaryButton: React.FC<Props> = ({
  link,
  icon,
  text,
  children,
  iconComponent = IconType.AntDesign,
  onPress,
  style,
  iconSize = ICON_SIZES.MEDIUM,
}) => {
  const { theme, variants } = useThemesContext();
  const Component = IconComponents[iconComponent];

  return (
    <PressableButton
      style={[
        variants.tag,
        {
          borderColor: Colors[theme].border,
          backgroundColor: Colors[theme].tabIconSelected,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
          gap: 4,
        },
        style,
      ]}
      onPress={() => {
        onPress?.();
        if (link) {
          // @ts-ignore
          router.push(link);
        }
      }}
    >
      {children}
      {text && <ThemedText type="defaultSemiBold">{text}</ThemedText>}
      {icon && (
        <Component name={icon} size={iconSize} color={Colors[theme].icon} />
      )}
    </PressableButton>
  );
};
