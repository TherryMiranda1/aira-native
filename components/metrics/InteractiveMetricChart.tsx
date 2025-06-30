import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import Svg, {
  Path,
  Circle,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { MetricRecord, Metric } from "@/services/api/metrics.service";
import { Ionicons } from "@expo/vector-icons";

interface InteractiveMetricChartProps {
  records: MetricRecord[];
  metric: Metric;
  height?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showTarget?: boolean;
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  date: string;
  originalIndex: number;
  record: MetricRecord;
}

interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  record?: MetricRecord;
  value?: number;
  date?: string;
}

export const InteractiveMetricChart: React.FC<InteractiveMetricChartProps> = ({
  records,
  metric,
  height = 300,
  showDots = true,
  showGrid = true,
  showTarget = true,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32;
  const chartHeight = height;
  const padding = { top: 30, right: 30, bottom: 50, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    x: 0,
    y: 0,
  });

  const chartData = useMemo(() => {
    if (records.length === 0)
      return { points: [], minValue: 0, maxValue: 0, pathData: "" };

    const sortedRecords = [...records].sort(
      (a, b) =>
        new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
    );

    if (sortedRecords.length === 0)
      return { points: [], minValue: 0, maxValue: 0, pathData: "" };

    const values = sortedRecords.map((r) => r.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    const paddedMin = minValue - valueRange * 0.1;
    const paddedMax = maxValue + valueRange * 0.1;

    const finalMin = paddedMin === paddedMax ? paddedMin - 1 : paddedMin;
    const finalMax = paddedMin === paddedMax ? paddedMax + 1 : paddedMax;

    const points: ChartPoint[] = sortedRecords.map((record, index) => {
      const x = (index / Math.max(sortedRecords.length - 1, 1)) * innerWidth;
      const y =
        innerHeight -
        ((record.value - finalMin) / (finalMax - finalMin)) * innerHeight;

      return {
        x: x + padding.left,
        y: y + padding.top,
        value: record.value,
        date: record.recordDate,
        originalIndex: index,
        record,
      };
    });

    const pathData =
      points.length > 0
        ? `M ${points[0].x} ${points[0].y} ` +
          points
            .slice(1)
            .map((point) => `L ${point.x} ${point.y}`)
            .join(" ")
        : "";

    return {
      points,
      minValue: finalMin,
      maxValue: finalMax,
      pathData,
      sortedRecords,
    };
  }, [records, innerWidth, innerHeight, padding]);

  const formatValue = (value: number) => {
    return `${Math.round(value * 100) / 100}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
  };

  const getTargetY = () => {
    if (!metric.target || !showTarget) return null;
    return (
      innerHeight -
      ((metric.target - chartData.minValue) /
        (chartData.maxValue - chartData.minValue)) *
        innerHeight +
      padding.top
    );
  };

  const handlePointPress = (point: ChartPoint) => {
    setTooltip({
      visible: true,
      x: point.x,
      y: point.y - 120,
      record: point.record,
      value: point.value,
      date: point.date,
    });
  };

  const closeTooltip = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  const targetY = getTargetY();

  if (records.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="analytics-outline"
          size={48}
          color={AiraColors.mutedForeground}
        />
        <ThemedText style={styles.emptyText}>
          No hay datos suficientes para mostrar el gráfico
        </ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Agrega algunos registros para ver tu progreso
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.subtitle}>
            {chartData.sortedRecords?.length || 0} registros • {metric.unit}
          </ThemedText>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
          <Defs>
            <SvgLinearGradient
              id="interactiveLineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop
                offset="0%"
                stopColor={AiraColors.primary}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={AiraColors.accent}
                stopOpacity="1"
              />
            </SvgLinearGradient>

            <SvgLinearGradient
              id="interactiveAreaGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor={AiraColors.primary}
                stopOpacity="0.4"
              />
              <Stop
                offset="100%"
                stopColor={AiraColors.primary}
                stopOpacity="0.1"
              />
            </SvgLinearGradient>
          </Defs>

          {showGrid && (
            <>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = padding.top + ratio * innerHeight;
                return (
                  <Line
                    key={`h-grid-interactive-${index}-${ratio}`}
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + innerWidth}
                    y2={y}
                    stroke={AiraColors.border}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                );
              })}
            </>
          )}

          {targetY && (
            <>
              <Line
                x1={padding.left}
                y1={targetY}
                x2={padding.left + innerWidth}
                y2={targetY}
                stroke="#FFA726"
                strokeWidth="2"
                strokeDasharray="8,4"
                strokeOpacity="0.9"
              />
              <SvgText
                x={padding.left + innerWidth - 5}
                y={targetY - 8}
                fontSize="11"
                fill="#FFA726"
                textAnchor="end"
                fontWeight="600"
              >
                Meta: {formatValue(metric.target!)}
              </SvgText>
            </>
          )}

          {chartData.pathData && (
            <Path
              d={`${chartData.pathData} L ${
                chartData.points[chartData.points.length - 1].x
              } ${padding.top + innerHeight} L ${chartData.points[0].x} ${
                padding.top + innerHeight
              } Z`}
              fill="url(#interactiveAreaGradient)"
            />
          )}

          {chartData.pathData && (
            <Path
              d={chartData.pathData}
              stroke="url(#interactiveLineGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {showDots &&
            chartData.points.map((point, index) => (
              <TouchableOpacity
                key={`interactive-point-${point.record.id}-${index}`}
                onPress={() => handlePointPress(point)}
                style={{
                  position: "absolute",
                  left: point.x - 12,
                  top: point.y - 12,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Circle
                  cx={12}
                  cy={12}
                  r="6"
                  fill={AiraColors.primary}
                  stroke={AiraColors.card}
                  strokeWidth="3"
                />
              </TouchableOpacity>
            ))}

          {[0, 0.5, 1].map((ratio, index) => {
            const y = padding.top + ratio * innerHeight;
            const value =
              chartData.maxValue -
              ratio * (chartData.maxValue - chartData.minValue);
            return (
              <SvgText
                key={`y-label-interactive-${index}-${ratio}`}
                x={padding.left - 15}
                y={y + 4}
                fontSize="11"
                fill={AiraColors.mutedForeground}
                textAnchor="end"
                fontWeight="500"
              >
                {formatValue(value)}
              </SvgText>
            );
          })}

          {chartData.points.length > 1 &&
            [
              0,
              Math.floor(chartData.points.length / 2),
              chartData.points.length - 1,
            ].map((pointIndex, labelIndex) => {
              const point = chartData.points[pointIndex];
              if (!point) return null;

              return (
                <SvgText
                  key={`x-label-${labelIndex}-${pointIndex}`}
                  x={point.x}
                  y={padding.top + innerHeight + 25}
                  fontSize="10"
                  fill={AiraColors.mutedForeground}
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {formatDateShort(point.date)}
                </SvgText>
              );
            })}
        </Svg>
      </View>

      <View style={styles.insights}>
        <View style={styles.insightItem}>
          <View style={styles.insightIcon}>
            <Ionicons name="trending-up" size={16} color={AiraColors.accent} />
          </View>
          <View style={styles.insightContent}>
            <ThemedText style={styles.insightLabel}>Tendencia</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.insightValue}>
              {(() => {
                if (chartData.points.length < 2) return "Sin datos";
                const firstValue = chartData.points[0]?.value || 0;
                const lastValue =
                  chartData.points[chartData.points.length - 1]?.value || 0;
                const trend = lastValue - firstValue;
                const isPositive = trend > 0;
                const isNeutral = Math.abs(trend) < 0.01;

                return isNeutral
                  ? "Estable"
                  : isPositive
                  ? "Ascendente"
                  : "Descendente";
              })()}
            </ThemedText>
          </View>
        </View>

        <View style={styles.insightItem}>
          <View style={styles.insightIcon}>
            <Ionicons name="pulse" size={16} color={AiraColors.primary} />
          </View>
          <View style={styles.insightContent}>
            <ThemedText style={styles.insightLabel}>Variabilidad</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.insightValue}>
              {(() => {
                if (chartData.points.length < 2) return "Sin datos";
                const values = chartData.points.map((p) => p.value);
                const range = Math.max(...values) - Math.min(...values);
                const avg =
                  values.reduce((sum, val) => sum + val, 0) / values.length;
                const coefficient = range / avg;

                return coefficient < 0.1
                  ? "Baja"
                  : coefficient < 0.3
                  ? "Media"
                  : "Alta";
              })()}
            </ThemedText>
          </View>
        </View>
      </View>

      <Modal
        visible={tooltip.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeTooltip}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeTooltip}
        >
          <View
            style={[
              styles.tooltip,
              {
                left: Math.max(
                  16,
                  Math.min(tooltip.x - 100, screenWidth - 216)
                ),
                top: Math.max(100, tooltip.y),
              },
            ]}
          >
            <View style={styles.tooltipHeader}>
              <ThemedText type="defaultSemiBold" style={styles.tooltipValue}>
                {formatValue(tooltip.value || 0)} {metric.unit}
              </ThemedText>
              <TouchableOpacity
                onPress={closeTooltip}
                style={styles.tooltipClose}
              >
                <Ionicons
                  name="close"
                  size={16}
                  color={AiraColors.mutedForeground}
                />
              </TouchableOpacity>
            </View>
            <ThemedText style={styles.tooltipDate}>
              {tooltip.date && formatDate(tooltip.date)}
            </ThemedText>
            {tooltip.record?.notes && (
              <ThemedText style={styles.tooltipNotes}>
                {tooltip.record.notes}
              </ThemedText>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    color: AiraColors.mutedForeground,
  },
  chartContainer: {
    marginVertical: 8,
    position: "relative",
  },
  svg: {
    backgroundColor: "transparent",
  },
  insights: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: AiraColors.border,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AiraColors.muted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  emptyContainer: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    padding: 48,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: AiraColors.card,
    borderRadius: 12,
    padding: 16,
    minWidth: 200,

    borderWidth: 1,
    borderColor: AiraColors.border,
  },
  tooltipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tooltipValue: {
    fontSize: 18,
    color: AiraColors.primary,
  },
  tooltipClose: {
    padding: 4,
  },
  tooltipDate: {
    fontSize: 13,
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  tooltipNotes: {
    fontSize: 12,
    color: AiraColors.foreground,

    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: AiraColors.border,
  },
});
