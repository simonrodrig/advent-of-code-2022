#!/usr/bin/env -S deno run
import { readLines } from 'std/io/mod.ts';
import * as flags from 'std/flags/mod.ts';
import { bgRed, red } from 'std/fmt/colors.ts';

import { sum } from 'utils';

async function part01() {
  let highestCal = 0;
  let currCal = 0;
  for await (let line of readLines(Deno.stdin)) {
    line = line.trim();

    if (line.length == 0) {
      highestCal = Math.max(highestCal, currCal);
      currCal = 0;
    } else {
      currCal += +line;
    }
  }

  if (currCal != 0) {
    highestCal = Math.max(highestCal, currCal);
  }

  console.log('Highest Cal Elf:', highestCal);
}

async function part02() {
  const highestCalElves = [0, 0, 0];
  let currCal = 0;

  const updateThreeHighest = (cal: number) => {
    const min = Math.min(...highestCalElves);
    const idx = highestCalElves.indexOf(min);
    highestCalElves[idx] = Math.max(highestCalElves[idx], cal);
  };

  for await (let line of readLines(Deno.stdin)) {
    line = line.trim();

    if (line.length == 0) {
      updateThreeHighest(currCal);
      currCal = 0;
    } else {
      currCal += +line;
    }
  }

  if (currCal != 0) {
    updateThreeHighest(currCal);
  }

  console.log('Highest Three Elves:', sum(highestCalElves));
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
