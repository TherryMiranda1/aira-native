import { Note } from "./Note";
import { Project } from "./Project";

export type Category = {
  id: string;
  title: string;
  content?: string;
  color?: string;
  projects: Project[];
  notes: Note[];
  updatedAt: Date;
  createdAt: Date;
};
