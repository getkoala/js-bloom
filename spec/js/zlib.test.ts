import { crc32 } from '../../src/zlib';

describe('JsBloom.Zlib', function () {
  describe('#crc32', function () {
    it('should hash the input correctly', function () {
      expect(crc32('foobar')).toBe(2666930069);
      expect(crc32('Magna Pellentesque Egestas Nibh Ultricies')).toBe(
        1920919084
      );
    });
  });
});
