import { BA } from "./bitarray";
import { crc32 } from "./zlib";

export const JsBloom = function (options = {}) {
  this.options = {
    size: 100,
    hashes: 4,
    seed: new Date().getTime() / 1000,
    bits: null,
  };

  for (let key in options) {
    const value = options[key];
    this.options[key] = value;
  }

  this.bits = new BA(this.options["size"], this.options["bits"]);

  return this;
};

const proto = JsBloom.prototype;

proto.add = function (...keys) {
  for (let key of keys) {
    for (let index of Array.from(this.indexesFor(key))) {
      this.bits.add(index);
    }
  }
};

proto.test = function (...keys) {
  for (let key of keys) {
    for (let index of this.indexesFor(key)) {
      if (this.bits.get(index) === 0) {
        return false;
      }
    }
  }
  return true;
};

proto.toHash = function () {
  const hash = {};
  for (let key in this.options) {
    const value = this.options[key];
    hash[key] = value;
  }
  hash["bits"] = this.bits.field;
  return hash;
};

proto.toJson = function () {
  return JSON.stringify(this.toHash());
};

proto.indexesFor = function (key) {
  const indexes = [];
  for (
    let index = 0, end = this.options["hashes"] - 1, asc = 0 <= end;
    asc ? index <= end : index >= end;
    asc ? index++ : index--
  ) {
    indexes.push(
      crc32(`${key}:${index + this.options["seed"]}`) % this.options["size"]
    );
  }

  return indexes;
};
