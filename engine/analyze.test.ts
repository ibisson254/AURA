import { analyze } from "./analyze";
import type { Rgba } from "./metrics/browning";

// Helper local: imagem sólida de uma cor (n pixels). O solid() do teste da
// métrica não é exportado (A0.4), por isso definimos o nosso.
function solid(r: number, g: number, b: number, n = 100): Rgba {
  const data = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    data[i * 4] = r;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = 255;
  }
  return { data, width: n, height: 1 };
}

test("prato dourado -> sem conselhos (regra cala-se)", () => {
  expect(analyze(solid(205, 160, 60))).toEqual([]);
});

test("sem cor quente -> conselho de sub-douramento", () => {
  const advice = analyze(solid(40, 90, 200));
  expect(advice).toHaveLength(1);
  expect(advice[0].id).toBe("browning.low");
  expect(advice[0].metric).toBe("browning");
});

test("imagem vazia -> conselho de sub-douramento", () => {
  const advice = analyze({ data: new Uint8Array(0), width: 0, height: 0 });
  expect(advice).toHaveLength(1);
  expect(advice[0].id).toBe("browning.low");
});

test("retorno é sempre um array (nunca null)", () => {
  expect(Array.isArray(analyze(solid(205, 160, 60)))).toBe(true);
});
