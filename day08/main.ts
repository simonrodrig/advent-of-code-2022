#!/usr/bin/env -S deno run
import { readLines } from 'std/io/buffer.ts';
import * as flags from 'std/flags/mod.ts';
import { bgRed, red } from 'std/fmt/colors.ts';

function get2DArrayColumn<T>(arr: T[][], desiredCol: number) {
  return arr.map((row) => row[desiredCol]);
}

function countVisibleTrees(trees: number[][]) {
  let count = 0;

  for (let i = 0; i < trees.length; i++) {
    const currRow = trees[i];
    for (let j = 0; j < trees[i].length; j++) {
      const currCol = get2DArrayColumn(trees, j);

      // Check Left
      if (currRow.slice(0, j).every((tree) => tree < trees[i][j])) {
        count++;
      } // Check Right
      else if (
        currRow.slice(j + 1, currRow.length).every((tree) => tree < trees[i][j])
      ) {
        count++;
      } // Check Above
      else if (currCol.slice(0, i).every((tree) => tree < trees[i][j])) {
        count++;
      } // Check Below
      else if (
        currCol.slice(i + 1, currCol.length).every((tree) => tree < trees[i][j])
      ) {
        count++;
      }
    }
  }

  return count;
}

async function main() {
  const trees: number[][] = [];
  for await (const line of readLines(Deno.stdin)) {
    trees.push(line.split('').map((tree) => +tree));
  }

  console.log('Visible Trees:', countVisibleTrees(trees));
}

if (import.meta.main) {
  const f = flags.parse(Deno.args);
  if (f.part == 1) {
    main();
  } else if (f.part == 2) {
    main();
  } else {
    console.error(bgRed('ERROR'), red('No part specified'));
    Deno.exit(1);
  }
}
