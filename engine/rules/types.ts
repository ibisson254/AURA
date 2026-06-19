// Contrato mínimo de conselho produzido por uma regra do motor.
// Sem taxonomia de veredito: uma regra convida, não julga.
export interface Advice {
  /** Id estável do conselho, ex.: "browning.low". */
  id: string;
  /** Métrica que disparou o conselho, ex.: "browning". */
  metric: string;
  /** Ação única, imperativa, sem jargão. A mais forte primeiro. */
  message: string;
  /** Força do conselho; maior = mais forte. Ordena várias regras. */
  priority: number;
  /** Link opcional para card de técnica embarcado (inexistente no MVP). */
  cardId?: string;
}
