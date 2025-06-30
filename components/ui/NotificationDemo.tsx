import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import {
    useAlertHelpers,
    useToastHelpers,
} from "@/components/ui/notifications";
import { AiraColors } from "@/constants/Colors";

export function NotificationDemo() {
  const { showSuccess, showError, showConfirm, showWarning, showInfo } =
    useAlertHelpers();
  const { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } =
    useToastHelpers();

  const handleSuccessAlert = () => {
    showSuccess("¡Éxito!", "Tu acción se completó correctamente", () =>
      console.log("Success callback")
    );
  };

  const handleErrorAlert = () => {
    showError(
      "Error",
      "Ocurrió un problema al procesar tu solicitud. Por favor, inténtalo de nuevo."
    );
  };

  const handleConfirmAlert = () => {
    showConfirm(
      "Confirmar acción",
      "¿Estás segura de que quieres continuar? Esta acción no se puede deshacer.",
      () => console.log("Confirmed"),
      () => console.log("Cancelled"),
      "Confirmar",
      "Cancelar"
    );
  };

  const handleWarningAlert = () => {
    showWarning(
      "Advertencia",
      "Ten cuidado con esta acción. Podría tener consecuencias importantes."
    );
  };

  const handleInfoAlert = () => {
    showInfo(
      "Información",
      "Esta es una notificación informativa que se auto-ocultará en unos segundos."
    );
  };

  const handleSuccessToast = () => {
    showSuccessToast("Guardado", "Los cambios se guardaron correctamente");
  };

  const handleErrorToast = () => {
    showErrorToast("Error de red", "No se pudo conectar al servidor");
  };

  const handleWarningToast = () => {
    showWarningToast("Atención", "Tu sesión expirará pronto");
  };

  const handleInfoToast = () => {
    showInfoToast("Tip", "Desliza hacia arriba para cerrar este toast");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ThemedText style={styles.title}>Sistema de Notificaciones</ThemedText>
      <ThemedText style={styles.subtitle}>
        Demostración de alertas y toasts personalizados
      </ThemedText>

      {/* Alertas */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Alertas (Modales)</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Alertas que requieren interacción del usuario
        </ThemedText>

        <View style={styles.buttonGrid}>
          <Button
            text="Éxito"
            variant="default"
            onPress={handleSuccessAlert}
            style={styles.button}
          />
          <Button
            text="Error"
            onPress={handleErrorAlert}
            style={styles.button}
          />
          <Button
            text="Confirmación"
            variant="border"
            onPress={handleConfirmAlert}
            style={styles.button}
          />
          <Button
            text="Advertencia"
            onPress={handleWarningAlert}
            style={styles.button}
          />
          <Button
            text="Información"
            variant="ghost"
            onPress={handleInfoAlert}
            style={styles.button}
          />
        </View>
      </View>

      {/* Toasts */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Toasts</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Notificaciones ligeras que se auto-ocultan
        </ThemedText>

        <View style={styles.buttonGrid}>
          <Button
            text="Toast Éxito"
            variant="default"
            onPress={handleSuccessToast}
            style={styles.button}
          />
          <Button
            text="Toast Error"
            onPress={handleErrorToast}
            style={styles.button}
          />
          <Button
            text="Toast Advertencia"
            onPress={handleWarningToast}
            style={styles.button}
          />
          <Button
            text="Toast Info"
            variant="ghost"
            onPress={handleInfoToast}
            style={styles.button}
          />
        </View>
      </View>

      {/* Características */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Características</ThemedText>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureBullet}>•</ThemedText>
            <ThemedText style={styles.featureText}>
              Animaciones suaves de entrada y salida
            </ThemedText>
          </View>

          <View style={styles.featureItem}>
            <ThemedText style={styles.featureBullet}>•</ThemedText>
            <ThemedText style={styles.featureText}>
              Iconos y colores personalizados por tipo
            </ThemedText>
          </View>

          <View style={styles.featureItem}>
            <ThemedText style={styles.featureBullet}>•</ThemedText>
            <ThemedText style={styles.featureText}>
              Toasts deslizables para cerrar manualmente
            </ThemedText>
          </View>

          <View style={styles.featureItem}>
            <ThemedText style={styles.featureBullet}>•</ThemedText>
            <ThemedText style={styles.featureText}>
              Auto-ocultado configurable en toasts
            </ThemedText>
          </View>

          <View style={styles.featureItem}>
            <ThemedText style={styles.featureBullet}>•</ThemedText>
            <ThemedText style={styles.featureText}>
              Soporte para múltiples toasts simultáneos
            </ThemedText>
          </View>

          <View style={styles.featureItem}>
            <ThemedText style={styles.featureBullet}>•</ThemedText>
            <ThemedText style={styles.featureText}>
              Reemplaza completamente Alert de React Native
            </ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: AiraColors.foreground,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 16,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  button: {
    flex: 1,
    minWidth: "45%",
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureBullet: {
    fontSize: 16,
    color: AiraColors.primary,
    marginRight: 8,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
});
