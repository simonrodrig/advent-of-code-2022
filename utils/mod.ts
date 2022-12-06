import { readLines } from 'std/io/mod.ts'

export const sum = (nums: number[]) =>
  nums.reduce((acc, curr) => acc + curr, 0);

export const numericSort = (nums: number[]) => nums.sort((a, b) => a - b);

export async function* everyNLines(rl: Deno.Reader, n: number) {
  if (n <= 0)
    throw new Error('Please provide a positive number');

  if (!Number.isInteger(n))
    throw new Error('Please provide an integer');

  let items: string[] = [];
  for await (const line of readLines(rl)) {
    items.push(line);
    if (items.length == n) {
      yield items;
      items = [];
    }
  }

  if (items.length > 0)
    throw new Error(`Some remaining input? ${items.join(', ')}`)
}
