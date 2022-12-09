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

function computeTreesThatCanBeSeen(treeRow: number[], currTree: number) {
  let numTreesThatCanBeSeen = 0;

  for (const tree of treeRow) {
    numTreesThatCanBeSeen++;

    if (tree >= currTree) {
      break;
    }
  }

  return numTreesThatCanBeSeen;
}

function computeHighestScenicScore(trees: number[][]): number {
  let highestScore = 0;

  for (let i = 0; i < trees.length; i++) {
    const currRow = trees[i];
    for (let j = 0; j < currRow.length; j++) {
      // Check Left
      const leftSlice = currRow.slice(0, j);
      const leftScore = computeTreesThatCanBeSeen(
        leftSlice.reverse(),
        trees[i][j],
      );

      // Check Right
      const rightSlice = currRow.slice(j + 1, currRow.length);
      const rightScore = computeTreesThatCanBeSeen(rightSlice, trees[i][j]);

      const currCol = get2DArrayColumn(trees, j);

      // Check Above
      const topSlice = currCol.slice(0, i);
      const topScore = computeTreesThatCanBeSeen(
        topSlice.reverse(),
        trees[i][j],
      );

      // Check Below
      const bottomSlice = currCol.slice(i + 1, currCol.length);
      const bottomScore = computeTreesThatCanBeSeen(bottomSlice, trees[i][j]);

      // Update the highest
      highestScore = Math.max(
        highestScore,
        leftScore * rightScore * topScore * bottomScore,
      );
    }
  }

  return highestScore;
}

async function main(part: 1 | 2) {
  const trees: number[][] = [];
  for await (const line of readLines(Deno.stdin)) {
    trees.push(line.split('').map((tree) => +tree));
  }

  if (part == 1) {
    console.log('Visible Trees:', countVisibleTrees(trees));
  } else {
    const highestScore = computeHighestScenicScore(trees);
    console.log('Highest Scenic Score:', highestScore);
  }
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
