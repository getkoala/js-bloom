import { JSBloom } from "../../js/index";
import fs from "fs/promises";

describe("Integration", () => {
  it("simple", () => {
    const simple = new JSBloom({
      size: 100,
      hashes: 4,
      seed: 1,
      bits: [69373984, 1536, 68683776, 0],
    });

    expect(simple.test("matt")).toBe(true);
    expect(simple.test("netto")).toBe(true);
    expect(simple.test("bruna")).toBe(true);
    expect(simple.test("tido")).toBe(false);
  });

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
    expect(bloom.test("rando")).toBe(false);
    expect(bloom.test("no")).toBe(false);
    expect(bloom.test("404")).toBe(false);
  });

  it("can be hydrated from a large ruby bloom", async () => {
    const fixture = (
      await fs.readFile("./spec/fixtures/bloom-companies.json", "utf8")
    ).toString();

    const serialized = JSON.parse(fixture);
    const bloom = new JSBloom(serialized);

    expect(bloom.test("Segment")).toBe(true);
    expect(bloom.test("Salesforce")).toBe(true);
    expect(bloom.test("Makelog")).toBe(true);

    expect(bloom.test("Random Co")).toBe(false);
    expect(bloom.test("Does not exist")).toBe(false);
    expect(bloom.test("404")).toBe(false);
  });
});
