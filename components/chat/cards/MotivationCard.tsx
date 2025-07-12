import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { ContentCard, ContentText } from "./ContentCard";

interface MotivationCardProps {
  motivation: {
    message: string;
    category?: string;
    tips?: string[];
  };
}

export function MotivationCard({ motivation }: MotivationCardProps) {
  const motivationIcons = ["💜", "✨", "🌟", "💪", "🌸", "🦋"];
  const randomIcon = motivationIcons[Math.floor(Math.random() * motivationIcons.length)];

  return (
    <ContentCard
      title="Mensaje de apoyo"
      subtitle="Tu espacio de bienestar"
      icon={randomIcon}
      variant="info"
    >
      <View style={styles.messageContainer}>
        <View style={styles.messageCard}>
          <ThemedText type="defaultItalic" style={styles.motivationMessage}>
            {motivation.message}
          </ThemedText>
        </View>
      </View>

      {motivation.tips && motivation.tips.length > 0 && (
        <View style={styles.tipsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.tipsTitle}>
            💡 Consejos para ti:
          </ThemedText>
          {motivation.tips.map((tip, index) => (
            <ContentText key={index} variant="highlight">
              • {tip}
            </ContentText>
          ))}
        </View>
      )}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
  },
  messageCard: {
    backgroundColor: "#f3e8ff",
    borderColor: "#a855f7",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  motivationMessage: {
    color: "#7c3aed",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  tipsContainer: {
    gap: 8,
  },
  tipsTitle: {
     
    marginBottom: 8,
  },
}); 