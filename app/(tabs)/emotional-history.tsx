import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { PageView } from "@/components/ui/PageView";

interface EmotionalEntry {
  id: string;
  date: Date;
  mood: string;
  achievement?: string;
  note?: string;
}

export default function EmotionalHistoryScreen() {
  // Datos de ejemplo para el historial emocional
  const entries: EmotionalEntry[] = [
    {
      id: "1",
      date: new Date(2024, 11, 20),
      mood: "Radiante",
      achievement: "Completé mi rutina matutina",
      note: "Me sentí muy orgullosa de levantarme temprano",
    },
    {
      id: "2",
      date: new Date(2024, 11, 19),
      mood: "Tranquila",
      achievement: "Medité 10 minutos",
      note: "Encontré paz en medio del día ocupado",
    },
    {
      id: "3",
      date: new Date(2024, 11, 18),
      mood: "Reflexiva",
      achievement: "Escribí en mi diario",
      note: "Me conecté conmigo misma",
    },
    {
      id: "4",
      date: new Date(2024, 11, 17),
      mood: "Sensible",
      achievement: "Pedí ayuda cuando la necesité",
      note: "Fue difícil pero necesario",
    },
  ];

  // Función para obtener el color según el estado de ánimo
  const getMoodColor = (mood: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Radiante: { bg: "#FEF9C3", text: "#CA8A04" },
      Tranquila: { bg: "#DCFCE7", text: "#16A34A" },
      Reflexiva: { bg: "#F3E8FF", text: "#9333EA" },
      Sensible: { bg: "#FCE7F3", text: "#DB2777" },
      Cansada: { bg: "#FEF3C7", text: "#D97706" },
      Neutral: { bg: "#F3F4F6", text: "#4B5563" },
    };
    return colors[mood] || { bg: "#F3F4F6", text: "#4B5563" };
  };

  return (
    <PageView>
      <Topbar title="Historia" actions={<ProfileButton />} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak Card */}
        <LinearGradient
          colors={[
            AiraColors.airaLavenderSoft,
            AiraColorsWithAlpha.lavenderWithOpacity(0.8),
          ]}
          start={{ x: 0.3, y: 0 }}
          style={styles.streakCard}
        >
          <View style={styles.streakIconContainer}>
            <Ionicons name="sparkles-outline" size={28} color="#8b5cf6" />
          </View>
          <ThemedText style={styles.streakTitle}>
            ¡4 días consecutivos cuidándote! 🎉
          </ThemedText>
          <ThemedText style={styles.streakSubtitle}>
            Cada pequeño paso cuenta. Estoy muy orgullosa de tu constancia.
          </ThemedText>
        </LinearGradient>

        {/* Emotional Entries */}
        <View style={styles.entriesContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trending-up" size={20} color={AiraColors.primary} />
            <ThemedText style={styles.sectionTitle}>
              Tu Viaje Emocional
            </ThemedText>
          </View>

          {entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.dateContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={AiraColors.mutedForeground}
                  />
                  <ThemedText style={styles.dateText}>
                    {entry.date.toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </ThemedText>
                </View>

                <View style={styles.moodContainer}>
                  <View
                    style={[
                      styles.moodBadge,
                      { backgroundColor: getMoodColor(entry.mood).bg },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.moodText,
                        { color: getMoodColor(entry.mood).text },
                      ]}
                    >
                      {entry.mood}
                    </ThemedText>
                  </View>
                  {entry.achievement && (
                    <Ionicons name="heart" size={16} color="#ec4899" />
                  )}
                </View>
              </View>

              {entry.achievement && (
                <View style={styles.achievementContainer}>
                  <ThemedText style={styles.achievementTitle}>
                    🌟 {entry.achievement}
                  </ThemedText>
                  {entry.note && (
                    <ThemedText style={styles.achievementNote}>
                      {entry.note}
                    </ThemedText>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Encouraging Message */}
        <View style={styles.encouragementCard}>
          <ThemedText style={styles.encouragementText}>
            💜 Cada día que decides cuidarte es una victoria.
            {"\n"}
            Tu progreso es hermoso, incluso en los días difíciles.
          </ThemedText>
        </View>
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: AiraColors.mutedForeground,
    fontSize: 16,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  streakCard: {
    borderRadius: AiraVariants.cardRadius,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  streakIconContainer: {
    width: 50,
    height: 50,
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  streakTitle: {
    fontSize: 18,
    fontFamily: "MontserratBold",
    color: AiraColors.foreground,
    marginBottom: 8,
    textAlign: "center",
  },
  streakSubtitle: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
  entriesContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "MontserratBold",
    color: AiraColors.foreground,
    marginLeft: 8,
  },
  entryCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginLeft: 4,
  },
  moodContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  moodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
  },
  moodText: {
    fontSize: 12,
    fontFamily: "MontserratBold",
  },
  achievementContainer: {
    backgroundColor: `${AiraColors.primary}20`,
    padding: 12,
    borderRadius: AiraVariants.cardRadius,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: "MontserratBold",
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  achievementNote: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  encouragementCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  encouragementText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
});
