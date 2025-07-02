import React, { Children } from "react";
import {
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";

interface ModalViewProps {
  title: string;
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  closeButtonText?: string;
  submitButtonText: string;
  submitButtonIcon?: string;
  loading?: boolean;
}

export const ModalView: React.FC<ModalViewProps> = ({
  visible,
  onClose,
  onSubmit,
  closeButtonText = "Cancelar",
  submitButtonText = "Listo",
  loading = false,
  title,
  children,
  submitButtonIcon = "calendar",
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          style={styles.modalContent}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>
                {closeButtonText}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSubmit}
              disabled={loading}
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            >
              {loading ? (
                <ActivityIndicator size="small" color={AiraColors.background} />
              ) : (
                <>
                  <Ionicons
                    name={submitButtonIcon as any}
                    size={16}
                    color={AiraColors.background}
                  />
                  <ThemedText style={styles.saveButtonText}>
                    {submitButtonText}
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {title}
            </ThemedText>
            <View style={styles.divider} />
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 50 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: AiraColors.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },

  title: {
    fontSize: 20,
    alignSelf: "center",
    color: AiraColors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    marginVertical: 16,
  },
  saveButton: {
    backgroundColor: AiraColors.foreground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: AiraColors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
