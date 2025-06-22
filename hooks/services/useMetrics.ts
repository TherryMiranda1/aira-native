import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  metricsService,
  Metric,
  MetricRecord,
  CreateMetricData,
  CreateMetricRecordData,
} from "@/services/api/metrics.service";

export const useMetrics = () => {
  const { user } = useUser();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadMetrics = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userMetrics = await metricsService.getUserMetrics(user.id);
      setMetrics(userMetrics);
    } catch (err) {
      setError("Error al cargar las métricas");
      console.error("Failed to load metrics:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createMetric = async (metricData: CreateMetricData) => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      const newMetric = await metricsService.createMetric(user.id, metricData);
      setMetrics(prev => [newMetric, ...prev]);
      return newMetric;
    } catch (err) {
      setError("Error al crear la métrica");
      console.error("Failed to create metric:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateMetric = async (
    metricId: string,
    updates: Partial<CreateMetricData>
  ) => {
    try {
      setSaving(true);
      setError(null);

      const updatedMetric = await metricsService.updateMetric(metricId, updates);
      setMetrics(prev =>
        prev.map(metric =>
          metric.id === metricId ? updatedMetric : metric
        )
      );
      return updatedMetric;
    } catch (err) {
      setError("Error al actualizar la métrica");
      console.error("Failed to update metric:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteMetric = async (metricId: string) => {
    try {
      setSaving(true);
      setError(null);

      await metricsService.deleteMetric(metricId);
      setMetrics(prev => prev.filter(metric => metric.id !== metricId));
    } catch (err) {
      setError("Error al eliminar la métrica");
      console.error("Failed to delete metric:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadMetrics();
    }
  }, [user?.id, loadMetrics]);

  return {
    metrics,
    loading,
    error,
    saving,
    createMetric,
    updateMetric,
    deleteMetric,
    refetch: loadMetrics,
  };
};

export const useMetricRecords = (metricId?: string) => {
  const { user } = useUser();
  const [records, setRecords] = useState<MetricRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadRecords = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const metricRecords = await metricsService.getMetricRecords(
        user.id,
        metricId
      );
      setRecords(metricRecords);
    } catch (err) {
      setError("Error al cargar los registros");
      console.error("Failed to load metric records:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, metricId]);

  const createRecord = async (recordData: CreateMetricRecordData) => {
    if (!user?.id) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setSaving(true);
      setError(null);

      const newRecord = await metricsService.createMetricRecord(
        user.id,
        recordData
      );
      setRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError("Error al crear el registro");
      console.error("Failed to create metric record:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateRecord = async (
    recordId: string,
    updates: Partial<Omit<CreateMetricRecordData, 'metricId'>>
  ) => {
    try {
      setSaving(true);
      setError(null);

      const updatedRecord = await metricsService.updateMetricRecord(
        recordId,
        updates
      );
      setRecords(prev =>
        prev.map(record =>
          record.id === recordId ? updatedRecord : record
        )
      );
      return updatedRecord;
    } catch (err) {
      setError("Error al actualizar el registro");
      console.error("Failed to update metric record:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (recordId: string) => {
    try {
      setSaving(true);
      setError(null);

      await metricsService.deleteMetricRecord(recordId);
      setRecords(prev => prev.filter(record => record.id !== recordId));
    } catch (err) {
      setError("Error al eliminar el registro");
      console.error("Failed to delete metric record:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadRecords();
    }
  }, [user?.id, metricId, loadRecords]);

  return {
    records,
    loading,
    error,
    saving,
    createRecord,
    updateRecord,
    deleteRecord,
    refetch: loadRecords,
  };
};

export const useMetricStatistics = (metricId?: string) => {
  const { user } = useUser();
  const [statistics, setStatistics] = useState<{
    latestValue?: number;
    averageValue: number;
    minValue: number;
    maxValue: number;
    totalRecords: number;
    progressToTarget?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    if (!user?.id || !metricId) return;

    try {
      setLoading(true);
      setError(null);
      const stats = await metricsService.getMetricStatistics(user.id, metricId);
      setStatistics(stats);
    } catch (err) {
      setError("Error al cargar las estadísticas");
      console.error("Failed to load metric statistics:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, metricId]);

  useEffect(() => {
    if (user?.id && metricId) {
      loadStatistics();
    }
  }, [user?.id, metricId, loadStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: loadStatistics,
  };
};

export const useMetricRecentRecords = (metricId?: string, limit: number = 10) => {
  const { user } = useUser();
  const [records, setRecords] = useState<MetricRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecentRecords = useCallback(async () => {
    if (!user?.id || !metricId) return;

    try {
      setLoading(true);
      setError(null);
      const metricRecords = await metricsService.getMetricRecords(
        user.id,
        metricId,
        limit
      );
      setRecords(metricRecords);
    } catch (err) {
      setError("Error al cargar registros recientes");
      console.error("Failed to load recent metric records:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, metricId, limit]);

  useEffect(() => {
    if (user?.id && metricId) {
      loadRecentRecords();
    }
  }, [user?.id, metricId, loadRecentRecords]);

  return {
    records,
    loading,
    error,
    refetch: loadRecentRecords,
  };
}; 