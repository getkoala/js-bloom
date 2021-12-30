import { crc32 } from "../zlib";

interface CountMinSketchOptions {
  size: number;
  hashes: number;
  data?: number[][];
  seeds?: number[];
}

const MAX_FIXNUM = Number.MAX_SAFE_INTEGER - 1;

function createData(k: number, m: number): Uint32Array[] {
  const data = new Array(k);
  for (let i = 0; i < k; i++) {
    data[i] = new Uint32Array(m);
  }
  return data;
}

function convertData(data: number[][]): Uint32Array[] {
  return data.map((k) => Uint32Array.from(k));
}

function toArray(data: Uint32Array[]): number[][] {
  return data.map((k) => Array.from(k));
}

function seeds(k: number): number[] {
  const seeds = new Array(k);
  for (let i = 0; i < k; i++) {
    seeds[i] = Math.random() * (MAX_FIXNUM + 1);
  }
  return seeds;
}

const DEFAULTS: Partial<CountMinSketchOptions> = {
  size: 100,
  hashes: 4,
};
export class CountMinSketch {
  private options: CountMinSketchOptions;
  private k: number;
  private m: number;
  private data: Uint32Array[];
  private seeds: number[];

  constructor(options: Partial<CountMinSketchOptions> = {}) {
    this.options = Object.assign(
      {},
      DEFAULTS,
      options
    ) as CountMinSketchOptions;

    this.k = this.options.hashes;
    this.m = this.options.size;
    this.data = this.options.data
      ? convertData(this.options.data)
      : createData(this.k, this.m);

    this.seeds = this.options.seeds || seeds(this.k);
  }

  count(item: string): number {
    return this.add(item, 0);
  }

  add(item: string, n: number = 1): number {
    let minCount = Infinity;

    this.seeds.forEach((seed, i) => {
      const hash = crc32(`${item}:${seed + i}`);

      const j = hash % this.m;
      const cnt = (this.data[i][j] += n);

      if (cnt < minCount) {
        minCount = cnt;
      }
    });

    return minCount;
  }

  setCount(item: string, n: number) {
    this.add(item, n - this.count(item));
  }

  toHash(): object {
    return Object.assign({}, this.options, {
      data: toArray(this.data),
      seeds: this.seeds,
    });
  }

  toJSON(): string {
    return JSON.stringify(this.toHash());
  }
}
