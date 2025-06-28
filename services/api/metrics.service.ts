import { API_CONFIG } from "./config";
import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";

export interface MetricFromCMS {
  id: string;
  userId: string;
  title: string;
  description?: string;
  unit: string;
  direction: 'increase' | 'decrease';
  target?: number;
  milestones?: {
    value: number;
    description?: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Metric {
  id: string;
  userId: string;
  title: string;
  description?: string;
  unit: string;
  direction: 'increase' | 'decrease';
  target?: number;
  milestones: {
    value: number;
    description?: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MetricRecordFromCMS {
  id: string;
  userId: string;
  metric: string | MetricFromCMS;
  value: number;
  recordDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MetricRecord {
  id: string;
  userId: string;
  metricId: string;
  metric?: Metric;
  value: number;
  recordDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMetricData {
  title: string;
  description?: string;
  unit: string;
  direction: 'increase' | 'decrease';
  target?: number;
  milestones?: {
    value: number;
    description?: string;
  }[];
}

export interface CreateMetricRecordData {
  metricId: string;
  value: number;
  recordDate: string;
  notes?: string;
}

const transformMetric = (cmsMetric: MetricFromCMS): Metric => {
  return {
    id: cmsMetric.id,
    userId: cmsMetric.userId,
    title: cmsMetric.title,
    description: cmsMetric.description,
    unit: cmsMetric.unit,
    direction: cmsMetric.direction,
    target: cmsMetric.target,
    milestones: cmsMetric.milestones || [],
    isActive: cmsMetric.isActive,
    createdAt: cmsMetric.createdAt,
    updatedAt: cmsMetric.updatedAt,
  };
};

const transformMetricRecord = (
  cmsRecord: MetricRecordFromCMS
): MetricRecord => {
  const metricId =
    typeof cmsRecord.metric === "string"
      ? cmsRecord.metric
      : cmsRecord.metric.id;

  const metric =
    typeof cmsRecord.metric === "object"
      ? transformMetric(cmsRecord.metric)
      : undefined;

  return {
    id: cmsRecord.id,
    userId: cmsRecord.userId,
    metricId,
    metric,
    value: cmsRecord.value,
    recordDate: cmsRecord.recordDate,
    notes: cmsRecord.notes,
    createdAt: cmsRecord.createdAt,
    updatedAt: cmsRecord.updatedAt,
  };
};

class MetricsService {
  async getUserMetrics(userId: string): Promise<Metric[]> {
    try {
      const query = stringify({
        where: {
          userId: {
            equals: userId,
          },
          isActive: {
            equals: true,
          },
        },
        sort: "-updatedAt",
        limit: 50,
      });

      const response = await apiClient.get<{
        docs: MetricFromCMS[];
      }>(`${API_CONFIG.ENDPOINTS.METRICS}?${query}`);

      return response.data.docs.map(transformMetric);
    } catch (error) {
      console.error("Error fetching user metrics:", error);
      throw new Error("Failed to fetch metrics");
    }
  }

  async createMetric(
    userId: string,
    metricData: CreateMetricData
  ): Promise<Metric> {
    try {
      const payload = {
        userId,
        ...metricData,
        isActive: true,
      };

      const response = await apiClient.post<MetricFromCMS>(
        API_CONFIG.ENDPOINTS.METRICS,
        payload
      );

      return transformMetric(response.data);
    } catch (error) {
      console.error("Error creating metric:", error);
      throw new Error("Failed to create metric");
    }
  }

  async updateMetric(
    metricId: string,
    updates: Partial<CreateMetricData>
  ): Promise<Metric> {
    try {
      const response = await apiClient.patch<MetricFromCMS>(
        `${API_CONFIG.ENDPOINTS.METRICS}/${metricId}`,
        updates
      );

      return transformMetric(response.data);
    } catch (error) {
      console.error("Error updating metric:", error);
      throw new Error("Failed to update metric");
    }
  }

  async deleteMetric(metricId: string): Promise<void> {
    try {
      await apiClient.patch(`${API_CONFIG.ENDPOINTS.METRICS}/${metricId}`, {
        isActive: false,
      });
    } catch (error) {
      console.error("Error deleting metric:", error);
      throw new Error("Failed to delete metric");
    }
  }

  async getMetricRecords(
    userId: string,
    metricId?: string,
    limit: number = 50
  ): Promise<MetricRecord[]> {
    try {
      const whereClause: any = {
        userId: {
          equals: userId,
        },
      };

      if (metricId) {
        whereClause.metric = {
          equals: metricId,
        };
      }

      const query = stringify({
        where: whereClause,
        sort: "-recordDate",
        limit,
        depth: 2,
      });

      const response = await apiClient.get<{
        docs: MetricRecordFromCMS[];
      }>(`${API_CONFIG.ENDPOINTS.METRIC_RECORDS}?${query}`);

      return response.data.docs.map(transformMetricRecord);
    } catch (error) {
      console.error("Error fetching metric records:", error);
      throw new Error("Failed to fetch metric records");
    }
  }

  async createMetricRecord(
    userId: string,
    recordData: CreateMetricRecordData
  ): Promise<MetricRecord> {
    try {
      const payload = {
        userId,
        metric: recordData.metricId,
        value: recordData.value,
        recordDate: recordData.recordDate,
        notes: recordData.notes,
      };

      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.METRIC_RECORDS,
        payload
      );

      return transformMetricRecord(response.data.doc);
    } catch (error) {
      console.error("Error creating metric record:", error);
      throw new Error("Failed to create metric record");
    }
  }

  async updateMetricRecord(
    recordId: string,
    updates: Partial<Omit<CreateMetricRecordData, "metricId">>
  ): Promise<MetricRecord> {
    try {
      const payload: any = {};

      if (updates.value !== undefined) payload.value = updates.value;
      if (updates.recordDate !== undefined)
        payload.recordDate = updates.recordDate;
      if (updates.notes !== undefined) payload.notes = updates.notes;

      const response = await apiClient.patch(
        `${API_CONFIG.ENDPOINTS.METRIC_RECORDS}/${recordId}`,
        payload
      );

      return transformMetricRecord(response.data.doc);
    } catch (error) {
      console.error("Error updating metric record:", error);
      throw new Error("Failed to update metric record");
    }
  }

  async deleteMetricRecord(recordId: string): Promise<void> {
    try {
      await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.METRIC_RECORDS}/${recordId}`
      );
    } catch (error) {
      console.error("Error deleting metric record:", error);
      throw new Error("Failed to delete metric record");
    }
  }

  async getMetricStatistics(
    userId: string,
    metricId: string
  ): Promise<{
    latestValue?: number;
    averageValue: number;
    minValue: number;
    maxValue: number;
    totalRecords: number;
    progressToTarget?: number;
  }> {
    try {
      const records = await this.getMetricRecords(userId, metricId, 100);

      if (records.length === 0) {
        return {
          averageValue: 0,
          minValue: 0,
          maxValue: 0,
          totalRecords: 0,
        };
      }

      const values = records.map((record) => record.value);
      const latestValue = records[0]?.value;
      const averageValue =
        values.reduce((sum, val) => sum + val, 0) / values.length;
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      const metric = records[0]?.metric;
      let progressToTarget: number | undefined;

      if (metric?.target && latestValue !== undefined) {
        if (metric.direction === 'increase') {
          progressToTarget = (latestValue / metric.target) * 100;
        } else {
          const startValue = metric.target * 1.5;
          const progressRange = startValue - metric.target;
          const currentProgress = Math.max(0, startValue - latestValue);
          progressToTarget = Math.min(100, (currentProgress / progressRange) * 100);
        }
      }

      return {
        latestValue,
        averageValue: Math.round(averageValue * 100) / 100,
        minValue,
        maxValue,
        totalRecords: records.length,
        progressToTarget,
      };
    } catch (error) {
      console.error("Error calculating metric statistics:", error);
      throw new Error("Failed to calculate metric statistics");
    }
  }
}

export const metricsService = new MetricsService();
