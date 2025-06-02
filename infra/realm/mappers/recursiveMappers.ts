import { Note } from "@/domain/Note";
import { Project } from "@/domain/Project";

export const toRecursiveNote = (note: Note): Note => ({
  id: note.id,
  title: note.title,
  updatedAt: note.updatedAt,
  createdAt: note.createdAt,
  description: note.description,
  isImportant: note.isImportant,
  isOnTrash: note.isOnTrash,
  cover: note.cover,
  categories: [],
  milestones: [],
  projects: [],
});

export const toRecursiveNotes = (notes: Note[]): Note[] =>
  notes.map((note) => toRecursiveNote(note));

export const toRecursiveProject = (project: Project): Project => ({
  id: project.id,
  title: project.title,
  updatedAt: project.updatedAt,
  createdAt: project.createdAt,
  description: project.description,
  isImportant: project.isImportant,
  cover: project.cover,
  categories: [],
  notes: [],
  milestones: [],
});

export const toRecursiveProjects = (projects: Project[]): Project[] =>
  projects.map((project) => toRecursiveProject(project));
