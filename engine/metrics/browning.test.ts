import { browningFraction, Rgba } from "./browning";

// Helper: cria N pixels RGBA todos da mesma cor.
function solid(r: number, g: number, b: number, n = 100): Rgba {
  const data = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = 255;
  }
  return { data, width: n, height: 1 };
}

test("dourado puro -> fracao ~1", () => {
  // RGB ~ (205,160,60) cai na faixa dourada em HSV.
  expect(browningFraction(solid(205, 160, 60))).toBeGreaterThan(0.9);
});

test("azul -> fracao ~0", () => {
  expect(browningFraction(solid(40, 90, 200))).toBeLessThan(0.1);
});

test("metade dourado / metade azul -> ~0.5", () => {
  const a = solid(205, 160, 60, 50);
  const b = solid(40, 90, 200, 50);
  const data = new Uint8Array(a.data.length + b.data.length);
  data.set(a.data, 0); data.set(b.data, a.data.length);
  const f = browningFraction({ data, width: 100, height: 1 });
  expect(f).toBeGreaterThan(0.4); expect(f).toBeLessThan(0.6);
});

test("vazio -> 0", () => {
  expect(browningFraction({ data: new Uint8Array(0), width: 0, height: 0 })).toBe(0);
});
