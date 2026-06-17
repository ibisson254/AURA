import * as Crypto from "expo-crypto";

// UUID v4 gerado no device. E o nome do ficheiro E (futuro) id da linha no Supabase.
export function newPhotoId(): string {
  return Crypto.randomUUID();
}

// Funcao PURA (testavel sem device): monta o nome do ficheiro a partir do id.
export function photoFileName(id: string): string {
  return `${id}.jpg`;
}
