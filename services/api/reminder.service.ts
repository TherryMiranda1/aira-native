import { API_CONFIG } from "./config";
import { apiClient } from "./apiClient";
import { stringify } from 'qs-esm';

export interface ReminderFromCMS {
  id: string;
  userId: string;
  originalText: string;
  reminderText: string;
  eventAt?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'health' | 'exercise' | 'nutrition' | 'medical' | 'selfcare' | 'work' | 'personal' | 'family' | 'other';
  tags?: {
    tag: string;
  }[];
  notes?: string;
  notificationSent: boolean;
  recurrenceType: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  metadata?: {
    interpretationNotes?: string;
    aiConfidence?: number;
    source?: 'chat' | 'web' | 'api';
  };
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  originalText: string;
  reminderText: string;
  eventAt?: Date;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'health' | 'exercise' | 'nutrition' | 'medical' | 'selfcare' | 'work' | 'personal' | 'family' | 'other';
  tags: string[];
  notes?: string;
  notificationSent: boolean;
  recurrenceType: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  metadata?: {
    interpretationNotes?: string;
    aiConfidence?: number;
    source?: 'chat' | 'web' | 'api';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReminderInput {
  originalText: string;
  reminderText: string;
  eventAt?: string; // ISO string
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'health' | 'exercise' | 'nutrition' | 'medical' | 'selfcare' | 'work' | 'personal' | 'family' | 'other';
  tags?: string[];
  notes?: string;
  recurrenceType?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  metadata?: {
    interpretationNotes?: string;
    aiConfidence?: number;
    source?: 'chat' | 'web' | 'api';
  };
}

export interface UpdateReminderInput {
  reminderText?: string;
  eventAt?: string;
  isCompleted?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'health' | 'exercise' | 'nutrition' | 'medical' | 'selfcare' | 'work' | 'personal' | 'family' | 'other';
  tags?: string[];
  notes?: string;
  notificationSent?: boolean;
  recurrenceType?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  metadata?: {
    interpretationNotes?: string;
    aiConfidence?: number;
    source?: 'chat' | 'web' | 'api';
  };
}

const transformReminder = (cmsReminder: ReminderFromCMS): Reminder => {
    console.log("cmsReminder", cmsReminder)
  const tags = cmsReminder.tags?.map((tag) => tag.tag) || [];
  
  return {
    id: cmsReminder.id,
    userId: cmsReminder.userId,
    originalText: cmsReminder.originalText,
    reminderText: cmsReminder.reminderText,
    eventAt: cmsReminder.eventAt ? new Date(cmsReminder.eventAt) : undefined,
    isCompleted: cmsReminder.isCompleted,
    priority: cmsReminder.priority,
    category: cmsReminder.category,
    tags,
    notes: cmsReminder.notes,
    notificationSent: cmsReminder.notificationSent,
    recurrenceType: cmsReminder.recurrenceType,
    metadata: cmsReminder.metadata,
    createdAt: new Date(cmsReminder.createdAt),
    updatedAt: new Date(cmsReminder.updatedAt),
  };
};

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}

export const reminderService = {
  async getReminders(userId: string, params: PaginationParams = {}): Promise<{
    reminders: Reminder[];
    pagination: Omit<PaginatedResponse<any>, "docs">;
  }> {
    try {
      const { page = 1, limit = 50, sort = "-createdAt", where = {} } = params;

      const defaultWhere = {
        userId: { equals: userId },
        ...where
      };

      const queryObj: any = {
        limit: limit.toString(),
        page: page.toString(),
        sort,
        where: defaultWhere
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.REMINDERS}${queryString}`);

      const reminders = (response.data.docs || []).map(transformReminder);

      const { docs, ...paginationInfo } = response.data;
      return {
        reminders,
        pagination: paginationInfo,
      };
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
      throw error;
    }
  },

  async getReminderById(id: string): Promise<Reminder | null> {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.REMINDERS}/${id}`);

      return transformReminder(response.data);
    } catch (error) {
      console.error(`Failed to fetch reminder with id ${id}:`, error);
      return null;
    }
  },

  async createReminder(userId: string, input: CreateReminderInput): Promise<Reminder> {
    try {
      console.log("[ReminderService] Creating reminder - Input:", { userId, input });
      
      const requestBody = {
        userId,
        originalText: input.originalText,
        reminderText: input.reminderText,
        eventAt: input.eventAt,
        priority: input.priority || 'medium',
        category: input.category,
        tags: input.tags?.map(tag => ({ tag })) || [],
        notes: input.notes,
        recurrenceType: input.recurrenceType || 'once',
        metadata: input.metadata || { source: 'chat' },
      };

      console.log("[ReminderService] Request body:", requestBody);

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.REMINDERS, requestBody);

      console.log("[ReminderService] Response data:", response.data);
      
      const transformedResult = transformReminder(response.data);
      console.log("[ReminderService] Transformed result:", transformedResult);
      
      return transformedResult;
    } catch (error) {
      console.error("[ReminderService] Failed to create reminder:", error);
      throw error;
    }
  },

  async updateReminder(id: string, input: UpdateReminderInput): Promise<Reminder> {
    try {
      const requestBody: any = {};
      
      if (input.reminderText !== undefined) requestBody.reminderText = input.reminderText;
      if (input.eventAt !== undefined) requestBody.eventAt = input.eventAt;
      if (input.isCompleted !== undefined) requestBody.isCompleted = input.isCompleted;
      if (input.priority !== undefined) requestBody.priority = input.priority;
      if (input.category !== undefined) requestBody.category = input.category;
      if (input.tags !== undefined) requestBody.tags = input.tags.map(tag => ({ tag }));
      if (input.notes !== undefined) requestBody.notes = input.notes;
      if (input.notificationSent !== undefined) requestBody.notificationSent = input.notificationSent;
      if (input.recurrenceType !== undefined) requestBody.recurrenceType = input.recurrenceType;
      if (input.metadata !== undefined) requestBody.metadata = input.metadata;

      const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.REMINDERS}/${id}`, requestBody);

      return transformReminder(response.data);
    } catch (error) {
      console.error(`Failed to update reminder ${id}:`, error);
      throw error;
    }
  },

  async deleteReminder(id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.REMINDERS}/${id}`);
    } catch (error) {
      console.error(`Failed to delete reminder ${id}:`, error);
      throw error;
    }
  },

  async getUpcomingReminders(userId: string, days: number = 7): Promise<Reminder[]> {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      const { reminders } = await this.getReminders(userId, {
        where: {
          eventAt: {
            gte: today.toISOString(),
            lte: futureDate.toISOString()
          },
          isCompleted: { equals: false }
        },
        sort: "eventAt"
      });

      return reminders;
    } catch (error) {
      console.error("Failed to fetch upcoming reminders:", error);
      return [];
    }
  },

  async getOverdueReminders(userId: string): Promise<Reminder[]> {
    try {
      const today = new Date();

      const { reminders } = await this.getReminders(userId, {
        where: {
          eventAt: {
            lt: today.toISOString()
          },
          isCompleted: { equals: false }
        },
        sort: "eventAt"
      });

      return reminders;
    } catch (error) {
      console.error("Failed to fetch overdue reminders:", error);
      return [];
    }
  },

  async markAsCompleted(id: string): Promise<Reminder> {
    return this.updateReminder(id, { isCompleted: true, notificationSent: true });
  },

  async getByCategory(userId: string, category: string): Promise<Reminder[]> {
    try {
      const { reminders } = await this.getReminders(userId, {
        where: {
          category: { equals: category }
        },
        sort: "-createdAt"
      });

      return reminders;
    } catch (error) {
      console.error(`Failed to fetch reminders for category ${category}:`, error);
      return [];
    }
  },
}; 