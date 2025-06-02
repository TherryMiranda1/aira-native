import { Task, RecurrenceType } from "@/domain/Task";
import { realm } from "@/infra/realm/controller";
import { toTask, toTasks } from "@/infra/realm/mappers/toTask";
import { SCHEMAS } from "@/infra/realm/constants/schemas";
import { buildId, buildIdAndDate } from "../../utils/itemUtils";
import { mapToUpdatedFields } from "@/infra/utils/mapToUpdatedFields";
import { taskEditableFields } from "../schemas/Tasks";
import { createOrUpdateCategory } from "@/infra/utils/relationsHelpers";
import { isSameDay, getDay } from "date-fns";

export const useRealmTasks = () => {
  const getTasks = () => {
    const tasks = realm.objects<Task>(SCHEMAS.task);
    return toTasks(tasks as any);
  };

  const getTasksByDate = (date: Date) => {
    const tasks = realm.objects<Task>(SCHEMAS.task);
    const filteredTasks = tasks
      .filtered("date != null")
      .filter((task) => isSameDay(task.date, date));
    return toTasks(filteredTasks as any);
  };

  const addTask = (data: Partial<Task>) => {
    let newTask;

    // Handle recurring tasks
    if (data.recurrence && data.recurrence.type !== RecurrenceType.NONE) {
      return addRecurringTask(data);
    }

    realm.write(() => {
      // Handle categories if present
      if (data.categories && data.categories.length > 0) {
        const categories = data.categories.map(createOrUpdateCategory);
        data.categories = categories;
      }

      newTask = realm.create(SCHEMAS.task, buildIdAndDate(data));
    });

    return toTask(newTask as any);
  };

  // Helper function to add recurring tasks
  const addRecurringTask = (data: Partial<Task>) => {
    const recurrenceId = buildId();
    let mainTask: any;

    realm.write(() => {
      // Handle categories if present
      if (data.categories && data.categories.length > 0) {
        const categories = data.categories.map(createOrUpdateCategory);
        data.categories = categories;
      }

      // Create the main task
      const taskData = buildIdAndDate(data);

      // Set recurrence ID for the group
      if (taskData.recurrence) {
        taskData.recurrence.recurrenceId = recurrenceId;
      }

      mainTask = realm.create(SCHEMAS.task, taskData);

      // For daily recurrence, we don't need to create additional tasks
      if (data.recurrence?.type === RecurrenceType.DAILY) {
        // No additional tasks needed as this will be handled during retrieval
        return;
      }

      // For weekly recurrence (single day of week)
      if (data.recurrence?.type === RecurrenceType.WEEKLY && data.date) {
        // No additional tasks needed as this will be handled during retrieval
        return;
      }

      // For multiple days of the week
      if (
        data.recurrence?.type === RecurrenceType.MULTIPLE_DAYS &&
        data.recurrence.days &&
        data.recurrence.days.length > 0 &&
        data.date
      ) {
        // The first occurrence is already created as the main task
        // No need to create additional tasks as they will be handled during retrieval
        return;
      }
    });

    return mainTask ? toTask(mainTask) : null;
  };

  const editTask = (updateTask: Partial<Task>) => {
    let updatedTask;

    realm.write(() => {
      let existingTask = realm.objectForPrimaryKey<Task>(
        SCHEMAS.task,
        updateTask.id
      );

      if (!existingTask) {
        throw new Error(`No se encontró la tarea con id ${updateTask.id}`);
      }

      // Handle categories if present
      if (updateTask.categories && updateTask.categories.length > 0) {
        const categories = updateTask.categories.map(createOrUpdateCategory);
        updateTask.categories = categories;
      }

      existingTask.updatedAt = new Date();
      mapToUpdatedFields<Task>(
        existingTask,
        updateTask,
        {},
        taskEditableFields
      );

      updatedTask = existingTask;
    });

    return toTask(updatedTask as any);
  };

  const removeTask = (taskId: string) => {
    realm.write(() => {
      const task = realm.objectForPrimaryKey(SCHEMAS.task, taskId);
      if (task) {
        realm.delete(task);
      }
    });
  };

  // Remove a recurring task - either a single instance or the entire series
  const removeRecurringTask = (taskId: string, removeEntireSeries: boolean) => {
    const task = realm.objectForPrimaryKey<Task>(SCHEMAS.task, taskId);

    if (!task) return;

    if (removeEntireSeries && task.recurrence?.recurrenceId) {
      // Delete all tasks in the series
      realm.write(() => {
        const tasksInSeries = realm
          .objects<Task>(SCHEMAS.task)
          .filtered(
            "recurrence.recurrenceId = $0",
            task.recurrence?.recurrenceId
          );

        realm.delete(tasksInSeries);
      });
    } else {
      // Delete just this instance
      realm.write(() => {
        realm.delete(task);
      });
    }
  };

  const getTask = (taskId: string) => {
    const task = realm.objectForPrimaryKey<Task>(SCHEMAS.task, taskId);

    if (!task) {
      console.log(`No se encontró la tarea con id ${taskId}`);
      return;
    }
    return toTask(task);
  };

  const toggleTaskDone = (id: string) => {
    let updatedTask;

    realm.write(() => {
      const task = realm.objectForPrimaryKey<Task>(SCHEMAS.task, id);
      if (task) {
        task.isDone = !task.isDone;
        updatedTask = task;
      }
    });

    return updatedTask ? toTask(updatedTask) : null;
  };

  const toggleTaskImportant = (id: string) => {
    let updatedTask;

    realm.write(() => {
      const task = realm.objectForPrimaryKey<Task>(SCHEMAS.task, id);
      if (task) {
        task.isImportant = !task.isImportant;
        updatedTask = task;
      }
    });

    return updatedTask ? toTask(updatedTask) : null;
  };

  return {
    getTasks,
    getTasksByDate,
    addTask,
    editTask,
    removeTask,
    removeRecurringTask,
    getTask,
    toggleTaskDone,
    toggleTaskImportant,
  };
};

// Utility functions for external use
export const getTasksByDate = (date: Date) => {
  const tasks = realm.objects<Task>(SCHEMAS.task);

  // Get regular tasks for this date
  const regularTasks = tasks
    .filtered(
      "date != null AND (recurrence == null OR recurrence.type == 'none')"
    )
    .filter((task) => isSameDay(task.date, date));

  // Get recurring tasks
  const recurringTasks = getRecurringTasksForDate(date);

  // Combine and convert to domain tasks
  return toTasks([...regularTasks, ...recurringTasks] as any);
};

// Helper function to get recurring tasks for a specific date
const getRecurringTasksForDate = (date: Date) => {
  const tasks = realm.objects<Task>(SCHEMAS.task);
  const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
  const result: Task[] = [];

  // Get daily recurring tasks
  const dailyTasks = tasks.filtered("recurrence.type = 'daily'");
  dailyTasks.forEach((task) => {
    // Only include if the task's start date is on or before the target date
    if (task.date && task.date <= date) {
      result.push(task);
    }
  });

  // Get weekly recurring tasks (same day of week)
  const weeklyTasks = tasks.filtered("recurrence.type = 'weekly'");
  weeklyTasks.forEach((task) => {
    if (task.date && getDay(task.date) === dayOfWeek && task.date <= date) {
      result.push(task);
    }
  });

  // Get multiple days recurring tasks
  const multipleDaysTasks = tasks.filtered("recurrence.type = 'multiple_days'");
  multipleDaysTasks.forEach((task) => {
    if (
      task.recurrence &&
      task.recurrence.days &&
      task.recurrence.days.includes(dayOfWeek) &&
      task.date &&
      task.date <= date
    ) {
      result.push(task);
    }
  });

  return result;
};

export const realmTasksUtils = {
  getTasksByDate,
  getRecurringTasksForDate,
};
