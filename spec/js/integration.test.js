import { JSBloom } from "../../js/index";
import fs from "fs/promises";

describe("Integration", () => {
  it("can be hydrated from a ruby bloom", async () => {
    const fixture = (
      await fs.readFile("./spec/fixtures/bloom.json", "utf8")
    ).toString();

    const serialized = JSON.parse(fixture);
    const bloom = new JSBloom(serialized);

    expect(bloom.test("matt")).toBe(true);
    expect(bloom.test("netto")).toBe(true);
    expect(bloom.test("bruna")).toBe(true);
    expect(bloom.test("tido")).toBe(false);
  });
});
