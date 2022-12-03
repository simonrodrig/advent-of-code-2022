import { rl, everyNLines } from '../utils';

function itemThatAppearsInAll(items: string[]): string {
  const freqMap = {}; // 0b001 0b010 0b100

  for (const [idx, item] of items.entries()) {
    const flag = 1 << idx;

    for (const char of item) {
      if (!(char in freqMap)) {
        //@ts-ignore
        freqMap[char] = 0;
      }

      //@ts-ignorew
      freqMap[char] |= flag;
    }
  }

  for (const char in freqMap) {
    //@ts-ignore
    if (freqMap[char] == 0b111) {
      return char;
    }
  }

  throw new Error('not found');
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
  let badgeSum = 0;
  for await (let rucksack of everyNLines(rl, 3)) {
    const badge = itemThatAppearsInAll(rucksack);
    badgeSum += findPriority(badge);
  }

  console.log('Badge Sum:', badgeSum);
}

if (require.main === module) {
  main();
}
