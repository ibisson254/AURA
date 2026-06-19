import type { Advice } from "./rules/types";
import { browningFraction, type Rgba } from "./metrics/browning";
import { browningRule } from "./rules/browning";

/**
 * Composição pura do motor: pixels -> conselhos.
 * Corre cada métrica + regra e devolve os conselhos não-nulos, ordenados
 * por força (a mais forte primeiro). Sem I/O, sem estado.
 */
export function analyze(px: Rgba): Advice[] {
  const advice: Advice[] = [];

  const browning = browningRule(browningFraction(px));
  if (browning) advice.push(browning);

  return advice.sort((a, b) => b.priority - a.priority);
}
