import { Note } from "@/domain/Note";
import { toCategories } from "./toCategory";
import { Results, AnyRealmObject } from "realm";
import { toRecursiveProjects } from "./recursiveMappers";

export const toNote = (note: (AnyRealmObject & Note) | Note): Note => ({
  id: note.id,
  title: note.title,
  description: note.description,
  updatedAt: note.updatedAt,
  createdAt: note.createdAt,
  isImportant: note.isImportant,
  isOnTrash: note.isOnTrash,
  isDone: note.isDone,
  color: note.color,
  milestones: note.milestones,
  cover: note.cover,
  categories: toCategories(note.categories),
  projects: toRecursiveProjects(note.projects),
});

export const toNoteDetail = (note: (AnyRealmObject & Note) | Note): Note => ({
  ...toNote(note),
});

export const toNotes = (notes: Results<AnyRealmObject> | Note[]): Note[] =>
  notes.map((note) => toNote(note as AnyRealmObject & Note));
