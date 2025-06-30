import React, { createContext, useContext, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

const { width: screenWidth } = Dimensions.get("window");

export type AlertType = "success" | "error" | "warning" | "info" | "confirm";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

export interface AlertConfig {
  type: AlertType;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  icon?: string;
  autoHide?: boolean;
  duration?: number;
}

interface AlertContextType {
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: React.ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const showAlert = useCallback(
    (config: AlertConfig) => {
      setAlertConfig(config);
      setVisible(true);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      if (config.autoHide && config.duration) {
        setTimeout(() => {
          hideAlert();
        }, config.duration);
      }
    },
    [fadeAnim, scaleAnim]
  );

  const hideAlert = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setAlertConfig(null);
    });
  }, [fadeAnim, scaleAnim]);

  const getAlertStyle = (type: AlertType) => {
    switch (type) {
      case "success":
        return {
          iconName: "checkmark-circle" as const,
          iconColor: "#10B981",
          gradientColors: ["#10B981", "#059669"],
        };
      case "error":
        return {
          iconName: "close-circle" as const,
          iconColor: "#EF4444",
          gradientColors: ["#EF4444", "#DC2626"],
        };
      case "warning":
        return {
          iconName: "warning" as const,
          iconColor: "#F59E0B",
          gradientColors: ["#F59E0B", "#D97706"],
        };
      case "info":
        return {
          iconName: "information-circle" as const,
          iconColor: "#3B82F6",
          gradientColors: ["#3B82F6", "#2563EB"],
        };
      case "confirm":
        return {
          iconName: "help-circle" as const,
          iconColor: "#8B5CF6",
          gradientColors: ["#8B5CF6", "#7C3AED"],
        };
      default:
        return {
          iconName: "information-circle" as const,
          iconColor: AiraColors.primary,
          gradientColors: [AiraColors.primary, AiraColors.accent],
        };
    }
  };

  const getButtonStyle = (style: AlertButton["style"]) => {
    switch (style) {
      case "cancel":
        return {
          backgroundColor: AiraColors.secondary,
          textColor: AiraColors.foreground,
        };
      case "destructive":
        return {
          backgroundColor: "#EF4444",
          textColor: "#fff",
        };
      default:
        return {
          backgroundColor: AiraColors.primary,
          textColor: "#fff",
        };
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    hideAlert();
    button.onPress?.();
  };

  const renderAlert = () => {
    if (!alertConfig) return null;

    const alertStyle = getAlertStyle(alertConfig.type);
    const defaultButtons: AlertButton[] = [{ text: "OK", style: "default" }];
    const buttons = alertConfig.buttons || defaultButtons;

    return (
      <Modal
        transparent
        visible={visible}
        statusBarTranslucent
        animationType="none"
      >
        <TouchableWithoutFeedback onPress={hideAlert}>
          <View style={styles.overlay}>
            <Animated.View
              style={[
                styles.alertContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableWithoutFeedback>
                <View style={styles.alertContent}>
                  {/* Header con icono */}
                  <View style={styles.alertHeader}>
                    <LinearGradient
                      colors={
                        alertStyle.gradientColors as [
                          ColorValue,
                          ColorValue,
                          ...ColorValue[]
                        ]
                      }
                      style={styles.iconContainer}
                    >
                      <Ionicons
                        name={(alertConfig.icon as any) || alertStyle.iconName}
                        size={32}
                        color="white"
                      />
                    </LinearGradient>
                  </View>

                  {/* Contenido */}
                  <View style={styles.alertBody}>
                    <ThemedText style={styles.alertTitle}>
                      {alertConfig.title}
                    </ThemedText>

                    {alertConfig.message && (
                      <ThemedText style={styles.alertMessage}>
                        {alertConfig.message}
                      </ThemedText>
                    )}
                  </View>

                  {/* Botones */}
                  <View style={styles.alertActions}>
                    {buttons.map((button, index) => {
                      const buttonStyle = getButtonStyle(button.style);
                      const isLastButton = index === buttons.length - 1;
                      const isSingleButton = buttons.length === 1;

                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.alertButton,
                            {
                              backgroundColor: buttonStyle.backgroundColor,
                              marginLeft: index > 0 ? 12 : 0,
                              flex: isSingleButton ? 1 : undefined,
                              minWidth: isSingleButton ? undefined : 100,
                            },
                          ]}
                          onPress={() => handleButtonPress(button)}
                        >
                          <ThemedText
                            style={[
                              styles.alertButtonText,
                              { color: buttonStyle.textColor },
                            ]}
                          >
                            {button.text}
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {renderAlert()}
    </AlertContext.Provider>
  );
}

// Hook para mostrar alertas comunes
export const useAlertHelpers = () => {
  const { showAlert } = useAlert();

  const showSuccess = useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        type: "success",
        title,
        message,
        buttons: [{ text: "OK", onPress }],
        autoHide: !onPress,
        duration: 3000,
      });
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        type: "error",
        title,
        message,
        buttons: [{ text: "OK", onPress }],
      });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void,
      confirmText = "Confirmar",
      cancelText = "Cancelar"
    ) => {
      showAlert({
        type: "confirm",
        title,
        message,
        buttons: [
          { text: cancelText, style: "cancel", onPress: onCancel },
          { text: confirmText, style: "destructive", onPress: onConfirm },
        ],
      });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        type: "warning",
        title,
        message,
        buttons: [{ text: "OK", onPress }],
      });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        type: "info",
        title,
        message,
        buttons: [{ text: "OK", onPress }],
        autoHide: !onPress,
        duration: 4000,
      });
    },
    [showAlert]
  );

  return {
    showSuccess,
    showError,
    showConfirm,
    showWarning,
    showInfo,
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: Math.min(screenWidth - 40, 340),
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  alertContent: {
    padding: 0,
  },
  alertHeader: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  alertBody: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },
  alertActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: "center",
  },
  alertButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: AiraVariants.tagRadius,
    justifyContent: "center",
    alignItems: "center",
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
