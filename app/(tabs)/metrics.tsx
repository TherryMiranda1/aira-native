import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Stack, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { RefreshablePageView } from "@/components/ui/RefreshablePageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { LoadingState } from "@/components/States/LoadingState";
import { EmptyState } from "@/components/States/EmptyState";
import { ErrorState } from "@/components/States/ErrorState";
import { useMetrics } from "@/hooks/services/useMetrics";
import { CreateMetricModal } from "@/components/metrics/CreateMetricModal";
import { MetricCard } from "@/components/metrics/MetricCard";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

import { useAlertHelpers } from "@/components/ui/AlertSystem";

export default function MetricsScreen() {
  const { metrics, loading, error, deleteMetric, refetch } = useMetrics();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showConfirm } = useAlertHelpers();

  const handleDeleteMetric = (metricId: string, metricTitle: string) => {
    showConfirm(
      "Eliminar métrica",
      `¿Estás segura de que quieres eliminar "${metricTitle}"? Esta acción no se puede deshacer.`,
      () => deleteMetric(metricId),
      undefined,
      "Eliminar",
      "Cancelar"
    );
  };

  const handleMetricPress = (metricId: string) => {
    router.push({
      pathname: "/dashboard/metric/[id]",
      params: { id: metricId },
    });
  };

  if (loading) {
    return (
      <RefreshablePageView>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Topbar title="Mis Métricas" actions={<ProfileButton />} />
        <LoadingState title="Cargando tus métricas..." />
      </RefreshablePageView>
    );
  }

  if (error) {
    return (
      <RefreshablePageView>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Topbar title="Mis Métricas" actions={<ProfileButton />} />
        <ErrorState
          title="Error al cargar métricas"
          description="Error al cargar métricas"
          onRetry={refetch}
        />
      </RefreshablePageView>
    );
  }

  return (
    <RefreshablePageView
      onRefresh={refetch}
      onEndReach={refetch}
      refreshing={loading}
      contentContainerStyle={styles.scrollContent}
      endReachText="Desliza hacia abajo para actualizar métricas"
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Topbar title="Mis Métricas" actions={<ProfileButton />} />

      <LinearGradient
        colors={[
          AiraColors.airaLavenderSoft,
          AiraColors.airaSageSoft,
          AiraColors.airaCreamy,
        ]}
        style={styles.gradientBackground}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Seguimiento Personal
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Registra y visualiza tu progreso de manera sencilla
          </ThemedText>
        </View>

        {/* Lista de métricas */}
        {metrics.length === 0 ? (
          <EmptyState
            title="Sin métricas aún"
            description="Crea tu primera métrica para comenzar a hacer seguimiento de tu progreso"
            buttonText="Crear métrica"
            onPress={() => setShowCreateModal(true)}
          />
        ) : (
          <View style={styles.metricsContainer}>
            {metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                onPress={() => handleMetricPress(metric.id)}
                onDelete={() => handleDeleteMetric(metric.id, metric.title)}
              />
            ))}
          </View>
        )}
      </LinearGradient>

      {/* Modal para crear métrica */}
      <CreateMetricModal
        visible={showCreateModal}
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
      />
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
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    color: AiraColors.foreground,
  },
  subtitle: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    lineHeight: 22,
  },
  metricsContainer: {
    gap: 16,
  },
});
