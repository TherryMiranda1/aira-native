import { Note } from "./Note";

export interface Milestone {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    notes: Note[];
    description?: string;
    dueAt?: Date;
    cover?: string;
  }