import { readThumbnailPixels } from "./pixels";
import { analyze } from "../engine/analyze";
import { browningFraction } from "../engine/metrics/browning";
import type { Advice } from "../engine/rules/types";

export type PhotoAnalysis = { fraction: number; advice: Advice[] };

// Orquestra: id de foto -> pixels da thumbnail -> analise.
// fraction e readout de dev/calibracao. advice vem do motor.
// I/O vive aqui — storage pode importar o engine; o engine nunca importa storage.
export async function analyzePhoto(id: string): Promise<PhotoAnalysis> {
  const px = await readThumbnailPixels(id);
  const fraction = browningFraction(px);
  const advice = analyze(px);
  return { fraction, advice };
}
