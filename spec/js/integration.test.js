import { JSBloom } from "../../js/index";
import fs from "fs/promises";
import { CountMinSketch } from "../../js/count-min-sketch";

describe("Bloom Filter Integration", () => {
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

describe("Count Min Sketch Integration", () => {
  it("can be hydrated from a ruby CMS", async () => {
    const fixture = (
      await fs.readFile("./spec/fixtures/cms.json", "utf8")
    ).toString();

    const serialized = JSON.parse(fixture);
    const cms = new CountMinSketch(serialized);

    expect(cms.count("matt")).toBe(5);
    expect(cms.count("netto")).toBe(1);
    expect(cms.count("bruna")).toBe(1);
  });

  it("can be hydrated from a large ruby bloom", async () => {
    const fixture = (
      await fs.readFile("./spec/fixtures/cms-companies.json", "utf8")
    ).toString();

    const serialized = JSON.parse(fixture);
    const cms = new CountMinSketch(serialized);

    expect(cms.count("Segment")).toBe(1);
    expect(cms.count("Salesforce")).toBe(1);
    expect(cms.count("Makelog")).toBe(1);

    expect(cms.count("Random Co")).toBe(0);
    expect(cms.count("Does not exist")).toBe(0);
    expect(cms.count("404")).toBe(0);
  });
});
