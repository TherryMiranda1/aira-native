import { Project } from "@/domain/Project";
import { Results, AnyRealmObject } from "realm";
import { toCategories } from "./toCategory";
import { toRecursiveNotes } from "./recursiveMappers";

export const toProject = (
  project: (AnyRealmObject & Project) | Project
): Project => ({
  id: project.id,
  title: project.title,
  updatedAt: project.updatedAt,
  createdAt: project.createdAt,
  description: project.description,
  isImportant: project.isImportant,
  color: project.color,
  cover: project.cover,
  categories: toCategories(project.categories),
  notes: toRecursiveNotes(project.notes),
  milestones: project.milestones,
});

export const toProjects = (
  projects: Results<AnyRealmObject & Project>
): Project[] => projects.map((project) => toProject(project));
