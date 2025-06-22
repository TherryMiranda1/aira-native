import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { AiraColors } from "@/constants/Colors";
import { MetricRecord } from "@/services/api/metrics.service";

interface MetricMiniChartProps {
  records: MetricRecord[];
  width?: number;
  height?: number;
  showDots?: boolean;
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
}

export const MetricMiniChart: React.FC<MetricMiniChartProps> = ({
  records,
  width = 120,
  height = 40,
  showDots = false,
}) => {
  const padding = { top: 4, right: 4, bottom: 4, left: 4 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const chartData = useMemo(() => {
    if (records.length === 0) return { points: [], pathData: "" };

    // Ordenar registros por fecha y tomar los últimos 10 para el mini gráfico
    const sortedRecords = [...records]
      .sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime())
      .slice(-10);

    if (sortedRecords.length === 0) return { points: [], pathData: "" };

    // Calcular valores min y max
    const values = sortedRecords.map(r => r.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // Si todos los valores son iguales, agregar pequeño rango para visualización
    const finalMin = minValue === maxValue ? minValue - 0.5 : minValue;
    const finalMax = minValue === maxValue ? maxValue + 0.5 : maxValue;

    // Convertir registros a puntos del gráfico
    const points: ChartPoint[] = sortedRecords.map((record, index) => {
      const x = (index / Math.max(sortedRecords.length - 1, 1)) * innerWidth;
      const y = innerHeight - ((record.value - finalMin) / (finalMax - finalMin)) * innerHeight;
      
      return {
        x: x + padding.left,
        y: y + padding.top,
        value: record.value,
      };
    });

    // Crear path para la línea
    const pathData = points.length > 0 
      ? `M ${points[0].x} ${points[0].y} ` + 
        points.slice(1).map(point => `L ${point.x} ${point.y}`).join(" ")
      : "";

    return { points, pathData };
  }, [records, innerWidth, innerHeight, padding]);

  if (records.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <View style={styles.emptyChart} />
      </View>
    );
  }

  if (records.length === 1) {
    return (
      <View style={[styles.container, { width, height }]}>
        <View style={styles.singlePoint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          {/* Gradiente para la línea */}
          <SvgLinearGradient id="miniLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={AiraColors.primary} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={AiraColors.accent} stopOpacity="0.9" />
          </SvgLinearGradient>
          
          {/* Gradiente para el área */}
          <SvgLinearGradient id="miniAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={AiraColors.primary} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={AiraColors.primary} stopOpacity="0.1" />
          </SvgLinearGradient>
        </Defs>

        {/* Área bajo la línea */}
        {chartData.pathData && (
          <Path
            d={`${chartData.pathData} L ${chartData.points[chartData.points.length - 1].x} ${padding.top + innerHeight} L ${chartData.points[0].x} ${padding.top + innerHeight} Z`}
            fill="url(#miniAreaGradient)"
          />
        )}

        {/* Línea principal */}
        {chartData.pathData && (
          <Path
            d={chartData.pathData}
            stroke="url(#miniLineGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Puntos de datos (opcional) */}
        {showDots && chartData.points.map((point, index) => (
          <Circle
            key={`mini-point-${point.value}-${index}`}
            cx={point.x}
            cy={point.y}
            r="2"
            fill={AiraColors.primary}
            stroke={AiraColors.card}
            strokeWidth="1"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
  },
  emptyChart: {
    flex: 1,
    backgroundColor: AiraColors.muted,
    borderRadius: 4,
    opacity: 0.3,
  },
  singlePoint: {
    flex: 1,
    backgroundColor: AiraColors.primary,
    borderRadius: 4,
    opacity: 0.6,
  },
}); 