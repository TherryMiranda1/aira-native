import { Category } from "./Category";
import { Milestone } from "./Milestone";
import { Note } from "./Note";

export interface Project {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  categories: Category[];
  milestones: Milestone[];
  description?: string;
  cover?: string;
  isImportant?: boolean;
  notes: Note[];
  color?: string;
}
