import * as FileSystem from "expo-file-system";

const IMAGE_DIR = `${FileSystem.documentDirectory}images/`;

export const saveImage = async (uri: string): Promise<string | null> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
    }

    const fileName = uri.split("/").pop();
    const newPath = `${IMAGE_DIR}${fileName}`;

    await FileSystem.copyAsync({
      from: uri,
      to: newPath,
    });

    return newPath;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
};

export const deleteFile = async (uri: string): Promise<void> => {
  try {
    await FileSystem.deleteAsync(uri);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
