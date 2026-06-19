// Metrica PURA. Recebe pixels RGBA e devolve a fracao 0..1 de area "dourada/tostada".
// Nao conhece ficheiros, UI nem nuvem. Testavel em memoria.
export type Rgba = { data: Uint8Array | number[]; width: number; height: number };

// Converte um pixel RGB (0..255) para HSV. h em graus 0..360, s e v em 0..1.
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

// Um pixel e "dourado/tostado" se cai na faixa de matiz amarelo-laranja com
// saturacao e brilho suficientes. Limiares iniciais conservadores.
function isGolden(h: number, s: number, v: number): boolean {
  return h >= 25 && h <= 55 && s >= 0.30 && v >= 0.35;
}

// Devolve a fracao 0..1 de pixels dourados. Ignora o canal alpha.
export function browningFraction(px: Rgba): number {
  const { data } = px;
  const n = Math.floor(data.length / 4);
  if (n === 0) return 0;
  let golden = 0;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const [h, s, v] = rgbToHsv(data[o], data[o + 1], data[o + 2]);
    if (isGolden(h, s, v)) golden++;
  }
  return golden / n;
}
