import { AnyRealmObject } from "realm";

const updateMappedField = <T>(
  existingNote: Record<string, T>,
  key: string,
  value: T | undefined
) => {
  if (value !== undefined) {
    existingNote[key] = value;
  }
};

export const mapToUpdatedFields = <T>(
  existingNote: AnyRealmObject,
  updateNote: Partial<any>,
  relatedData: Record<string, any>,
  fieldMappings: Record<string, string>
) => {
  for (const [key, relatedKey] of Object.entries(fieldMappings)) {
    const updateValue = updateNote[key];
    updateMappedField(existingNote, key, updateValue);
  }
};
