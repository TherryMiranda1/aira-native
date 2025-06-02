import { SCHEMAS } from "@/infra/realm/constants/schemas";
import { Realm } from "realm";

export const CategorySchema: Realm.ObjectSchema = {
  name: "CategorySchema",
  primaryKey: "id",
  properties: {
    id: "string",
    title: "string",
    content: "string?",
    color: "string?",
    updatedAt: "date",
    createdAt: "date",
    notes: {
      type: "linkingObjects",
      objectType: SCHEMAS.note,
      property: "categories",
    },
    projects: "ProjectSchema[]",
  },
};

export const categoryEditableFields = {
  title: "title",
  content: "content",
  color: "color",
};
