import { rl } from '../utils';

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

async function main() {
  let count = 0;

  for await (const pair of rl) {
    const [p1, p2] = pair
      .trim()
      .split(',')
      .map(pair => range(pair));

    if (hasOverlap(p1, p2)) count++;
  }

  console.log('Total Overlaps:', count);
}

if (require.main === module) {
  main();
}
