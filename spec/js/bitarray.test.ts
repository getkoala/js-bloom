import { BA as BitArray } from '../../src/bitarray';

BitArray.prototype.toString = function () {
  let output = '';
  for (
    let i = 0, end = this.size - 1, asc = 0 <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    output += this.get(i);
  }
  return output;
};

describe('BitArray', function () {
  describe('#initialize', function () {
    it('should take an optional bit field', function () {
      const field = [0, 0, 0, 2];
      const ba = new BitArray(100, field);
      expect(ba.field).toBe(field);
    });

    it('should create the right size field', function () {
      const ba = new BitArray(100);
      expect(ba.field.length).toBe(4);
    });
  });

  describe('#add', function () {
    it('should set the bit to 1', function () {
      const ba = new BitArray(10);
      ba.add(9);
      expect(ba.toString()).toBe('0000000001');
    });

    it('should throw an error on out of bound', function () {
      const ba = new BitArray(10);
      ba.add(9);
      expect(function () {
        ba.add(10);
      }).toThrow('BitArray index out of bounds');
    });
  });

  describe('#remove', function () {
    it('should set the bit to 0', function () {
      const ba = new BitArray(10);
      ba.add(9);
      ba.remove(9);
      expect(ba.toString()).toBe('0000000000');
    });

    it('should throw an error on out of bound', function () {
      const ba = new BitArray(10);
      expect(function () {
        ba.remove(10);
      }).toThrow('BitArray index out of bounds');
    });
  });

  describe('#get', function () {
    it('should return the bit set', function () {
      const ba = new BitArray(10);
      ba.add(9);
      expect(ba.get(9)).toBe(1);
      expect(ba.get(8)).toBe(0);
    });

    it('should throw an error on out of bound', function () {
      const ba = new BitArray(10);
      expect(function () {
        ba.get(10);
      }).toThrow('BitArray index out of bounds');
    });
  });

  describe('#toString', function () {
    it('should output the bit string', function () {
      const ba = new BitArray(10);
      ba.add(3);
      ba.add(9);
      expect(ba.toString()).toBe('0001000001');
    });
  });
});
