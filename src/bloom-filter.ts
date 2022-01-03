import { BA } from './bitarray';
import { crc32 } from './zlib';

export interface JsBloomOptions {
  size: number;
  hashes: number;
  seed?: number;
  bits?: null | number[];
}

export class JsBloom {
  private bits: BA;

  constructor(private options: Partial<JsBloomOptions> = {}) {
    this.options = {
      size: 100,
      hashes: 4,
      seed: new Date().getTime() / 1000,
      bits: null,
      ...options,
    };

    this.bits = new BA(this.options['size'], this.options['bits']);
  }

  add(...keys: string[]) {
    for (let key of keys) {
      for (let index of Array.from(this.indexesFor(key))) {
        this.bits.add(index);
      }
    }
  }

  test(...keys: string[]) {
    for (let key of keys) {
      for (let index of this.indexesFor(key)) {
        if (this.bits.get(index) === 0) {
          return false;
        }
      }
    }
    return true;
  }

  toHash(): JsBloomOptions {
    return {
      size: this.options['size'],
      hashes: this.options['hashes'],
      seed: this.options['seed'],
      bits: this.bits.field,
    };
  }

  toJson() {
    return JSON.stringify(this.toHash());
  }

  indexesFor(key: string) {
    const indexes: number[] = [];
    for (
      let index = 0, end = this.options['hashes'] - 1, asc = 0 <= end;
      asc ? index <= end : index >= end;
      asc ? index++ : index--
    ) {
      indexes.push(
        crc32(`${key}:${index + this.options['seed']}`) % this.options['size']
      );
    }

    return indexes;
  }
}
