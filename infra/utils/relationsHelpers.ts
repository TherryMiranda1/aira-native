import { Milestone } from "@/domain/Milestone";
import { Project } from "@/domain/Project";
import { Category } from "@/domain/Category";
import { Note } from "@/domain/Note";
import { AnyRealmObject } from "realm";
import { realm } from "../realm/controller";
import { buildIdAndDate } from "./itemUtils";

export const createOrUpdateNote = (note: Partial<Note>) => {
  let existingNote = realm.objectForPrimaryKey<Note>("NoteSchema", note.id);

  if (!existingNote) {
    existingNote = realm.create<Note>(
      "NoteSchema",
      buildIdAndDate(note) as AnyRealmObject & Note
    );
  }

  return existingNote;
};

export const createOrUpdateCategory = (category: Partial<Category>) => {
  let existingCategory = realm.objectForPrimaryKey<Category>(
    "CategorySchema",
    category.id
  );

  if (!existingCategory) {
    existingCategory = realm.create<Category>(
      "CategorySchema",
      buildIdAndDate(category) as AnyRealmObject & Category
    );
  }
  return existingCategory || category;
};

export const createOrUpdateProject = (project: Partial<Project>) => {
  let existingProject = realm.objectForPrimaryKey<Project>(
    "ProjectSchema",
    project.id
  );

  if (!existingProject) {
    existingProject = realm.create<Project>(
      "ProjectSchema",
      buildIdAndDate(project) as AnyRealmObject & Project
    );
  }

  return existingProject;
};

export const createOrUpdateMilestone = (milestone: Partial<Milestone>) => {
  let existingMilestone = realm.objectForPrimaryKey<Milestone>(
    "MilestoneSchema",
    milestone.id
  );

  if (!existingMilestone) {
    existingMilestone = realm.create<Milestone>(
      "MilestoneSchema",
      buildIdAndDate(milestone) as AnyRealmObject & Milestone
    );
  }

  return existingMilestone;
};
