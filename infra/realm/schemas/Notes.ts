import { SCHEMAS } from "@/infra/realm/constants/schemas";
import { Realm } from "realm";

export const NoteSchema: Realm.ObjectSchema = {
  name: SCHEMAS.note,
  primaryKey: "id",
  properties: {
    id: "string",
    updatedAt: "date",
    createdAt: "date",
    title: "string",
    cover: "string?",
    description: "string?",
    isImportant: "bool?",
    isDone: "bool?",
    isOnTrash: "bool?",
    categories: "CategorySchema[]",
    projects: {
      type: "linkingObjects",
      objectType: SCHEMAS.project,
      property: "notes",
    },
    milestones: "MilestoneSchema[]",
    color: "string?",
  },
};

export const noteEditableFields = {
  title: "title",
  description: "description",
  isImportant: "isImportant",
  isDone: "isDone",
  isOnTrash: "isOnTrash",
  cover: "cover",
  color: "color",
};
