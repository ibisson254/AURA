import * as FileSystem from "expo-file-system/legacy";
import { photoFileName } from "./ids";

const DIR = FileSystem.documentDirectory + "photos/";

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
}

// Move/copia uma foto (uri temporaria da camara) para o filesystem permanente.
export async function savePhoto(tempUri: string, id: string): Promise<string> {
  await ensureDir();
  const dest = DIR + photoFileName(id);
  await FileSystem.copyAsync({ from: tempUri, to: dest });
  return dest;
}

export function photoUri(id: string): string {
  return DIR + photoFileName(id);
}

export async function saveThumbnail(tempUri: string, id: string): Promise<string> {
  await ensureDir();
  const dest = photoUri(id).replace(".jpg", ".thumb.jpg");
  await FileSystem.copyAsync({ from: tempUri, to: dest });
  return dest;
}
