const ELEMENT_WIDTH = 32;

export class BA {
  constructor(private size: number, public field?: number[] | null) {
    this.size = size;
    this.field = field || [];

    const arrayLength = Math.floor((size - 1) / ELEMENT_WIDTH + 1);
    if (!field) {
      for (
        let i = 0, end = arrayLength - 1, asc = 0 <= end;
        asc ? i <= end : i >= end;
        asc ? i++ : i--
      ) {
        this.field[i] = 0;
      }
    }
  }

  add(position: number) {
    return this.set(position, 1);
  }

  remove(position: number) {
    return this.set(position, 0);
  }

  set(position: number, value: number) {
    if (position >= this.size) {
      throw new Error('BitArray index out of bounds');
    }
    const aPos = arrayPosition(position);
    const bChange = bitChange(position);
    if (value === 1) {
      this.field[aPos] = abs(this.field[aPos] | bChange);
    } else if ((this.field[aPos] & bChange) !== 0) {
      this.field[aPos] = abs(this.field[aPos] ^ bChange);
    }
    return true;
  }

  get(position: number) {
    if (position >= this.size) {
      throw new Error('BitArray index out of bounds');
    }
    const aPos = arrayPosition(position);
    const bChange = bitChange(position);
    if (abs(this.field[aPos] & bChange) > 0) {
      return 1;
    } else {
      return 0;
    }
  }
}

function arrayPosition(position: number) {
  return Math.floor(position / ELEMENT_WIDTH);
}

function bitChange(position: number) {
  return abs(1 << position % ELEMENT_WIDTH);
}

function abs(val: number) {
  if (val < 0) {
    val += 4294967295;
  }
  return val;
}
