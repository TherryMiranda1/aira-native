import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AiraColors } from "../../constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { RefreshablePageView } from "@/components/ui/RefreshablePageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCTA } from "@/components/ui/PremiumCTA";
import WeeklyCalendar from "@/components/weeklyCalendar/WeeklyCalendar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUser } from "@clerk/clerk-expo";
import { useRealmNotes } from "@/infra/realm/services/useRealmNotes";
import {
  DailyPhrase,
  MoodTracker,
  DailySuggestion,
  AchievementsSummary,
} from "@/components/dashboard";

// Función para obtener un saludo basado en la hora del día
const getTimeBasedGreeting = (currentTime: Date) => {
  const hour = currentTime.getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

export default function HomeScreen() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getNotes } = useRealmNotes();

  const [currentTime] = useState(new Date());
  const greeting = getTimeBasedGreeting(currentTime);

  const isLoaded = useRef(false);
  const isPaywallShown = useRef(false);

  const handleRefresh = useCallback(() => {
    getNotes();
  }, [getNotes]);

  useEffect(() => {
    getNotes();

    if (!isLoaded.current) {
      isLoaded.current = true;
    }
    return () => {
      isLoaded.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isPaywallShown.current) {
        isPaywallShown.current = true;
        router.push("/default-paywall");
      }
    }, [])
  );

  useEffect(() => {
    if (isUserLoaded && !user) {
      router.replace("/(auth)/sign-in");
    }
  }, [isUserLoaded, user]);

  return (
    <RefreshablePageView
      onRefresh={handleRefresh}
      onEndReach={handleRefresh}
      contentContainerStyle={styles.scrollContent}
      endReachText="Desliza hacia abajo para actualizar"
      topbar={
        <Topbar
          title=""
          actions={
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <PremiumButton size="small" />
              <ProfileButton />
            </View>
          }
        />
      }
    >
      <LinearGradient
        colors={[
          AiraColors.airaLavenderSoft,
          AiraColors.airaSageSoft,
          AiraColors.airaCreamy,
        ]}
        style={[styles.gradientBackground]}
      >
        <GestureHandlerRootView>
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
          <MoodTracker />

          {/* Daily Suggestion Component */}
          <DailySuggestion
            title="Tu mini reto del día"
            subtitle="Un pequeño paso hacia tu bienestar"
          />

          {/* Logros reales basados en el historial */}
          <AchievementsSummary />

          {/* Premium CTA */}
          <PremiumCTA variant="compact" />

          {/* Footer cálido */}
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Recuerda: el cambio es un proceso, no una carrera
            </ThemedText>
          </View>
        </GestureHandlerRootView>
      </LinearGradient>
    </RefreshablePageView>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
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
