import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { LoadingState } from "@/components/States/LoadingState";
import { EmptyState } from "@/components/States/EmptyState";
import { ErrorState } from "@/components/States/ErrorState";
import {
  useMetrics,
  useMetricRecords,
  useMetricStatistics,
} from "@/hooks/services/useMetrics";
import { CreateRecordModal } from "@/components/metrics/CreateRecordModal";
import { MetricRecordCard } from "@/components/metrics/MetricRecordCard";
import { Metric } from "@/services/api/metrics.service";
import { MetricStatistics } from "@/components/metrics/MetricStatistics";
import { InteractiveMetricChart } from "@/components/metrics/InteractiveMetricChart";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export default function MetricDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { metrics, loading: metricsLoading } = useMetrics();
  const {
    records,
    loading: recordsLoading,
    error,
    deleteRecord,
    refetch,
  } = useMetricRecords(id);
  const { statistics } = useMetricStatistics(id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInteractiveChart, setShowInteractiveChart] = useState(false);
  const [metric, setMetric] = useState<Metric | null>(null);
  const { showText, handleScroll } = useScrollDirection();

  useEffect(() => {
    if (metrics.length > 0 && id) {
      const foundMetric = metrics.find((m) => m.id === id);
      setMetric(foundMetric || null);
    }
  }, [metrics, id]);

  const handleDeleteRecord = (recordId: string, recordDate: string) => {
    Alert.alert(
      "Eliminar registro",
      `¿Estás segura de que quieres eliminar el registro del ${new Date(
        recordDate
      ).toLocaleDateString()}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteRecord(recordId),
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (metricsLoading || recordsLoading) {
    return (
      <PageView>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Topbar title="Cargando..." showBackButton onBack={handleBack} />
        <LoadingState title="Cargando métrica..." />
      </PageView>
    );
  }

  if (!metric) {
    return (
      <PageView>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Topbar title="Error" showBackButton onBack={handleBack} />
        <ErrorState
          title="Métrica no encontrada"
          description="No se pudo cargar la información de esta métrica"
          buttonText="Volver"
          onRetry={() => router.back()}
        />
      </PageView>
    );
  }

  if (error) {
    return (
      <PageView>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Topbar title={metric.title} showBackButton onBack={handleBack} />
        <ErrorState
          title="Error al cargar registros"
          description={error}
          onRetry={refetch}
        />
      </PageView>
    );
  }

  return (
    <PageView>
      <Topbar title={metric.title} showBackButton onBack={handleBack} />

      <LinearGradient
        colors={[
          AiraColors.airaLavenderSoft,
          AiraColors.airaSageSoft,
          AiraColors.airaCreamy,
        ]}
        style={styles.gradientBackground}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Información de la métrica */}
          <View style={styles.metricInfo}>
            <ThemedText type="title" style={styles.metricTitle}>
              {metric.title}
            </ThemedText>
            {metric.description && (
              <ThemedText style={styles.metricDescription}>
                {metric.description}
              </ThemedText>
            )}
            <View style={styles.metricMeta}>
              <ThemedText style={styles.metricUnit}>
                Unidad: {metric.unit}
              </ThemedText>
              {metric.target && (
                <ThemedText style={styles.metricTarget}>
                  Objetivo: {metric.target} {metric.unit}
                </ThemedText>
              )}
            </View>
          </View>

          {/* Gráfico de progreso */}
          <View style={styles.chartSection}>
            <View style={styles.chartHeader}>
              <ThemedText type="defaultSemiBold" style={styles.chartTitle}>
                Visualización del Progreso
              </ThemedText>
            </View>

            <InteractiveMetricChart
              records={records}
              metric={metric}
              height={320}
              showDots={true}
              showGrid={true}
              showTarget={true}
            />
          </View>

          {/* Estadísticas */}
          {statistics && (
            <MetricStatistics statistics={statistics} metric={metric} />
          )}

          {/* Lista de registros */}
          <View style={styles.recordsSection}>
            <ThemedText type="defaultSemiBold" style={styles.recordsTitle}>
              Historial de registros
            </ThemedText>

            {records.length === 0 ? (
              <EmptyState
                title="Sin registros aún"
                description="Agrega tu primer registro para comenzar a hacer seguimiento"
                buttonText="Agregar registro"
                onPress={() => setShowCreateModal(true)}
              />
            ) : (
              <View style={styles.recordsList}>
                {records.map((record) => (
                  <MetricRecordCard
                    key={record.id}
                    record={record}
                    metric={metric}
                    onDelete={() =>
                      handleDeleteRecord(record.id, record.recordDate)
                    }
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Modal para crear registro */}
      <CreateRecordModal
        visible={showCreateModal}
        metric={metric}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          refetch();
        }}
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={() => setShowCreateModal(true)}
        iconName="add"
        variant="primary"
        bottomPadding={48}
      />
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
  metricInfo: {
    backgroundColor: AiraColors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  metricTitle: {
    marginBottom: 8,
    color: AiraColors.foreground,
  },
  metricDescription: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    lineHeight: 22,
    marginBottom: 12,
  },
  metricMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricUnit: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  metricTarget: {
    fontSize: 14,
  },

  recordsSection: {
    marginBottom: 20,
  },
  recordsTitle: {
    fontSize: 18,
    color: AiraColors.foreground,
    marginBottom: 16,
  },
  recordsList: {
    gap: 12,
  },
  chartSection: {
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  chartTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
  },
  chartToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.muted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chartToggleText: {
    fontSize: 12,
    color: AiraColors.primary,
    marginLeft: 6,
  },
});
