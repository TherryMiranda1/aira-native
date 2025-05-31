import React from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import { iconButtonStyles } from "./Button.styles";

interface PressableButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  isMedia?: boolean;
}

export const PressableButton = ({
  children,
  style,
  isMedia = false,
  ...rest
}: PressableButtonProps) => {
  const pressedOpacity = isMedia ? 0.8 : 0.5;
  return (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? pressedOpacity : 1 },
        iconButtonStyles.button,
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
};
