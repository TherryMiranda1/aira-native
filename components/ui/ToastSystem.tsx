import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastConfig {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  icon?: string;
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastItem extends ToastConfig {
  id: string;
  translateY: Animated.Value;
  opacity: Animated.Value;
  translateX: Animated.Value;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdCounter = useRef(0);

  const showToast = useCallback((config: ToastConfig) => {
    const id = `toast-${toastIdCounter.current++}`;
    const duration = config.duration || 4000;

    const newToast: ToastItem = {
      ...config,
      id,
      translateY: new Animated.Value(-100),
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
    };

    setToasts((prev) => [...prev, newToast]);

    // Animación de entrada
    Animated.parallel([
      Animated.timing(newToast.translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(newToast.opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide
    setTimeout(() => {
      hideToast(id);
    }, duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (!toast) return prev;

      Animated.parallel([
        Animated.timing(toast.translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(toast.opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      });

      return prev;
    });
  }, []);

  const handleToastPress = (toastId: string) => {
    hideToast(toastId);
  };

  const getToastStyle = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          iconName: "checkmark-circle" as const,
          gradientColors: ["#10B981", "#059669"],
        };
      case "error":
        return {
          iconName: "close-circle" as const,
          gradientColors: ["#EF4444", "#DC2626"],
        };
      case "warning":
        return {
          iconName: "warning" as const,
          gradientColors: ["#F59E0B", "#D97706"],
        };
      case "info":
        return {
          iconName: "information-circle" as const,
          gradientColors: ["#3B82F6", "#2563EB"],
        };
      default:
        return {
          iconName: "information-circle" as const,
          gradientColors: [AiraColors.primary, AiraColors.accent],
        };
    }
  };

  const renderToasts = () => {
    return (
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast, index) => {
          const toastStyle = getToastStyle(toast.type);

          return (
            <TouchableOpacity
              key={toast.id}
              onPress={() => handleToastPress(toast.id)}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[
                  styles.toast,
                  {
                    transform: [
                      { translateY: toast.translateY },
                      { translateX: toast.translateX },
                    ],
                    opacity: toast.opacity,
                    top: 60 + index * 10, // Espaciado cuando hay múltiples toasts
                  },
                ]}
              >
                <View style={styles.toastContent}>
                  <LinearGradient
                    colors={toastStyle.gradientColors as [string, string]}
                    style={styles.toastIcon}
                  >
                    <Ionicons
                      name={(toast.icon as any) || toastStyle.iconName}
                      size={20}
                      color="white"
                    />
                  </LinearGradient>

                  <View style={styles.toastTextContainer}>
                    <ThemedText style={styles.toastTitle}>
                      {toast.title}
                    </ThemedText>
                    {toast.message && (
                      <ThemedText style={styles.toastMessage}>
                        {toast.message}
                      </ThemedText>
                    )}
                  </View>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {renderToasts()}
    </ToastContext.Provider>
  );
}

// Hook para mostrar toasts comunes
export const useToastHelpers = () => {
  const { showToast } = useToast();

  const showSuccessToast = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: "success",
        title,
        message,
        duration: 3000,
      });
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: "error",
        title,
        message,
        duration: 5000,
      });
    },
    [showToast]
  );

  const showWarningToast = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: "warning",
        title,
        message,
        duration: 4000,
      });
    },
    [showToast]
  );

  const showInfoToast = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: "info",
        title,
        message,
        duration: 4000,
      });
    },
    [showToast]
  );

  return {
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
  };
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: AiraVariants.cardRadius,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  toastIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    lineHeight: 16,
  },
});
