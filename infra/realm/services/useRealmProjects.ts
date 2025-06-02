import { realm } from "@/infra/realm/controller";
import { Project } from "@/domain/Project";
import { SCHEMAS } from "@/infra/realm/constants/schemas";
import { useNotesContext } from "@/context/NotesContext";

import { mapToUpdatedFields } from "@/infra/utils/mapToUpdatedFields";
import { buildIdAndDate } from "../../utils/itemUtils";
import { updateProjectRelations } from "@/infra/utils/updateNoteRelations";
import { toProject, toProjects } from "../mappers/toProjects";
import { projectEditableFields } from "../schemas/Projects";

export const useRealmProjects = () => {
  const { setProjects } = useNotesContext();

  const getProjects = () => {
    const projects = realm.objects<Project>(SCHEMAS.project);

    const newProjects = toProjects(projects);
    setProjects(newProjects);
    return newProjects;
  };

  const addProject = (data: Partial<Project>) => {
    realm.write(() => {
      realm.create(SCHEMAS.project, {
        ...buildIdAndDate(data),
      });
    });

    return getProjects();
  };

  const editProject = async (updateProject: Project) => {
    realm.write(() => {
      let existingProject = realm.objectForPrimaryKey<Project>(
        SCHEMAS.project,
        updateProject.id
      );

      if (!existingProject) {
        throw new Error(`No se encontró la nota con id ${updateProject.id}`);
      }
      const relatedData = updateProjectRelations(updateProject);

      existingProject.updatedAt = new Date();
      mapToUpdatedFields<Project>(
        existingProject,
        updateProject,
        relatedData,
        projectEditableFields
      );
      relatedData.milestones &&
        (existingProject.milestones = relatedData.milestones);
      relatedData.notes && (existingProject.notes = relatedData.notes);
    });

    return getProjects();
  };

  const removeProject = (id: string) => {
    realm.write(() => {
      const project = realm.objectForPrimaryKey(SCHEMAS.project, id);
      if (project) {
        realm.delete(project);
      }
    });
    return getProjects();
  };

  const getProject = (id: string) => {
    const project = realm.objectForPrimaryKey<Project>(SCHEMAS.project, id);

    if (!project) {
      console.log(`No se encontró la nota con id ${id}`);
      return;
    }

    return toProject(project);
  };
  const toggleField = (id: string, field: keyof Project, value: boolean) => {
    realm.write(() => {
      const note = realm.objectForPrimaryKey<Project>(SCHEMAS.note, id);
      if (note) {
        note[field] = value as never;
      }
    });
    return getProjects();
  };

  return {
    getProjects,
    addProject,
    editProject,
    removeProject,
    getProject,
    toggleField,
  };
};
