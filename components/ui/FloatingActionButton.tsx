import React, { useRef, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors } from "@/constants/Colors";
import { SHADOWS } from "@/constants/Shadows";
import { AiraVariants } from "@/constants/Themes";
import { ThemedText } from "../ThemedText";

interface FloatingActionButtonProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  text?: string;
  showText?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  bottomPadding?: number;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary";
}

const BUTTON_SIZES = {
  small: { size: 48, iconSize: 20 },
  medium: { size: 56, iconSize: 24 },
  large: { size: 64, iconSize: 28 },
};

const ANIMATION_CONFIG = {
  duration: 250,
  useNativeDriver: false,
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  iconName,
  text,
  showText = false,
  style,
  disabled = false,
  bottomPadding = 0,
  size = "medium",
  variant = "primary",
}) => {
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonWidth = useRef(
    new Animated.Value(BUTTON_SIZES[size].size)
  ).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const { size: buttonSize, iconSize } = BUTTON_SIZES[size];
  const expandedWidth = useMemo(() => {
    if (!text) return buttonSize;
    const textLength = text.length;
    return Math.max(buttonSize + textLength * 8 + 32, 120);
  }, [text, buttonSize]);

  const animateButton = useCallback(
    (expand: boolean) => {
      const animations = [
        Animated.timing(textOpacity, {
          toValue: expand ? 1 : 0,
          duration: expand
            ? ANIMATION_CONFIG.duration
            : ANIMATION_CONFIG.duration * 0.8,
          useNativeDriver: false,
        }),
        Animated.timing(buttonWidth, {
          toValue: expand ? expandedWidth : buttonSize,
          duration: ANIMATION_CONFIG.duration,
          useNativeDriver: false,
        }),
      ];

      Animated.parallel(animations).start();
    },
    [textOpacity, buttonWidth, expandedWidth, buttonSize]
  );

  useEffect(() => {
    animateButton(showText && !!text);
  }, [showText, text, animateButton]);

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }).start();
    }
  }, [disabled, scaleValue]);

  const handlePressOut = useCallback(() => {
    if (!disabled) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }).start();
    }
  }, [disabled, scaleValue]);

  const buttonStyles = useMemo(() => {
    const baseStyles = [
      styles.button,
      {
        height: buttonSize,
        backgroundColor:
          variant === "primary" ? AiraColors.foreground : AiraColors.background,
        borderWidth: variant === "secondary" ? 1 : 0,
        borderColor:
          variant === "secondary" ? AiraColors.border : "transparent",
      },
      disabled && styles.buttonDisabled,
    ];
    return baseStyles;
  }, [buttonSize, variant, disabled]);

  const iconColor = useMemo(() => {
    if (disabled) return AiraColors.mutedForeground;
    return variant === "primary" ? AiraColors.card : AiraColors.foreground;
  }, [disabled, variant]);

  const textColor = useMemo(() => {
    if (disabled) return AiraColors.mutedForeground;
    return variant === "primary"
      ? AiraColors.background
      : AiraColors.foreground;
  }, [disabled, variant]);

  const screenWidth = Dimensions.get("window").width;
  const maxRight = screenWidth - expandedWidth - 16;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: buttonWidth,
          bottom: bottomPadding + 16,
          transform: [{ scale: scaleValue }],
          right: Math.min(16, maxRight),
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={text || `Botón ${iconName}`}
        accessibilityHint={
          disabled ? "Botón deshabilitado" : "Toca para ejecutar acción"
        }
        accessibilityState={{ disabled }}
      >
        {text && showText && (
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textOpacity,
              },
            ]}
          >
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.buttonText,
                {
                  color: textColor,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {text}
            </ThemedText>
          </Animated.View>
        )}
        <Ionicons
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    zIndex: 1000,
    elevation: Platform.OS === "android" ? 8 : 0,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...SHADOWS[4],
    overflow: "hidden",
  },
  buttonDisabled: {
    backgroundColor: AiraColors.muted,
    opacity: 0.6,
  },
  textContainer: {
    marginRight: 8,
    maxWidth: 80,
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
  },
  icon: {
    flexShrink: 0,
  },
});
