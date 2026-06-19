import { photoFileName } from "./ids";

test("photoFileName monta nome a partir do id", () => {
  expect(photoFileName("abc-123")).toBe("abc-123.jpg");
});
