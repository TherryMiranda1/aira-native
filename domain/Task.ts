import { Category } from "./Category";

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MULTIPLE_DAYS = 'multiple_days'
}

export interface RecurrenceInfo {
  type: RecurrenceType;
  days?: number[]; // 0-6 representing days of the week (0 = Sunday)
  parentId?: string; // For linked recurring tasks
  recurrenceId?: string; // Unique ID for the recurrence group
}

export interface Task {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  title: string;
  description?: string;
  date: Date;
  isDone?: boolean;
  isImportant?: boolean;
  categories: Category[];
  color?: string;
  recurrence?: RecurrenceInfo;
}
