import { Category } from "@/domain/Category";

const DEFAULT_TAGS_DATE = new Date("2022-01-01T00:00:00.000Z");

export const DEFAULT_TAGS: Category[] = [
  {
    id: "DEFAULT_TAGS_1",
    title: "All",
    color: "blue",
    createdAt: DEFAULT_TAGS_DATE,
    updatedAt: DEFAULT_TAGS_DATE,
    projects: [],
    notes: [],
  },
  {
    id: "DEFAULT_TAGS_2",
    title: "Important",
    color: "blue",
    createdAt: DEFAULT_TAGS_DATE,
    updatedAt: DEFAULT_TAGS_DATE,
    projects: [],
    notes: [],
  },
  {
    id: "DEFAULT_TAGS_3",
    title: "🎞️",
    color: "blue",
    createdAt: DEFAULT_TAGS_DATE,
    updatedAt: DEFAULT_TAGS_DATE,
    projects: [],
    notes: [],
  },
];
