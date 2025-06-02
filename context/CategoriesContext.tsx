import React, { createContext, JSX, useContext, useState } from "react";

import { Category } from "@/domain/Category";

interface Props {
  children: JSX.Element | JSX.Element[];
}

interface CategoriesReturnType {
  categories: Category[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const CategoriesContext = createContext<CategoriesReturnType>(
  {} as CategoriesReturnType
);

export const useCategoriesContext = () => useContext(CategoriesContext);

export const CategoriesContainer = ({ children }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
