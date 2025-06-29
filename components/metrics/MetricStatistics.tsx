import React from "react";
import { StyleSheet, View } from "react-native";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Metric } from "@/services/api/metrics.service";

interface MetricStatisticsProps {
  statistics: {
    latestValue?: number;
    averageValue: number;
    minValue: number;
    maxValue: number;
    totalRecords: number;
    progressToTarget?: number;
  };
  metric: Metric;
}

export const MetricStatistics: React.FC<MetricStatisticsProps> = ({
  statistics,
  metric,
}) => {
  const formatValue = (value?: number) => {
    if (value === undefined) return "—";
    return `${value} ${metric.unit}`;
  };

  const getProgressColor = (progress?: number) => {
    if (!progress) return AiraColors.mutedForeground;
    if (progress >= 100) return AiraColors.accent;
    if (progress >= 75) return AiraColors.primary;
    if (progress >= 50) return "#FFA726"; // Warning color
    return AiraColors.destructive;
  };

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.title}>
        Estadísticas
      </ThemedText>

      {/* Estadísticas principales */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="pulse" size={20} color={AiraColors.primary} />
          <ThemedText style={styles.statLabel}>Último valor</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {formatValue(statistics.latestValue)}
          </ThemedText>
        </View>

        <View style={styles.statCard}>
          <Ionicons
            name="analytics"
            size={20}
            color={AiraColors.mutedForeground}
          />
          <ThemedText style={styles.statLabel}>Promedio</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {formatValue(statistics.averageValue)}
          </ThemedText>
        </View>

        <View style={styles.statCard}>
          <Ionicons
            name="trending-down"
            size={20}
            color={AiraColors.destructive}
          />
          <ThemedText style={styles.statLabel}>Mínimo</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {formatValue(statistics.minValue)}
          </ThemedText>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={20} color={AiraColors.accent} />
          <ThemedText style={styles.statLabel}>Máximo</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {formatValue(statistics.maxValue)}
          </ThemedText>
        </View>
      </View>

      {/* Progreso hacia objetivo */}
      {metric.target && statistics.progressToTarget !== undefined && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <ThemedText type="defaultSemiBold" style={styles.progressTitle}>
              Progreso hacia objetivo
            </ThemedText>
            <ThemedText
              style={[
                styles.progressPercentage,
                { color: getProgressColor(statistics.progressToTarget) },
              ]}
            >
              {Math.round(statistics.progressToTarget)}%
            </ThemedText>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(statistics.progressToTarget, 100)}%`,
                  backgroundColor: getProgressColor(
                    statistics.progressToTarget
                  ),
                },
              ]}
            />
          </View>

          <View style={styles.progressLabels}>
            <ThemedText style={styles.progressLabel}>
              Actual: {formatValue(statistics.latestValue)}
            </ThemedText>
            <ThemedText style={styles.progressLabel}>
              Objetivo: {formatValue(metric.target)}
            </ThemedText>
          </View>
        </View>
      )}

      {/* Información adicional */}
      <View style={styles.additionalInfo}>
        <View style={styles.infoItem}>
          <Ionicons
            name="document-text"
            size={16}
            color={AiraColors.mutedForeground}
          />
          <ThemedText style={styles.infoText}>
            {statistics.totalRecords} registros totales
          </ThemedText>
        </View>

        {metric.milestones.length > 0 && (
          <View style={styles.infoItem}>
            <Ionicons name="star" size={16} color="#FFA726" />
            <ThemedText style={styles.infoText}>
              {metric.milestones.length} milestones configurados
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: AiraColors.foreground,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: AiraColors.muted,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginTop: 4,
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 14,
    color: AiraColors.foreground,
    textAlign: "center",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
  },
  progressPercentage: {
    fontSize: 16,
     
  },
  progressBar: {
    height: 8,
    backgroundColor: AiraColors.muted,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  additionalInfo: {
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
});
