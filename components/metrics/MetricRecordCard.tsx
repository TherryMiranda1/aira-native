import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { MetricRecord, Metric } from "@/services/api/metrics.service";

interface MetricRecordCardProps {
  record: MetricRecord;
  metric: Metric;
  onDelete: () => void;
}

export const MetricRecordCard: React.FC<MetricRecordCardProps> = ({
  record,
  metric,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressIndicator = () => {
    if (!metric.target) return null;

    let progress: number;
    if (metric.direction === "increase") {
      progress = (record.value / metric.target) * 100;
    } else {
      const startValue = metric.target * 1.5;
      const progressRange = startValue - metric.target;
      const currentProgress = Math.max(0, startValue - record.value);
      progress = Math.min(100, (currentProgress / progressRange) * 100);
    }

    let color = AiraColors.mutedForeground;
    let icon = "remove-outline";

    if (progress >= 100) {
      color = AiraColors.accent;
      icon = "checkmark-circle";
    } else if (progress >= 75) {
      color = AiraColors.primary;
      icon = "trending-up";
    } else if (progress >= 50) {
      color = "#FFA726"; // Warning color
      icon = "trending-up";
    } else {
      color = AiraColors.destructive;
      icon = "trending-down";
    }

    return (
      <View style={styles.progressIndicator}>
        <Ionicons name={icon as any} size={16} color={color} />
        <ThemedText style={[styles.progressText, { color }]}>
          {Math.round(progress)}%
        </ThemedText>
      </View>
    );
  };

  const getMilestoneAchieved = () => {
    if (metric.milestones.length === 0) return null;

    const achievedMilestones = metric.milestones.filter(
      (milestone) => record.value >= milestone.value
    );

    if (achievedMilestones.length === 0) return null;

    const latestMilestone = achievedMilestones[achievedMilestones.length - 1];

    return (
      <View style={styles.milestoneIndicator}>
        <Ionicons name="star" size={12} color="#FFA726" />
        <ThemedText style={styles.milestoneText}>
          {latestMilestone.description ||
            `${latestMilestone.value} ${metric.unit}`}
        </ThemedText>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <ThemedText type="defaultSemiBold" style={styles.dateText}>
            {formatDate(record.recordDate)}
          </ThemedText>
          <ThemedText style={styles.timeText}>
            {formatTime(record.recordDate)}
          </ThemedText>
        </View>

        <View style={styles.valueContainer}>
          <ThemedText type="title" style={styles.valueText}>
            {record.value}
          </ThemedText>
          <ThemedText style={styles.unitText}>{metric.unit}</ThemedText>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={AiraColors.destructive}
          />
        </TouchableOpacity>
      </View>

      {/* Progress and milestones */}
      <View style={styles.indicators}>
        {getProgressIndicator()}
        {getMilestoneAchieved()}
      </View>

      {/* Notes */}
      {record.notes && (
        <View style={styles.notesContainer}>
          <ThemedText type="defaultItalic" style={styles.notesText}>
            {record.notes}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: AiraColors.foreground,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  valueContainer: {
    alignItems: "center",
    flex: 1,
  },
  valueText: {
    fontSize: 24,
    color: AiraColors.primary,
    marginBottom: 2,
  },
  unitText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  deleteButton: {
    padding: 4,
  },
  indicators: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  progressIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: AiraColors.muted,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
  },
  milestoneIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#FFA726" + "20",
    borderRadius: 12,
  },
  milestoneText: {
    fontSize: 11,
    color: "#FFA726",
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AiraColors.border,
  },
  notesText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
  },
});
