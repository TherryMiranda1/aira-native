import { Note } from "@/domain/Note";
import {
  createOrUpdateCategory,
  createOrUpdateMilestone,
  createOrUpdateNote,
  createOrUpdateProject,
} from "./relationsHelpers";
import { Project } from "@/domain/Project";

export const updateNoteRelations = (data: Partial<Note>) => {
  return {
    categories: data.categories?.map(createOrUpdateCategory),
    projects: data.projects?.map(createOrUpdateProject),
    milestones: data.milestones?.map(createOrUpdateMilestone),
  };
};

export const updateProjectRelations = (data: Project) => {
  return {
    categories: data.categories?.map(createOrUpdateCategory),
    notes: data.notes?.map(createOrUpdateNote),
    milestones: data.milestones?.map(createOrUpdateMilestone),
  };
};
