export function BA(size: number, field = null) {
  if (!size) {
    throw new Error("Missing argument: size");
  }

  this.ELEMENT_WIDTH = 32;
  this.size = size;
  this.field = field || [];

  const arrayLength = Math.floor((size - 1) / this.ELEMENT_WIDTH + 1);
  if (!field) {
    for (
      let i = 0, end = arrayLength - 1, asc = 0 <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      this.field[i] = 0;
    }
  }

  return this;
}

BA.prototype.add = function (position) {
  return this.set(position, 1);
};

BA.prototype.remove = function (position) {
  return this.set(position, 0);
};

BA.prototype.set = function (position, value) {
  if (position >= this.size) {
    throw new Error("BitArray index out of bounds");
  }
  const aPos = this.arrayPosition(position);
  const bChange = this.bitChange(position);
  if (value === 1) {
    this.field[aPos] = this.abs(this.field[aPos] | bChange);
  } else if ((this.field[aPos] & bChange) !== 0) {
    this.field[aPos] = this.abs(this.field[aPos] ^ bChange);
  }
  return true;
};

BA.prototype.get = function (position) {
  if (position >= this.size) {
    throw new Error("BitArray index out of bounds");
  }
  const aPos = this.arrayPosition(position);
  const bChange = this.bitChange(position);
  if (this.abs(this.field[aPos] & bChange) > 0) {
    return 1;
  } else {
    return 0;
  }
};

BA.prototype.arrayPosition = function (position) {
  return Math.floor(position / this.ELEMENT_WIDTH);
};

BA.prototype.bitChange = function (position) {
  return this.abs(1 << position % this.ELEMENT_WIDTH);
};

BA.prototype.abs = function (val) {
  if (val < 0) {
    val += 4294967295;
  }
  return val;
};

BA.prototype.toString = function () {
  let output = "";
  for (
    let i = 0, end = this.size - 1, asc = 0 <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    output += this.get(i);
  }
  return output;
};
