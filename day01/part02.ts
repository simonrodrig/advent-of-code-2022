import { rl, sum, numericSort } from '../utils';

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

  const elfSums = numericSort(elves.map((e) => sum(e)));

  console.log('all elves:', elfSums);

  console.log('sum of highest three: ', sum(elfSums.slice(-3)));
}

if (require.main === module) {
  main();
}
