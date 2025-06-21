import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AiraColors } from "../../constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { AiraVariants } from "@/constants/Themes";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import WeeklyCalendar from "@/components/weeklyCalendar/WeeklyCalendar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUser } from "@clerk/clerk-expo";
import { useRealmNotes } from "@/infra/realm/services/useRealmNotes";

// Función para obtener un saludo basado en la hora del día
const getTimeBasedGreeting = (currentTime: Date) => {
  const hour = currentTime.getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

// Función para obtener un mensaje diario aleatorio
const getDailyMessage = () => {
  const messages = [
    "Hoy es un nuevo comienzo, y tú tienes el poder de hacerlo hermoso ",
    "Recuerda: cada pequeño paso cuenta, incluso respirar profundo ",
    "Estoy aquí contigo, celebrando cada momento de cuidado personal ",
    "Tu bienestar es una prioridad, no un lujo. Mereces sentirte bien ",
    "Hoy no tienes que ser perfecta, solo tienes que ser tú ",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Opciones de estado de ánimo
const moodOptions = [
  {
    id: "radiante",
    label: "Radiante",
    icon: "sunny-outline" as const,
    color: "#FEFCE8",
    textColor: "#CA8A04",
    borderColor: "#FEF08A",
    description: "Me siento llena de energía",
  },
  {
    id: "tranquila",
    label: "Tranquila",
    icon: "happy-outline" as const,
    color: "#ECFDF5",
    textColor: "#059669",
    borderColor: "#A7F3D0",
    description: "En paz conmigo misma",
  },
  {
    id: "reflexiva",
    label: "Reflexiva",
    icon: "cloud-outline" as const,
    color: "#F5F3FF",
    textColor: "#7C3AED",
    borderColor: "#DDD6FE",
    description: "Pensando en mí",
  },
  {
    id: "cansada",
    label: "Cansada",
    icon: "moon-outline" as const,
    color: "#FFFBEB",
    textColor: "#B45309",
    borderColor: "#FDE68A",
    description: "Necesito descansar",
  },
  {
    id: "sensible",
    label: "Sensible",
    icon: "heart-outline" as const,
    color: "#FFF1F2",
    textColor: "#BE185D",
    borderColor: "#FECDD3",
    description: "Sintiendo mucho hoy",
  },
  {
    id: "neutral",
    label: "Neutral",
    icon: "remove-outline" as const,
    color: "#F9FAFB",
    textColor: "#4B5563",
    borderColor: "#E5E7EB",
    description: "Día común",
  },
];

// Función para obtener una sugerencia del día
const getTodaySuggestion = () => {
  const suggestions = [
    {
      type: "Momento suave",
      title: "5 minutos para ti",
      description: "Prepárate una taza de té y respira. Solo eso.",
      icon: "",
    },
    {
      type: "Movimiento gentil",
      title: "Estírate como un gatito",
      description: "Unos estiramientos suaves para despertar tu cuerpo.",
      icon: "",
    },
    {
      type: "Nutrición amorosa",
      title: "Snack colorido",
      description: "Frutas frescas o algo que te haga sonreír al comerlo.",
      icon: "",
    },
    {
      type: "Reflexión breve",
      title: "¿Qué agradecer hoy?",
      description: "Una cosa pequeña por la que sientes gratitud.",
      icon: "",
    },
  ];
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};

export default function HomeScreen() {
  const { user } = useUser();
  const { getNotes } = useRealmNotes();

  const [selectedMood, setSelectedMood] = useState<string>("");
  const [currentTime] = useState(new Date());
  const todaySuggestion = getTodaySuggestion();
  const greeting = getTimeBasedGreeting(currentTime);

  const isLoaded = useRef(false);

  useEffect(() => {
    getNotes();
    if (!isLoaded.current) {
      isLoaded.current = true;
    }
    return () => {
      isLoaded.current = false;
    };
  }, []);

  return (
    <PageView>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Topbar title="Inicio" actions={<ProfileButton />} />

      <LinearGradient
        colors={[
          AiraColors.airaLavenderSoft,
          AiraColors.airaSageSoft,
          AiraColors.airaCreamy,
        ]}
        style={[styles.gradientBackground]}
      >
        <GestureHandlerRootView>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <WeeklyCalendar />
            {/* Header con saludo personalizado */}
            <View style={styles.header}>
              <ThemedText type="defaultSemiBold" style={styles.greeting}>
                {greeting}, {user?.fullName}
              </ThemedText>
              <ThemedText style={styles.subGreeting}>
                Soy Aira, y estoy aquí para acompañarte hoy
              </ThemedText>
            </View>

            {/* Mensaje diario empático */}
            <LinearGradient
              colors={["#0f2027", "#203a43", "#2c5364"]}
              start={{ x: 0.3, y: 0 }}
              style={styles.card}
            >
              <View style={styles.sparkleContainer}>
                <Ionicons
                  name="sparkles-outline"
                  size={28}
                  color={AiraColors.primary}
                />
              </View>
              <ThemedText style={styles.dailyMessage}>
                {getDailyMessage()}
              </ThemedText>
            </LinearGradient>

            {/* Selector de estado emocional */}
            <View style={styles.card}>
              <ThemedText style={styles.cardTitle}>
                ¿Cómo te sientes ahora mismo?
              </ThemedText>
              <View style={styles.moodGrid}>
                {moodOptions.map((mood) => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodCard,
                      {
                        backgroundColor: mood.color,
                        borderColor:
                          selectedMood === mood.id
                            ? mood.textColor
                            : mood.borderColor,
                        borderWidth: selectedMood === mood.id ? 2 : 1,
                      },
                    ]}
                    onPress={() => setSelectedMood(mood.id)}
                  >
                    <Ionicons
                      name={mood.icon}
                      size={24}
                      color={mood.textColor}
                    />
                    <ThemedText
                      type="defaultSemiBold"
                      style={[styles.moodLabel, { color: mood.textColor }]}
                    >
                      {mood.label}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.moodDescription,
                        { color: mood.textColor },
                      ]}
                      numberOfLines={2}
                    >
                      {mood.description}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
              {selectedMood && (
                <View style={styles.moodFeedback}>
                  <ThemedText style={styles.moodFeedbackText}>
                    Gracias por compartir conmigo. Es válido sentirse así, y
                    estoy aquí para apoyarte
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Sugerencia del día */}
            <View style={styles.card}>
              <View style={styles.suggestionContainer}>
                <ThemedText style={styles.suggestionEmoji}>
                  {todaySuggestion.type === "Momento suave"
                    ? "☕"
                    : todaySuggestion.type === "Movimiento gentil"
                    ? "🌸"
                    : todaySuggestion.type === "Nutrición amorosa"
                    ? "🥗"
                    : "💭"}
                </ThemedText>
                <View style={styles.suggestionContent}>
                  <View style={styles.suggestionTypeContainer}>
                    <ThemedText style={styles.suggestionType}>
                      {todaySuggestion.type}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.suggestionTitle}>
                    {todaySuggestion.title}
                  </ThemedText>
                  <ThemedText style={styles.suggestionDescription}>
                    {todaySuggestion.description}
                  </ThemedText>
                  <TouchableOpacity style={styles.suggestionButton}>
                    <ThemedText style={styles.suggestionButtonText}>
                      Me apetece intentarlo
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Progreso suave sin presión */}
            <View style={styles.card}>
              <ThemedText style={styles.cardTitle}>
                Pequeños logros que celebrar
              </ThemedText>
              <View style={styles.achievementsContainer}>
                <View style={[styles.achievementItem, styles.achievementGreen]}>
                  <ThemedText style={styles.achievementText}>
                    Tiempo para mí hoy
                  </ThemedText>
                  <ThemedText style={styles.achievementValue}>
                    15 min{" "}
                  </ThemedText>
                </View>
                <View style={[styles.achievementItem, styles.achievementPink]}>
                  <ThemedText style={styles.achievementText}>
                    Momentos de gratitud
                  </ThemedText>
                  <ThemedText style={styles.achievementValue}>
                    3 hoy{" "}
                  </ThemedText>
                </View>
                <View
                  style={[styles.achievementItem, styles.achievementPurple]}
                >
                  <ThemedText style={styles.achievementText}>
                    Respiraciones conscientes
                  </ThemedText>
                  <ThemedText style={styles.achievementValue}>
                    ¡Muchísimas!{" "}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.achievementFooter}>
                <ThemedText style={styles.achievementFooterText}>
                  Respirar también cuenta como cuidarse. ¡Estoy muy orgullosa de
                  ti!
                </ThemedText>
              </View>
            </View>

            {/* Footer cálido */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Recuerda: el cambio es un proceso, no una carrera
              </ThemedText>
            </View>
          </ScrollView>
        </GestureHandlerRootView>
      </LinearGradient>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AiraColors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginTop: 8,
    marginBottom: 16,
  },
  greeting: {
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sparkleContainer: {
    alignItems: "flex-end",
  },
  dailyMessage: {
    fontSize: 18,
    color: AiraColors.background,
    lineHeight: 26,
  },
  cardTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moodCard: {
    width: "48%",
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  moodLabel: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.8,
  },
  moodFeedback: {
    marginTop: 12,
    padding: 12,
    backgroundColor: AiraColors.secondary,
    borderRadius: AiraVariants.cardRadius,
  },
  moodFeedbackText: {
    fontSize: 14,
    color: AiraColors.foreground,
    fontStyle: "italic",
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTypeContainer: {
    backgroundColor: AiraColors.secondary,
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  suggestionType: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  suggestionTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  suggestionDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 12,
  },
  suggestionButton: {
    backgroundColor: AiraColors.airaLavender,
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  suggestionButtonText: {
    color: "#4F46E5",
    fontSize: 14,
  },
  achievementsContainer: {
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    marginBottom: 8,
  },
  achievementGreen: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  achievementPink: {
    backgroundColor: "rgba(236, 72, 153, 0.1)",
  },
  achievementPurple: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  achievementText: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  achievementValue: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  achievementFooter: {
    alignItems: "center",
  },
  achievementFooterText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  footer: {
    marginTop: 8,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
});
