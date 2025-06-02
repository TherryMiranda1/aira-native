import { SCHEMAS } from "@/infra/realm/constants/schemas";
import { Realm } from "realm";

// Embedded schema for RecurrenceInfo
export const RecurrenceInfoSchema: Realm.ObjectSchema = {
  name: "RecurrenceInfo",
  embedded: true,
  properties: {
    type: "string",
    days: "int[]",
    parentId: "string?",
    recurrenceId: "string?",
  },
};

export const TaskSchema: Realm.ObjectSchema = {
  name: SCHEMAS.task,
  primaryKey: "id",
  properties: {
    id: "string",
    updatedAt: "date",
    createdAt: "date",
    title: "string",
    description: "string?",
    date: "date",
    isDone: "bool?",
    isImportant: "bool?",
    categories: "CategorySchema[]",
    color: "string?",
    recurrence: "RecurrenceInfo?",
  },
};

export const taskEditableFields = {
  title: "title",
  description: "description",
  date: "date",
  isDone: "isDone",
  isImportant: "isImportant",
  color: "color",
  recurrence: "recurrence",
};
