import { rl } from '../utils';

function pairEclipses(
  p1Min: number,
  p1Max: number,
  p2Min: number,
  p2Max: number
): boolean {
  // p2 fully contained in p1
  if (p2Min >= p1Min && p2Max <= p1Max) return true;

  // p1 fully contained in p2
  if (p1Min >= p2Min && p1Max <= p2Max) return true;

  return false;
}

async function main() {
  let count = 0;

  for await (const pair of rl) {
    const [p1, p2] = pair.trim().split(',');
    const [p1Min, p1Max] = p1.split('-');
    const [p2Min, p2Max] = p2.split('-');

    if (pairEclipses(+p1Min, +p1Max, +p2Min, +p2Max)) count++;
  }

  console.log('Total Overlaps:', count);
}

if (require.main === module) {
  main();
}
