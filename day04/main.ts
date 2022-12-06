#!/usr/bin/env -S deno run
import { readLines } from 'std/io/buffer.ts';
import * as flags from 'std/flags/mod.ts';
import { bgRed, red } from 'std/fmt/colors.ts';

/* Part 01 Only */
function pairEclipses(
  p1Min: number,
  p1Max: number,
  p2Min: number,
  p2Max: number,
): boolean {
  // p2 fully contained in p1
  if (p2Min >= p1Min && p2Max <= p1Max) {
    return true;
  }

  // p1 fully contained in p2
  if (p1Min >= p2Min && p1Max <= p2Max) {
    return true;
  }

  return false;
}

/* Part 02 Only */

/**
 * Returns the number array representation of a range string, formatted "a-b"
 */
function range(rangeStr: string): number[] {
  const [min, max] = rangeStr.split('-');

  const range: number[] = [];
  for (let i = +min; i <= +max; i++) range.push(i);

  return range;
}

function hasOverlap(range1: number[], range2: number[]): boolean {
  const s = new Set(range1);

  for (const time of range2) {
    if (s.has(time)) return true;
  }

  return false;
}

async function part01() {
  let count = 0;

  for await (const pair of readLines(Deno.stdin)) {
    const [p1, p2] = pair.trim().split(',');
    const [p1Min, p1Max] = p1.split('-');
    const [p2Min, p2Max] = p2.split('-');

    if (pairEclipses(+p1Min, +p1Max, +p2Min, +p2Max)) {
      count++;
    }
  }

  console.log('Total Overlaps:', count);
}

async function part02() {
  let count = 0;

  for await (const pair of readLines(Deno.stdin)) {
    const [p1, p2] = pair
      .trim()
      .split(',')
      .map((pair) => range(pair));

    if (hasOverlap(p1, p2)) {
      count++;
    }
  }

  console.log('Total Overlaps:', count);
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
