export {
  AlertProvider,
  useAlert,
  useAlertHelpers,
  type AlertType,
  type AlertButton,
  type AlertConfig,
} from "../AlertSystem";

export {
  ToastProvider,
  useToast,
  useToastHelpers,
  type ToastType,
  type ToastConfig,
} from "../ToastSystem";

// Provider combinado para usar ambos sistemas
import React from "react";
import { AlertProvider } from "../AlertSystem";
import { ToastProvider } from "../ToastSystem";

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <AlertProvider>
      <ToastProvider>{children}</ToastProvider>
    </AlertProvider>
  );
}
