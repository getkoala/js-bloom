import { BitArray } from "./bitarray";
import { crc32 } from "./zlib";

export const JsonBloomfilter = function (options) {
  if (options == null) {
    options = {};
  }
  this.options = {
    size: 100,
    hashes: 4,
    seed: new Date().getTime() / 1000,
    bits: null,
  };

  const items = delete options["items"];
  for (let key in options) {
    const value = options[key];
    this.options[key] = value;
  }
  this.bits = new BitArray(this.options["size"], this.options["bits"]);
  if (items) {
    this.add(items);
  }
  return this;
};

JsonBloomfilter.build = function (capacity_or_items, error_rate) {
  const capacity = JsonBloomfilter.capacity_for(capacity_or_items);
  const items = JsonBloomfilter.items_for(capacity_or_items);
  if (capacity <= 0) {
    throw new Error("Capacity needs to be a positive integer");
  }
  return new JsonBloomfilter({
    size: JsonBloomfilter.size_for(capacity, error_rate),
    hashes: JsonBloomfilter.hashes_for(capacity, error_rate),
    items,
  });
};

JsonBloomfilter.capacity_for = function (capacity_or_items) {
  if (capacity_or_items instanceof Array) {
    return capacity_or_items.length;
  } else {
    return capacity_or_items;
  }
};

JsonBloomfilter.items_for = function (capacity_or_items) {
  if (capacity_or_items instanceof Array) {
    return capacity_or_items;
  } else {
    return null;
  }
};

JsonBloomfilter.size_for = (capacity, error_rate) =>
  Math.ceil(
    (capacity * Math.log(error_rate)) / Math.log(1.0 / Math.pow(2, Math.log(2)))
  );

JsonBloomfilter.hashes_for = function (capacity, error_rate) {
  return Math.round(
    (Math.log(2) * this.size_for(capacity, error_rate)) / capacity
  );
};

JsonBloomfilter.prototype.add = function (keys) {
  for (let key of Array.from([].concat(keys))) {
    for (let index of Array.from(this.indexesFor(key))) {
      this.bits.add(index);
    }
  }
};

JsonBloomfilter.prototype.test = function (keys) {
  for (let key of Array.from([].concat(keys))) {
    for (let index of Array.from(this.indexesFor(key))) {
      if (this.bits.get(index) === 0) {
        return false;
      }
    }
  }
  return true;
};

JsonBloomfilter.prototype.clear = function () {
  this.bits = new BitArray(this.options["size"]);
};

JsonBloomfilter.prototype.toHash = function () {
  const hash = {};
  for (let key in this.options) {
    const value = this.options[key];
    hash[key] = value;
  }
  hash["bits"] = this.bits.field;
  return hash;
};

JsonBloomfilter.prototype.toJson = function () {
  return JSON.stringify(this.toHash());
};

JsonBloomfilter.prototype.indexesFor = function (key) {
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
