import { readLines } from 'std/io/mod.ts';
import { bgBlack } from 'std/fmt/colors.ts';
type ColorFunction = typeof bgBlack;

export const sum = (nums: number[]) =>
  nums.reduce((acc, curr) => acc + curr, 0);

export const numericSort = (nums: number[]) => nums.sort((a, b) => a - b);

export async function* everyNLines(rl: Deno.Reader, n: number) {
  if (n <= 0) {
    throw new Error('Please provide a positive number');
  }

  if (!Number.isInteger(n)) {
    throw new Error('Please provide an integer');
  }

  let items: string[] = [];
  for await (const line of readLines(rl)) {
    items.push(line);
    if (items.length == n) {
      yield items;
      items = [];
    }
  }

  if (items.length > 0) {
    throw new Error(`Some remaining input? ${items.join(', ')}`);
  }
}

export const coloredSlice = (
  str: string,
  startIdx: number,
  endIdx: number,
  color: ColorFunction,
) =>
  str.slice(0, startIdx) +
  color(str.slice(startIdx, endIdx)) +
  str.slice(endIdx, str.length);

/**
 * Port of Python's DefaultDict. Ends up being useful in a lot of situations
 * involving trees.
 * 
 * The ergonomics of this class are fairly similar to something like useState
 * from React land, though this utilizes key-value pairs.
 * 
 * Example:
 * > const ddict = new DefaultDict<number, number>(() => 0);
 * undefined
 * > ddict.get(0);
 * 0
 * > ddict.update(0, (curr) => curr - 5);
 * -5
 */
export class DefaultDict<T1, T2> {
  private constructorFn: () => T2;
  private internalMap = new Map<T1, T2>();

  constructor(constructorFn: () => T2) {
    this.constructorFn = constructorFn;
  }

  get(key: T1): T2 {
    const possibleVal = this.internalMap.get(key);

    if (possibleVal) {
      return possibleVal;
    } else {
      return this.set(key, this.constructorFn());
    }
  }

  set(key: T1, val: T2) {
    this.internalMap.set(key, val);
    return val;
  }

  update(key: T1, updateFn: ((currVal: T2) => T2) | undefined ) {
    const val = this.get(key);
    if (updateFn !== undefined)
      return this.set(key, updateFn(val));
    else
      return this.set(key, val);
  }
}
