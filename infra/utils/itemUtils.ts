import * as FileSystem from "expo-file-system";
import { saveImage } from "./fileSystem/images";

export const buildId = () => `${Date.now()}-${Math.random()}`;
export const buildIdAndDate = <T>(item: T) => ({
  ...item,
  id: buildId(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const saveItemImage = async <T>(item: T & { imageUri?: string }) => {
  if (item.imageUri) {
    const savedImageUri = await saveImage(item.imageUri);
    item.imageUri = savedImageUri ?? item.imageUri;
  }
  return item;
};

export const updateItemImage = async <T>(item: T & { imageUri?: string }) => {
  if (
    item.imageUri &&
    !item.imageUri.startsWith(`${FileSystem.documentDirectory}images/`)
  ) {
    const savedImageUri = await saveImage(item.imageUri);
    item.imageUri = savedImageUri ?? item.imageUri;
  }
  return item;
};

export const saveItemRecord = async <T>(
  item: T & { recordingUri?: string }
) => {
  if (item.recordingUri) {
    const savedRecordingUri = await saveImage(item.recordingUri);
    item.recordingUri = savedRecordingUri ?? item.recordingUri;
  }
  return item;
};

export const updateItemRecord = async <T>(
  item: T & { recordingUri?: string }
) => {
  if (
    item.recordingUri &&
    !item.recordingUri.startsWith(`${FileSystem.documentDirectory}images/`)
  ) {
    const savedRecordingUri = await saveImage(item.recordingUri);
    item.recordingUri = savedRecordingUri ?? item.recordingUri;
  }
  return item;
};
