import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "../../Views/ThemedScrollView";
import { Task } from "@/domain/Task";
import { TaskItem } from "./TaskItem";
import { AiraColors } from "@/constants/Colors";

interface TaskListProps {
  selectedDate: Date;
  tasks: Task[];
  onAddTask: () => void;
  onToggleDone: (taskId: string) => void;
  onToggleImportant: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteRecurringTask?: (taskId: string, removeEntireSeries: boolean) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  selectedDate,
  tasks,
  onAddTask,
  onToggleDone,
  onToggleImportant,
  onEditTask,
  onDeleteTask,
  onDeleteRecurringTask,
}) => {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.contentHeader}>
        <ThemedText type="small">
          {format(selectedDate, "MMM yyyy", { locale: es })}
        </ThemedText>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: AiraColors.primary }]}
          onPress={onAddTask}
        >
          <ThemedText
            style={styles.addButtonText}
            lightColor={AiraColors.background}
            darkColor={AiraColors.background}
          >
            +
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedScrollView style={styles.taskList}>
        {tasks.length === 0 ? (
          <ThemedText
            style={styles.emptyText}
            lightColor={AiraColors.secondary}
            darkColor={AiraColors.secondary}
          >
            No hay tareas para este día.
          </ThemedText>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleDone={onToggleDone}
              onToggleImportant={onToggleImportant}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDeleteRecurring={onDeleteRecurringTask}
            />
          ))
        )}
      </ThemedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  taskList: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});
