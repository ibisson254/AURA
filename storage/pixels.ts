import * as FileSystem from "expo-file-system";
import { decode } from "jpeg-js";
import { thumbUri } from "./photos";

export type RgbaPixels = { data: Uint8Array; width: number; height: number };

// Le a thumbnail do filesystem e descodifica o JPEG em pixels RGBA.
// Vive no storage/ (toca em ficheiros). O engine/ recebe so o resultado.
export async function readThumbnailPixels(id: string): Promise<RgbaPixels> {
  const file = new FileSystem.File(thumbUri(id));
  const bytes = await file.bytes();                 // Uint8Array do JPEG comprimido
  const raw = decode(bytes, { useTArray: true });
  return { data: raw.data, width: raw.width, height: raw.height };
}
