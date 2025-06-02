import { Realm } from "realm";
import { NoteSchema } from "./schemas/Notes";
import { MilestoneSchema } from "./schemas/Milestone";
import { ProjectSchema } from "./schemas/Projects";
import { CategorySchema } from "./schemas/Categories";
import { TaskSchema, RecurrenceInfoSchema } from "./schemas/Tasks";

// This delete the schemas inside the array
// Realm.deleteFile({
//   schema: [
//     NoteSchema,
//     MilestoneSchema,
//     ProjectSchema,
//     CategorySchema,
//   ],
//   path: Realm.defaultPath,
// });

export const realm = new Realm({
  schema: [NoteSchema, MilestoneSchema, ProjectSchema, CategorySchema, TaskSchema, RecurrenceInfoSchema],
  schemaVersion: 2,
});
