import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InfoModal({ visible, onClose }: InfoModalProps) {
  const instructions = [
    {
      title: "Tu compañera de bienestar",
      description: "Aira está aquí para ayudarte a alcanzar tus objetivos y apoyarte en tu camino hacia el bienestar."
    },
    {
      title: "Memoria personalizada",
      description: "Aira puede recordar los detalles que sean importantes para ti."
    },
    {
      title: "Control de memoria",
      description: "Eliminar conversaciones no borra los recuerdos de Aira. Si quieres que olvide algo, simplemente pídelo."
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <ThemedText type="defaultSemiBold" style={styles.title}>Acerca de Aira</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <ThemedText style={styles.closeText}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <ThemedText style={styles.instructionTitle}>{instruction.title}</ThemedText>
                <ThemedText style={styles.instructionDescription}>
                  {instruction.description}
                </ThemedText>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AiraColors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AiraColors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    fontWeight: "500",
  },
  content: {
    padding: 20,
  },
  instructionItem: {
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 6,
  },
  instructionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: AiraColors.mutedForeground,
  },
}); 