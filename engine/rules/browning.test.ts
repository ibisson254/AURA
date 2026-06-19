import { browningRule, UNDER_BROWNING_THRESHOLD } from "./browning";

test("sem cor quente (0) -> dispara conselho de sub-douramento", () => {
  const advice = browningRule(0);
  expect(advice).not.toBeNull();
  expect(advice?.id).toBe("browning.low");
  expect(advice?.metric).toBe("browning");
});

test("logo abaixo do limiar -> dispara", () => {
  expect(browningRule(UNDER_BROWNING_THRESHOLD - 0.01)).not.toBeNull();
});

test("exatamente no limiar -> cala-se (null)", () => {
  expect(browningRule(UNDER_BROWNING_THRESHOLD)).toBeNull();
});

test("acima do limiar -> cala-se (null)", () => {
  expect(browningRule(UNDER_BROWNING_THRESHOLD + 0.01)).toBeNull();
});

test("totalmente dourado (1) -> cala-se (null)", () => {
  expect(browningRule(1)).toBeNull();
});
