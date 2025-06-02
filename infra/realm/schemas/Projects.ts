import { Realm } from "realm";

export const ProjectSchema: Realm.ObjectSchema = {
  name: "ProjectSchema",
  primaryKey: "id",
  properties: {
    id: "string",
    createdAt: "date",
    updatedAt: "date",
    title: "string",
    description: "string?",
    cover: "string?",
    isImportant: "bool?",
    categories: {
      type: "linkingObjects",
      objectType: "CategorySchema",
      property: "projects",
    },
    milestones: "MilestoneSchema[]",
    notes: "NoteSchema[]",
    color: "string?",
  },
};

export const projectEditableFields = {
  title: "title",
  description: "description",
  isImportant: "isImportant",
  cover: "cover",
};
