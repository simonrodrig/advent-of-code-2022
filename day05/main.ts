#!/usr/bin/env -S deno run
import { readLines } from 'std/io/mod.ts';
import * as flags from 'std/flags/mod.ts';
import { bgRed, red } from 'std/fmt/colors.ts';

async function extractCrates(input: string) {
  const lines: string[] = [];
  let crates: string[][] = [];

  // regexes
  const indexPattern = /(\s*\d\s*)+/;
  const cratePattern = /\[[A-Z]\]/;

  // Store all the lines, we'll be going in reverse order
  for await (const line of input.split('\n')) {
    // The line that tells us how many crates there are
    if (indexPattern.test(line)) {
      crates = new Array<string[]>(+(line.trim().at(-1) as string));
    } // Acts as a separator between each phase
    else if (line.length == 0) {
      break;
    } // Otherwise just push the lines to our array
    else {
      lines.push(line);
    }
  }

  // Initialize the crate arrays ourselves (blegh)
  for (let i = 0; i < crates.length; i++) {
    crates[i] = [];
  }

  // Helper function to give us useful slices
  const charSliceAmt = (count: number) => count * 4;

  for (const line of lines.reverse()) {
    // Iterate through every slice
    for (let count = 0; charSliceAmt(count) < line.length; count++) {
      // Obtain a 3-character slice of the line
      const slice = line.slice(charSliceAmt(count), charSliceAmt(count) + 3);

      // Test if the slice is in the [A] format
      if (cratePattern.test(slice)) {
        crates[count].push(slice[1]);
      }
    }
  }

  console.log('crates:', crates);
  return crates;
}

async function processMoves(input: string, crates: string[][]) {
  // regexes
  const movePattern = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/;

  for await (const line of input.split('\n')) {
    if (line.length == 0) {
      continue;
    }

    // Search for the regex pattern in the string
    const matchArr = line.match(movePattern);

    // Didn't find any matches
    if (matchArr === null) {
      throw new Error(`Line doesn't match pattern: ${line}`);
    }

    // Extract the values
    const [_, amtToMove, startCrate, endCrate, ...__] = matchArr;
    console.log(line, '|', +amtToMove, +startCrate, +endCrate);

    // Do the move
    for (let _ = 0; _ < +amtToMove; _++) {
      const extactedCrate = crates[+startCrate - 1].pop();

      if (!extactedCrate) {
        throw new Error(
          `Could not extract a crate from pos ${startCrate} (index ${
            +startCrate - 1
          })`,
        );
      }

      crates[+endCrate - 1].push(extactedCrate);
    }
  }

  return crates;
}

async function processMovesBuffered(input: string, crates: string[][]) {
  // regexes
  const movePattern = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/;

  for await (const line of input.split('\n')) {
    if (line.length == 0) {
      continue;
    }

    // Search for the regex pattern in the string
    const matchArr = line.match(movePattern);

    // Didn't find any matches
    if (matchArr === null)
      throw new Error(`Line doesn't match pattern: ${line}`);

    // Extract the values
    const [_, amtToMove, startCrate, endCrate, ...__] = matchArr;
    console.log(line, '|', +amtToMove, +startCrate, +endCrate);

    // Do the move
    const buffer = [];
    for (let _ = 0; _ < +amtToMove; _++) {
      const extactedCrate = crates[+startCrate - 1].pop();

      if (!extactedCrate)
        throw new Error(
          `Could not extract a crate from pos ${startCrate} (index ${
            +startCrate - 1
          })`
        );

      buffer.push(extactedCrate);
    }
    crates[+endCrate - 1].push(...buffer.reverse());
  }

  return crates;
}

async function main(part: 1 | 2) {

  const asyncItToStr = async <T>(i: AsyncIterable<T>) => {
    const arr = [];
    for await (const e of i)
      arr.push(e)
    return arr.join('\n');
  }
  const [input1, input2] = (await asyncItToStr(readLines(Deno.stdin))).split('\n\n');

  let crates = await extractCrates(input1);
  if (part === 1) {
    crates = await processMoves(input2, crates);
  } else {
    crates = await processMovesBuffered(input2, crates);
  }

  const topOfEach = crates.map((c) => c.at(-1)).join('');
  console.log('After processing crates:', topOfEach);
}

if (import.meta.main) {
  const f = flags.parse(Deno.args);
  if (f.part == 1) {
    main(1);
  } else if (f.part == 2) {
    main(2);
  } else {
    console.error(bgRed('ERROR'), red('No part specified'));
    Deno.exit(1);
  }
}
