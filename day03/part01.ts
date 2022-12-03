import { rl, sum } from '../utils';

async function* findDupeItems(rucksack: string) {
  const compartOne = rucksack
    .slice(0, Math.floor(rucksack.length / 2))
    .split('');

  const compartTwo = rucksack
    .slice(Math.floor(rucksack.length / 2), rucksack.length)
    .split('');

  const compartOneMap = {};
  for (const item of compartOne) {
    // @ts-ignore
    compartOneMap[item] = 1;
  }

  for (const item of compartTwo) {
    //@ts-ignore
    if (item in compartOneMap && compartOneMap[item] == 1) {
      yield item;
      //@ts-ignore
      compartOneMap[item] += 1;
    }
  }
  
}

function findPriority(item: string): number {
  const ascii = item.charCodeAt(0);

  // Lowercase a to lowercase z
  if (97 <= ascii && ascii <= 122) {
    return ascii - 96;
  } else {
    return ascii - 64 + 26;
  }
}

async function main() {
  let pSum = 0;
  for await (let line of rl) {
    line = line.trim();

    for await (const dupe of findDupeItems(line)) {
      const p = findPriority(dupe);
      console.log(dupe, p);
      pSum += p;
    }
  }

  console.log('Priority Sum:', pSum);
}

if (require.main === module) {
  main();
}
