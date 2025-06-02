import React, { createContext, JSX, useContext, useState } from "react";

import { Note } from "@/domain/Note";

import { Project } from "@/domain/Project";
import { Category } from "@/domain/Category";
import { DEFAULT_TAGS } from "@/constants/Tags";

interface Props {
  children: JSX.Element | JSX.Element[];
}

interface NotesReturnType {
  notes: Note[];
  projects: Project[];
  searchQuery: string;
  mediaFileQuery: string;
  currentTag: Category;
  setCurrentTag: React.Dispatch<React.SetStateAction<Category>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setMediaFileQuery: React.Dispatch<React.SetStateAction<string>>;
}

const NotesContext = createContext<NotesReturnType>({} as NotesReturnType);

export const useNotesContext = () => useContext(NotesContext);

export const NotesContainer = ({ children }: Props) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFileQuery, setMediaFileQuery] = useState("");
  const [currentTag, setCurrentTag] = useState(DEFAULT_TAGS[0]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        projects,
        searchQuery,
        mediaFileQuery,
        currentTag,
        setNotes,
        setProjects,
        setSearchQuery,
        setMediaFileQuery,
        setCurrentTag,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
