import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Metric } from "@/services/api/metrics.service";
import {
  useMetricStatistics,
  useMetricRecentRecords,
} from "@/hooks/services/useMetrics";
import { MetricMiniChart } from "./MetricMiniChart";

interface MetricCardProps {
  metric: Metric;
  onPress: () => void;
  onDelete: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  onPress,
  onDelete,
}) => {
  const { statistics } = useMetricStatistics(metric.id);
  const { records } = useMetricRecentRecords(metric.id, 10);

  const getProgressColor = (progress?: number) => {
    if (!progress) return AiraColors.mutedForeground;
    if (progress >= 100) return AiraColors.accent;
    if (progress >= 75) return AiraColors.primary;
    if (progress >= 50) return "#FFA726"; // Warning color
    return AiraColors.destructive;
  };

  const formatValue = (value?: number) => {
    if (value === undefined) return "—";
    return `${value} ${metric.unit}`;
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {metric.title}
            </ThemedText>
            {metric.description && (
              <ThemedText style={styles.description} numberOfLines={2}>
                {metric.description}
              </ThemedText>
            )}
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={AiraColors.destructive}
            />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Último valor</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.statValue}>
              {formatValue(statistics?.latestValue)}
            </ThemedText>
          </View>

          {metric.target && (
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Objetivo</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {formatValue(metric.target)}
              </ThemedText>
            </View>
          )}

          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Registros</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.statValue}>
              {statistics?.totalRecords || 0}
            </ThemedText>
          </View>
        </View>

        {/* Mini Chart */}
        {records.length > 0 && (
          <View style={styles.chartContainer}>
            <ThemedText style={styles.chartLabel}>
              Tendencia reciente
            </ThemedText>
            <MetricMiniChart
              records={records}
              width={280}
              height={50}
              showDots={false}
            />
          </View>
        )}

        {/* Progress to target */}
        {metric.target && statistics?.progressToTarget !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <ThemedText style={styles.progressLabel}>
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
          </View>
        )}

        {/* Milestones */}
        {metric.milestones.length > 0 && (
          <View style={styles.milestonesContainer}>
            <ThemedText style={styles.milestonesLabel}>Milestones</ThemedText>
            <View style={styles.milestonesList}>
              {metric.milestones.slice(0, 3).map((milestone, index) => (
                <View key={index} style={styles.milestoneItem}>
                  <View style={styles.milestoneIndicator} />
                  <ThemedText style={styles.milestoneText}>
                    {milestone.value} {metric.unit}
                    {milestone.description && ` - ${milestone.description}`}
                  </ThemedText>
                </View>
              ))}
              {metric.milestones.length > 3 && (
                <ThemedText type="defaultItalic" style={styles.moreText}>
                  +{metric.milestones.length - 3} más
                </ThemedText>
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={AiraColors.mutedForeground}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    color: AiraColors.foreground,
  },
  chartContainer: {
    marginBottom: 16,
  },
  chartLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  progressPercentage: {
    fontSize: 14,
  },
  progressBar: {
    height: 6,
    backgroundColor: AiraColors.muted,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  milestonesContainer: {
    marginBottom: 16,
  },
  milestonesLabel: {
    fontSize: 14,
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  milestonesList: {
    gap: 6,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  milestoneIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AiraColors.primary,
    marginRight: 8,
  },
  milestoneText: {
    fontSize: 13,
    color: AiraColors.mutedForeground,
    flex: 1,
  },
  moreText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,

    marginLeft: 14,
  },
  footer: {
    alignItems: "flex-end",
  },
});
