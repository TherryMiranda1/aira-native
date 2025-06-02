import { Task } from "@/domain/Task";
import { toCategories } from "./toCategory";
import { Results, AnyRealmObject } from "realm";

export const toTask = (task: (AnyRealmObject & Task) | Task): Task => ({
  id: task.id,
  title: task.title,
  description: task.description,
  updatedAt: task.updatedAt,
  createdAt: task.createdAt,
  date: task.date,
  isDone: task.isDone,
  isImportant: task.isImportant,
  color: task.color,
  categories: toCategories(task.categories),
});

export const toTasks = (tasks: Results<AnyRealmObject> | Task[]): Task[] =>
  tasks.map((task) => toTask(task as AnyRealmObject & Task));
