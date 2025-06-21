import { startOfWeek } from "date-fns";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  getTasksByDate,
  useRealmTasks,
} from "@/infra/realm/services/useRealmTasks";
import { Task } from "@/domain/Task";
import { WeekNavigation, TaskList, TaskForm } from "./components";

const WeeklyCalendar: React.FC = () => {
  const today = new Date();
  const initialWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Sunday as start

  // State for calendar navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(initialWeekStart);
  const [selectedDate, setSelectedDate] = useState(today);

  // Task form state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Realm tasks hook
  const {
    addTask,
    editTask,
    removeTask,
    removeRecurringTask,
    toggleTaskDone,
    toggleTaskImportant,
  } = useRealmTasks();

  // Get tasks for the selected date
  const tasks = getTasksByDate(selectedDate);

  // Handlers for task operations
  const handleAddTask = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      editTask(taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <View style={styles.container}>
      {/* Week navigation component */}
      <WeekNavigation
        currentWeekStart={currentWeekStart}
        selectedDate={selectedDate}
        onWeekChange={setCurrentWeekStart}
        onDateSelect={setSelectedDate}
      />

      {/* Task list component */}
      <TaskList
        selectedDate={selectedDate}
        tasks={tasks}
        onAddTask={handleAddTask}
        onToggleDone={toggleTaskDone}
        onToggleImportant={toggleTaskImportant}
        onEditTask={handleEditTask}
        onDeleteTask={removeTask}
        onDeleteRecurringTask={removeRecurringTask}
      />

      {/* Task form modal */}
      <TaskForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTask}
        initialTask={editingTask || undefined}
        selectedDate={selectedDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WeeklyCalendar;
