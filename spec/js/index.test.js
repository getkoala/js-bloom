import { JSBloom as JsBloom } from "../../js/index";

describe("JsBloom", function () {
  describe("#initialize", function () {
    it("should take the appropriate options", function () {
      const seed = new Date().getTime() / 1000 - 24 * 60 * 60;
      const bf = new JsBloom({ size: 200, hashes: 10, seed: seed });
      expect(bf.toHash()["size"]).toBe(200);
      expect(bf.toHash()["hashes"]).toBe(10);
      expect(bf.toHash()["seed"]).toBe(seed);
    });

    it("should be initializable with a field serialized by another bloom filter", function () {
      const bf1 = new JsBloom();
      bf1.add("foo");
      const bf2 = new JsBloom(bf1.toHash());
      expect(bf2.test("foo")).toBe(true);
    });

    it("should initialize the field with the right size", function () {
      const bf = new JsBloom({ size: 100 });
      expect(bf.toHash()["bits"].length).toBe(4);
    });
  });

  describe("with an instance", function () {
    let bf;

    beforeEach(function () {
      bf = new JsBloom();
      bf.add("foobar");
    });

    describe("#add, #test", function () {
      it("should add a key", function () {
        expect(bf.test("foo")).toBe(false);
        bf.add("foo");
        expect(bf.test("foo")).toBe(true);
      });

      it("should be able to add and test more than one key at a time", function () {
        expect(bf.test("foo")).toBe(false);
        expect(bf.test("bar")).toBe(false);
        bf.add(["foo", "bar"]);
        expect(bf.test(["foo", "bar"])).toBe(true);
      });

      it("should not change anything if added twice", function () {
        expect(bf.test("foobar")).toBe(true);
        const bits = bf.toHash()["bits"];
        bf.add("foobar");
        expect(bf.test("foobar")).toBe(true);
      });
    });

    describe("#toHash", function () {
      it("should return the serialisable hash", function () {
        const hash = bf.toHash();
        expect(hash instanceof Object).toBe(true);
        expect(hash["seed"]).not.toBeUndefined();
        expect(hash["hashes"]).not.toBeUndefined();
        expect(hash["size"]).not.toBeUndefined();
        expect(hash["bits"]).not.toBeUndefined();
      });
    });

    describe("#toJson", function () {
      it("should return the hash serialised", function () {
        expect(bf.toJson()).toBe(JSON.stringify(bf.toHash()));
      });
    });
  });
});
