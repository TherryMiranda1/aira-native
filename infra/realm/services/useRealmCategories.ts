import { Category } from "@/domain/Category";

import { realm } from "@/infra/realm/controller";
import { toCategories, toCategory } from "@/infra/realm/mappers/toCategory";

import { Project } from "@/domain/Project";
import { Note } from "@/domain/Note";
import { useCategoriesContext } from "@/context/CategoriesContext";
import { SCHEMAS } from "@/infra/realm/constants/schemas";
import { buildIdAndDate } from "../../utils/itemUtils";
import { mapToUpdatedFields } from "@/infra/utils/mapToUpdatedFields";
import { createOrUpdateCategory } from "@/infra/utils/relationsHelpers";
import { categoryEditableFields } from "../schemas/Categories";

export const useRealmCategories = () => {
  const { setCategories } = useCategoriesContext();

  const getCategories = () => {
    const categories = realm.objects<Category>(SCHEMAS.category);

    const newCategories = toCategories(categories as any);
    setCategories(newCategories);
    return newCategories;
  };

  const addCategory = (data: Partial<Category>) => {
    realm.write(() => {
      realm.create(SCHEMAS.category, buildIdAndDate(data));
    });

    return getCategories();
  };

  const editCategory = async (updateCategory: Partial<Category>) => {
    realm.write(() => {
      let existingCategory = realm.objectForPrimaryKey<Category>(
        SCHEMAS.category,
        updateCategory.id
      );

      if (!existingCategory) {
        throw new Error(`No se encontró la nota con id ${updateCategory.id}`);
      }

      existingCategory.updatedAt = new Date();
      mapToUpdatedFields<Category>(
        existingCategory,
        updateCategory,
        {},
        categoryEditableFields
      );
    });

    return getCategories();
  };

  const removeCategory = (categoryId: string) => {
    realm.write(() => {
      const category = realm.objectForPrimaryKey(SCHEMAS.category, categoryId);
      if (category) {
        realm.delete(category);
      }
    });
    return getCategories();
  };

  const getCategory = (categoryId: string) => {
    const category = realm.objectForPrimaryKey<Category>(
      SCHEMAS.category,
      categoryId
    );

    if (!category) {
      console.log(`No se encontró la nota con id ${categoryId}`);
      return;
    }
    return toCategory(category);
  };

  const toggleField = (id: string, field: keyof Category, value: boolean) => {
    realm.write(() => {
      const category = realm.objectForPrimaryKey<Category>(
        SCHEMAS.category,
        id
      );
      if (category) {
        category[field] = value as never;
      }
    });
    return getCategories();
  };

  return {
    getCategories,
    addCategory,
    editCategory,
    removeCategory,
    getCategory,
    toggleField,
  };
};

const getCategories = () => {
  const categories = realm.objects<Category>(SCHEMAS.category);

  return toCategories(categories as any);
};

export const updateItemCategories = (
  noteId: string,
  categories: Category[],
  schema: string
) => {
  realm.write(() => {
    let existingItem = realm.objectForPrimaryKey<Note | Project>(
      schema,
      noteId
    );

    if (!existingItem) {
      throw new Error(`No se encontró la nota con id ${noteId}`);
    }
    const newCategories = categories.map(createOrUpdateCategory);
    existingItem.categories = newCategories;
  });
};

export const getItemCategories = (itemId: string, shema: string) => {
  const item = realm.objectForPrimaryKey<Note | Project>(shema, itemId);
  if (!item) {
    throw new Error(`No se encontró la nota con id ${itemId}`);
  }
  return item?.categories;
};

const addCategory = (data: Partial<Category>) => {
  realm.write(() => {
    realm.create(SCHEMAS.category, buildIdAndDate(data));
  });
};

export const realmCategoriesUtils = {
  addCategory,
  getCategories,
  updateItemCategories,
  getItemCategories,
};
