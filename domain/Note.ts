import { Category } from "./Category";
import { Milestone } from "./Milestone";
import { Project } from "./Project";

export enum NoteContentType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  DOCUMENT = "document",
  LINK = "link",
}

export interface Note {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  title: string;
  categories: Category[];
  projects: Project[];
  milestones: Milestone[];
  cover?: string;
  description?: string;
  isImportant?: boolean;
  isDone?: boolean;
  isOnTrash?: boolean;
  color?: string;
}
