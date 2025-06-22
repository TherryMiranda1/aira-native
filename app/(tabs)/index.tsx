import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AiraColors } from "../../constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import WeeklyCalendar from "@/components/weeklyCalendar/WeeklyCalendar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUser } from "@clerk/clerk-expo";
import { useRealmNotes } from "@/infra/realm/services/useRealmNotes";
import { 
  DailyPhrase, 
  MoodTracker, 
  DailySuggestion, 
  AchievementsSummary 
} from "@/components/dashboard";

// Función para obtener un saludo basado en la hora del día
const getTimeBasedGreeting = (currentTime: Date) => {
  const hour = currentTime.getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

type MoodType = "radiante" | "tranquila" | "reflexiva" | "cansada" | "sensible" | "neutral";

export default function HomeScreen() {
  const { user } = useUser();
  const { getNotes } = useRealmNotes();

  const [currentTime] = useState(new Date());
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

  const handleMoodSaved = (mood: MoodType) => {
    console.log(`Estado emocional registrado: ${mood}`);
  };

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

            {/* Frase diaria inspiradora */}
            <DailyPhrase />

            {/* Mood Tracker Component */}
            <MoodTracker onMoodSaved={handleMoodSaved} />

            {/* Daily Suggestion Component */}
            <DailySuggestion
              title="Tu mini reto del día"
              subtitle="Un pequeño paso hacia tu bienestar"
            />

            {/* Logros reales basados en el historial */}
            <AchievementsSummary />

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
