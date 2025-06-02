export const updateField = <T>(field: T, updateValue: T | undefined): T => {
  return updateValue !== undefined ? updateValue : field;
};
