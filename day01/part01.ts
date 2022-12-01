import readline from 'readline';

const sum = (nums: number[]) => nums.reduce((acc, curr) => acc + curr, 0);

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '',
    terminal: false
  });

  const elves: number[][] = [];
  let elf: number[] = [];

  for await (let line of rl) {
    line = line.trim();

    if (line !== '') {
      elf.push(+line);
    } else {
      console.log('elf', elf)
      elves.push(elf);
      elf = [];
    }
  }

  if (elf.length > 0)
    elves.push(elf);

  const highestCalElf = Math.max(...elves.map(e => sum(e)));

  console.log('Highest Calories:', highestCalElf);
}

if (require.main === module) {
  main();
}
