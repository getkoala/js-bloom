import { CountMinSketch } from "../../js/count-min-sketch/index";

describe(CountMinSketch, () => {
  it("counts occurrences", () => {
    const cms = new CountMinSketch();
    cms.add("netto");
    cms.add("netto");
    cms.add("matt");

    expect(cms.count("netto")).toBe(2);
    expect(cms.count("matt")).toBe(1);
    expect(cms.count("tido")).toBe(0);
  });

  it("supports setting the counts ahead of time", () => {
    const cms = new CountMinSketch();

    cms.add("netto", 32);
    cms.add("matt");

    expect(cms.count("netto")).toBe(32);
    expect(cms.count("matt")).toBe(1);
    expect(cms.count("tido")).toBe(0);
  });

  it("can serialize and deserialize data structures", async () => {
    const cms = new CountMinSketch();
    cms.add("netto", 32);
    cms.add("matt");

    const fromJSON = new CountMinSketch(JSON.parse(cms.toJSON()));
    expect(fromJSON.count("netto")).toBe(32);
    expect(fromJSON.count("matt")).toBe(1);
    expect(fromJSON.count("tido")).toBe(0);
  });
});
