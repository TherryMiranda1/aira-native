import { Note } from "@/domain/Note";
import { buildIdAndDate } from "../../utils/itemUtils";
import { SCHEMAS } from "@/infra/realm/constants/schemas";
import { useNotesContext } from "@/context/NotesContext";
import { toNoteDetail, toNotes } from "../mappers/toNotes";
import { updateNoteRelations } from "@/infra/utils/updateNoteRelations";
import { mapToUpdatedFields } from "@/infra/utils/mapToUpdatedFields";
import { noteEditableFields } from "../schemas/Notes";

import { realm } from "@/infra/realm/controller";

export const useRealmNotes = () => {
  const { setNotes } = useNotesContext();

  const getNotes = () => {
    const notes = realm.objects<Note>(SCHEMAS.note);

    const newNotes = toNotes(notes as any);
    setNotes(newNotes);
    return newNotes;
  };

  const addNote = (data: Partial<Note>) => {
    realm.write(() => {
      const { categories, projects, milestones } = updateNoteRelations(data);

      realm.create(SCHEMAS.note, {
        ...buildIdAndDate(data),
        categories,
        projects,
        milestones,
      });
    });

    return getNotes();
  };

  const editNote = async (updateNote: Partial<Note>) => {
    realm.write(() => {
      let existingNote = realm.objectForPrimaryKey<Note>(
        SCHEMAS.note,
        updateNote.id
      );

      if (!existingNote) {
        throw new Error(`No se encontró la nota con id ${updateNote.id}`);
      }

      const relatedData = updateNoteRelations(updateNote);

      existingNote.updatedAt = new Date();
      mapToUpdatedFields<Note>(
        existingNote,
        updateNote,
        relatedData,
        noteEditableFields
      );

      relatedData.milestones &&
        (existingNote.milestones = relatedData.milestones);
      relatedData.categories &&
        (existingNote.categories = relatedData.categories);
    });

    return getNotes();
  };

  const removeNote = (noteId: string) => {
    realm.write(() => {
      const note = realm.objectForPrimaryKey(SCHEMAS.note, noteId);
      if (note) {
        realm.delete(note);
      }
    });
    return getNotes();
  };

  const getNote = (noteId: string) => {
    const note = realm.objectForPrimaryKey<Note>(SCHEMAS.note, noteId);

    if (!note) {
      console.log(`No se encontró la nota con id ${noteId}`);
      return;
    }
    return toNoteDetail(note);
  };

  const toggleField = (id: string, field: keyof Note, value: boolean) => {
    realm.write(() => {
      const note = realm.objectForPrimaryKey<Note>(SCHEMAS.note, id);
      if (note) {
        note[field] = value as never;
      }
    });
    return getNotes();
  };

  return {
    getNotes,
    addNote,
    editNote,
    removeNote,
    getNote,
    toggleField,
  };
};
