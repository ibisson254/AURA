import { Directory, Paths, File } from "expo-file-system";
import { photoFileName } from "./ids";

const photosDir = new Directory(Paths.document, "photos");

function ensureDir() {
  if (!photosDir.exists) {
    photosDir.create({ intermediates: true, idempotent: true });
  }
}

// Move/copia uma foto (uri temporaria da camara) para o filesystem permanente.
export async function savePhoto(tempUri: string, id: string): Promise<string> {
  ensureDir();
  const destFile = new File(photosDir, photoFileName(id));
  const srcFile = new File(tempUri);
  srcFile.copy(destFile);
  return destFile.uri;
}

export function photoUri(id: string): string {
  const file = new File(photosDir, photoFileName(id));
  return file.uri;
}

export function thumbUri(id: string): string {
  const file = new File(photosDir, photoFileName(id).replace(".jpg", ".thumb.jpg"));
  return file.uri;
}

export async function saveThumbnail(tempUri: string, id: string): Promise<string> {
  ensureDir();
  const destFile = new File(photosDir, photoFileName(id).replace(".jpg", ".thumb.jpg"));
  const srcFile = new File(tempUri);
  srcFile.copy(destFile);
  return destFile.uri;
}
