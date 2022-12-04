import readline from 'readline';

export const sum = (nums: number[]) =>
  nums.reduce((acc, curr) => acc + curr, 0);

export const numericSort = (nums: number[]) => nums.sort((a, b) => a - b);

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '',
  terminal: false,
});

export async function* everyNLines(rl: readline.Interface, n: number) {
  if (n <= 0)
    throw new Error('Please provide a positive number');

  if (!Number.isInteger(n))
    throw new Error('Please provide an integer');

  let items: string[] = [];
  for await (const line of rl) {
    items.push(line);
    if (items.length == n) {
      yield items;
      items = [];
    }
  }

  if (items.length > 0)
    throw new Error(`Some remaining input? ${items.join(', ')}`)
}
