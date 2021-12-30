declare module "count-min-sketch/index" {
  interface CountMinSketchOptions {
    size: number;
    hashes: number;
    data?: number[][];
    seeds?: number[];
  }
  export class CountMinSketch {
    private options;
    private k;
    private m;
    private data;
    private seeds;
    constructor(options?: Partial<CountMinSketchOptions>);
    count(item: string): number;
    add(item: string, n?: number): number;
    setCount(intem: string, n: number): number;
    toHash(): object;
    toJSON(): string;
  }
}

declare module "js-bloom/index" {
  interface JsBloomOptions {
    size: number;
    hashes: number;
    seed?: number;
    bits?: null | number[];
  }
  export class JsBloom {
    constructor(options?: Partial<JsBloomOptions>);
    add(...item: string[]): void;
    test(...item: string[]): boolean;
    toHash(): object;
    toJSON(): string;
  }
}
declare module "js-bloom" {
  export { CountMinSketch } from "count-min-sketch/index";
  export { JsBloom } from "js-bloom/index";
}
