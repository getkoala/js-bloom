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
    toHash(): object;
    toJSON(): string;
  }
}
declare module "js-bloom" {
  export { CountMinSketch } from "count-min-sketch/index";
}
