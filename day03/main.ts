#!/usr/bin/env -S deno run
import { readLines } from 'std/io/buffer.ts';
import * as flags from 'std/flags/mod.ts';
import { bgRed, red } from 'std/fmt/colors.ts';

import { everyNLines } from 'utils';

function findPriority(item: string): number {
  const ascii = item.charCodeAt(0);

  // Lowercase a to lowercase z
  if (97 <= ascii && ascii <= 122) {
    return ascii - 96;
  } else {
    return ascii - 64 + 26;
  }
}

/* Part 01 Only */
async function* findDupeItems(rucksack: string) {
  const compartOne = rucksack
    .slice(0, Math.floor(rucksack.length / 2))
    .split('');

  const compartTwo = rucksack
    .slice(Math.floor(rucksack.length / 2), rucksack.length)
    .split('');

  const compartOneMap: { [char: string]: number } = {};
  for (const item of compartOne) {
    compartOneMap[item] = 1;
  }

  for (const item of compartTwo) {
    if (item in compartOneMap && compartOneMap[item] == 1) {
      yield item;
      compartOneMap[item] += 1;
    }
  }
}

/* Part 02 Only */
function itemThatAppearsInAll(items: string[]): string {
  const freqMap: { [char: string]: number } = {}; // 0b001 0b010 0b100

  for (const [idx, item] of items.entries()) {
    const flag = 1 << idx;

    for (const char of item) {
      if (!(char in freqMap)) {
        freqMap[char] = 0;
      }

      freqMap[char] |= flag;
    }
  }

  for (const char in freqMap) {
    if (freqMap[char] == 0b111) {
      return char;
    }
  }

  throw new Error('not found');
}

async function part01() {
  let pSum = 0;
  for await (let line of readLines(Deno.stdin)) {
    line = line.trim();

    for await (const dupe of findDupeItems(line)) {
      const p = findPriority(dupe);
      console.log(dupe, p);
      pSum += p;
    }
  }

  console.log('Priority Sum:', pSum);
}

async function part02() {
  let badgeSum = 0;
  for await (const rucksack of everyNLines(Deno.stdin, 3)) {
    const badge = itemThatAppearsInAll(rucksack);
    badgeSum += findPriority(badge);
  }

  console.log('Badge Sum:', badgeSum);
}

if (import.meta.main) {
  const f = flags.parse(Deno.args);
  if (f.part == 1) {
    part01();
  } else if (f.part == 2) {
    part02();
  } else {
    console.error(bgRed('ERROR'), red('No part specified'));
    Deno.exit(1);
  }
}
