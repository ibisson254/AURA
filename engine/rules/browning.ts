import type { Advice } from "./types";

/**
 * Limiar PROVISÓRIO de sub-douramento (fração 0..1 da métrica de douramento).
 * Enviesado para o silêncio: só dispara quando a cor quente é quase nula.
 * NOTA: calibrado contra fixtures sintéticos (solids), NÃO contra fotos reais.
 * Recalibrar com fotos do device quando o portefólio tiver pratos reais.
 */
export const UNDER_BROWNING_THRESHOLD = 0.10;

/**
 * Primeira regra do motor. Lê a fração de douramento (0..1) e decide se tem
 * algo a dizer. Função pura: sem I/O, sem estado.
 * Abaixo do limiar -> conselho de sub-douramento; caso contrário, cala-se.
 */
export function browningRule(fraction: number): Advice | null {
  if (fraction < UNDER_BROWNING_THRESHOLD) {
    return {
      id: "browning.low",
      metric: "browning",
      message:
        "Pouca cor quente no prato. Se o ingrediente pedir, leva o douramento mais longe — ganha contraste e apetite.",
      priority: 1,
    };
  }
  return null;
}
