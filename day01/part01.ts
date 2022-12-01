import { rl, sum } from '../utils';

async function main() {
  const elves: number[][] = [];
  let elf: number[] = [];

  for await (let line of rl) {
    line = line.trim();

    if (line !== '') {
      elf.push(+line);
    } else {
      console.log('elf', elf);
      elves.push(elf);
      elf = [];
    }
  }

  if (elf.length > 0) elves.push(elf);

  const highestCalElf = Math.max(...elves.map((e) => sum(e)));

  console.log('Highest Calories:', highestCalElf);
}

if (require.main === module) {
  main();
}
