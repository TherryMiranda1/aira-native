import React, { useMemo } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
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

interface MetricChartProps {
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
}

export const MetricChart: React.FC<MetricChartProps> = ({
  records,
  metric,
  height = 200,
  showDots = true,
  showGrid = true,
  showTarget = true,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32; // Padding horizontal
  const chartHeight = height;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const chartData = useMemo(() => {
    if (records.length === 0)
      return { points: [], minValue: 0, maxValue: 0, pathData: "" };

    // Ordenar registros por fecha
    const sortedRecords = [...records]
      .sort(
        (a, b) =>
          new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
      )
      .slice(-20); // Mostrar solo los últimos 20 registros para mejor visualización

    // Calcular valores min y max con padding para mejor visualización
    const values = sortedRecords.map((r) => r.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    const paddedMin = minValue - valueRange * 0.1;
    const paddedMax = maxValue + valueRange * 0.1;

    // Si todos los valores son iguales, agregar un pequeño rango
    const finalMin = paddedMin === paddedMax ? paddedMin - 1 : paddedMin;
    const finalMax = paddedMin === paddedMax ? paddedMax + 1 : paddedMax;

    // Convertir registros a puntos del gráfico
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
      };
    });

    // Crear path para la línea
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

  const targetY = getTargetY();

  if (records.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          No hay datos suficientes para mostrar el gráfico
        </ThemedText>
      </View>
    );
  }

  if (records.length === 1) {
    return (
      <View style={styles.singlePointContainer}>
        <View style={styles.singlePoint}>
          <ThemedText type="defaultSemiBold" style={styles.singlePointValue}>
            {formatValue(records[0].value)} {metric.unit}
          </ThemedText>
          <ThemedText style={styles.singlePointDate}>
            {formatDate(records[0].recordDate)}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título del gráfico */}
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          Progreso de {metric.title}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Últimos {chartData.sortedRecords?.length || 0} registros
        </ThemedText>
      </View>

      <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
        <Defs>
          {/* Gradiente para la línea */}
          <SvgLinearGradient
            id="lineGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop
              offset="0%"
              stopColor={AiraColors.primary}
              stopOpacity="0.8"
            />
            <Stop
              offset="100%"
              stopColor={AiraColors.accent}
              stopOpacity="0.8"
            />
          </SvgLinearGradient>

          {/* Gradiente para el área bajo la línea */}
          <SvgLinearGradient
            id="areaGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop
              offset="0%"
              stopColor={AiraColors.primary}
              stopOpacity="0.3"
            />
            <Stop
              offset="100%"
              stopColor={AiraColors.primary}
              stopOpacity="0.05"
            />
          </SvgLinearGradient>
        </Defs>

        {/* Grid lines */}
        {showGrid && (
          <>
            {/* Líneas horizontales */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding.top + ratio * innerHeight;
              return (
                <Line
                  key={`h-grid-chart-${index}-${ratio}`}
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke={AiraColors.border}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              );
            })}

            {/* Líneas verticales */}
            {chartData.points.length > 1 &&
              [0, 0.5, 1].map((ratio, index) => {
                const x = padding.left + ratio * innerWidth;
                return (
                  <Line
                    key={`v-grid-chart-${index}-${ratio}`}
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + innerHeight}
                    stroke={AiraColors.border}
                    strokeWidth="1"
                    strokeOpacity="0.2"
                  />
                );
              })}
          </>
        )}

        {/* Línea objetivo */}
        {targetY && (
          <>
            <Line
              x1={padding.left}
              y1={targetY}
              x2={padding.left + innerWidth}
              y2={targetY}
              stroke="#FFA726"
              strokeWidth="2"
              strokeDasharray="5,5"
              strokeOpacity="0.8"
            />
            <SvgText
              x={padding.left + innerWidth - 5}
              y={targetY - 5}
              fontSize="12"
              fill="#FFA726"
              textAnchor="end"
              fontWeight="600"
            >
              Objetivo: {formatValue(metric.target!)}
            </SvgText>
          </>
        )}

        {/* Área bajo la línea */}
        {chartData.pathData && (
          <Path
            d={`${chartData.pathData} L ${
              chartData.points[chartData.points.length - 1].x
            } ${padding.top + innerHeight} L ${chartData.points[0].x} ${
              padding.top + innerHeight
            } Z`}
            fill="url(#areaGradient)"
          />
        )}

        {/* Línea principal */}
        {chartData.pathData && (
          <Path
            d={chartData.pathData}
            stroke="url(#lineGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Puntos de datos */}
        {showDots &&
          chartData.points.map((point, index) => (
            <Circle
              key={`chart-point-${point.originalIndex}-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={AiraColors.primary}
              stroke={AiraColors.card}
              strokeWidth="2"
            />
          ))}

        {/* Etiquetas del eje Y */}
        {[0, 0.5, 1].map((ratio, index) => {
          const y = padding.top + ratio * innerHeight;
          const value =
            chartData.maxValue -
            ratio * (chartData.maxValue - chartData.minValue);
          return (
            <SvgText
              key={`y-label-chart-${index}-${ratio}`}
              x={padding.left - 10}
              y={y + 4}
              fontSize="11"
              fill={AiraColors.mutedForeground}
              textAnchor="end"
            >
              {formatValue(value)}
            </SvgText>
          );
        })}

        {/* Etiquetas del eje X */}
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
                y={padding.top + innerHeight + 20}
                fontSize="10"
                fill={AiraColors.mutedForeground}
                textAnchor="middle"
              >
                {formatDate(point.date)}
              </SvgText>
            );
          })}
      </Svg>

      {/* Información adicional */}
      <View style={styles.footer}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Último</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.statValue}>
              {formatValue(
                chartData.points[chartData.points.length - 1]?.value || 0
              )}{" "}
              {metric.unit}
            </ThemedText>
          </View>

          {chartData.points.length > 1 && (
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Tendencia</ThemedText>
              <View style={styles.trendContainer}>
                {(() => {
                  const firstValue = chartData.points[0]?.value || 0;
                  const lastValue =
                    chartData.points[chartData.points.length - 1]?.value || 0;
                  const trend = lastValue - firstValue;
                  const isPositive = trend > 0;
                  const isNeutral = Math.abs(trend) < 0.01;

                  return (
                    <>
                      <ThemedText
                        type="defaultSemiBold"
                        style={[
                          styles.trendValue,
                          {
                            color: isNeutral
                              ? AiraColors.mutedForeground
                              : isPositive
                              ? AiraColors.accent
                              : AiraColors.destructive,
                          },
                        ]}
                      >
                        {isNeutral ? "=" : isPositive ? "+" : ""}
                        {formatValue(trend)} {metric.unit}
                      </ThemedText>
                    </>
                  );
                })()}
              </View>
            </View>
          )}
        </View>
      </View>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  svg: {
    marginVertical: 8,
  },
  footer: {
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AiraColors.border,
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
    fontSize: 14,
    color: AiraColors.foreground,
  },
  trendContainer: {
    alignItems: "center",
  },
  trendValue: {
    fontSize: 14,
  },
  emptyContainer: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    padding: 32,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
  },
  emptyText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
  singlePointContainer: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    padding: 24,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  singlePoint: {
    alignItems: "center",
  },
  singlePointValue: {
    fontSize: 24,
    color: AiraColors.primary,
    marginBottom: 8,
  },
  singlePointDate: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
});
