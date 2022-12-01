import readline from 'readline';

export const sum = (nums: number[]) =>
  nums.reduce((acc, curr) => acc + curr, 0);

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '',
  terminal: false,
});
