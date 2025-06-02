import { Category } from "@/domain/Category";
import { AnyRealmObject, Results } from "realm";

export const toCategory = (
  category: (AnyRealmObject & Category) | Category
): Category => ({
  id: category.id,
  title: category.title,
  content: category.content,
  color: category.color,
  updatedAt: category.updatedAt,
  createdAt: category.createdAt,
  notes: [],
  projects: [],
});

export const toCategories = (
  categories: Results<AnyRealmObject> | Category[]
) =>
  categories.map((category) =>
    toCategory(category as AnyRealmObject & Category)
  );
