import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { AiraColors } from "../../constants/Colors";
import { AiraVariants } from "../../constants/Themes";
import { useEvents } from "../../hooks/services/useEvents";
import { useUserProfile } from "../../hooks/services/useUserProfile";

interface AchievementsSummaryProps {
  className?: string;
}

export const AchievementsSummary = ({
  className,
}: AchievementsSummaryProps) => {
  const { profile, loading: profileLoading } = useUserProfile();
  const { events, loading: activitiesLoading } = useEvents();

  const achievements = useMemo(() => {
    if (!profile || !events || events.length === 0) return null;

    // Filtrar solo eventos de actividad (mood, ritual, challenge)
    const activityEvents = events.filter((event) =>
      ["mood", "ritual", "challenge"].includes(event.eventType)
    );

    if (activityEvents.length === 0) return null;

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const totalActivities = activityEvents.length;
    const moodEntries = activityEvents.filter(
      (e) => e.eventType === "mood"
    ).length;
    const ritualsCompleted = activityEvents.filter(
      (e) => e.eventType === "ritual"
    ).length;
    const challengesCompleted = activityEvents.filter(
      (e) => e.eventType === "challenge"
    ).length;

    const todayActivities = activityEvents.filter((activity) => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= startOfToday;
    });

    const weekActivities = activityEvents.filter((activity) => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= thisWeek;
    });

    const activeDays = new Set<string>(
      activityEvents.map((activity) => {
        const date = new Date(activity.startTime);
        return date.toDateString();
      })
    );

    const calculateCurrentStreak = (): number => {
      if (activeDays.size === 0) return 0;

      let streak = 0;
      let currentDate = new Date();

      while (activeDays.has(currentDate.toDateString())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }

      return streak;
    };

    const currentStreak = calculateCurrentStreak();

    const onboardingDate = new Date(
      profile.onboardingCompletedAt || profile.createdAt
    );
    const daysSinceStart =
      Math.floor(
        (today.getTime() - onboardingDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    return {
      totalActivities,
      moodEntries,
      ritualsCompleted,
      challengesCompleted,
      todayActivities: todayActivities.length,
      weekActivities: weekActivities.length,
      currentStreak,
      daysSinceStart,
      activeDaysCount: activeDays.size,
    };
  }, [profile, events]);

  const getMotivationalMessage = () => {
    if (!achievements) return "";

    const { currentStreak, todayActivities, totalActivities } = achievements;

    if (currentStreak >= 7) {
      return `¡Increíble! Llevas ${currentStreak} días consecutivos cuidándote 🔥`;
    }
    if (todayActivities > 0) {
      return `¡Hoy ya registraste ${todayActivities} actividad${
        todayActivities > 1 ? "es" : ""
      }! 🌟`;
    }
    if (totalActivities >= 10) {
      return `Has registrado ${totalActivities} momentos de bienestar 💜`;
    }
    if (totalActivities >= 1) {
      return "Cada paso cuenta en tu camino hacia el bienestar ✨";
    }

    return "¡Estás comenzando tu hermoso viaje de autocuidado! 🌱";
  };

  if (profileLoading || activitiesLoading) {
    return (
      <View style={[styles.card]}>
        <ThemedText style={styles.loadingText}>
          Cargando tus logros...
        </ThemedText>
      </View>
    );
  }

  if (!achievements || achievements.totalActivities === 0) {
    return null;
  }

  const achievementItems = [
    {
      icon: "calendar-outline",
      label: "Días contigo",
      value: achievements.daysSinceStart,
      style: styles.achievementPurple,
      show: achievements.daysSinceStart > 0,
    },
    {
      icon: "heart-outline",
      label: "Estados emocionales",
      value: achievements.moodEntries,
      style: styles.achievementPink,
      show: achievements.moodEntries > 0,
    },
    {
      icon: "sparkles-outline",
      label: "Rituales completados",
      value: achievements.ritualsCompleted,
      style: styles.achievementPurple,
      show: achievements.ritualsCompleted > 0,
    },
    {
      icon: "sparkles-outline",
      label: "Mini retos completados",
      value: achievements.challengesCompleted,
      style: styles.achievementGreen,
      show: achievements.challengesCompleted > 0,
    },
    {
      icon: "trophy-outline",
      label: "Racha actual",
      value: `${achievements.currentStreak} día${
        achievements.currentStreak !== 1 ? "s" : ""
      }`,
      style: styles.achievementGreen,
      show: achievements.currentStreak > 1,
    },
    {
      icon: "time-outline",
      label: "Esta semana",
      value: `${achievements.weekActivities} actividad${
        achievements.weekActivities !== 1 ? "es" : ""
      }`,
      style: styles.achievementGreen,
      show: achievements.weekActivities > 0,
    },
  ].filter((item) => item.show);

  if (achievementItems.length < 2) {
    return null;
  }

  return (
    <View style={[styles.card]}>
      <ThemedText style={styles.cardTitle}>
        Pequeños logros que celebrar
      </ThemedText>

      <View style={styles.achievementsContainer}>
        {achievementItems.map((item, index) => (
          <View key={index} style={[styles.achievementItem, item.style]}>
            <View style={styles.achievementContent}>
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={AiraColors.foreground}
              />
              <ThemedText style={styles.achievementText}>
                {item.label}
              </ThemedText>
            </View>
            <ThemedText style={styles.achievementValue}>
              {item.value}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.achievementFooter}>
        <ThemedText style={styles.achievementFooterText}>
          {getMotivationalMessage()}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 16,
     
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
  achievementContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
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
    flex: 1,
  },
  achievementValue: {
    fontSize: 14,
    color: AiraColors.foreground,
     
  },
  achievementFooter: {
    alignItems: "center",
    marginTop: 8,
  },
  achievementFooterText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
    color: AiraColors.foreground,
    textAlign: "center",
  },
});
