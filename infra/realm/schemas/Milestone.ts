import { Realm } from "realm";

export const MilestoneSchema: Realm.ObjectSchema = {
  name: "MilestoneSchema",
  primaryKey: "id",
  properties: {
    id: "string",
    createdAt: "date",
    updatedAt: "date",
    title: "string",
    notes: "NoteSchema[]",
    description: "string?",
    dueAt: "date?",
    cover: "string?",
  },
};
