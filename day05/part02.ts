import readline from 'readline';
import { rl } from '../utils';

async function extractCrates(input: readline.Interface): Promise<string[][]> {
  const lines: string[] = [];
  let crates: string[][] = [];
  const indexPattern = /(\s*\d\s*)+/;

  // Store all the lines, we'll be going in reverse order
  for await (let line of rl) {
    // We don't really need this line, so throw it away
    if (indexPattern.test(line)) {
      crates = new Array<string[]>(+(line.trim().at(-1) as string));
    } else if (line.length == 0) {
      break;
    } else {
      lines.push(line);
    }
  }

  for (let i = 0; i < crates.length; i++) {
    crates[i] = [];
  }

  // console.log(lines);

  const charSliceAmt = (count: number) => count * 4;

  for (const line of lines.reverse()) {
    // console.log('line:', line);
    for (
      let sliceCount = 0;
      charSliceAmt(sliceCount) < line.length;
      sliceCount++
    ) {
      // Obtain a 3-character slice of the line
      const slice = line.slice(
        charSliceAmt(sliceCount),
        charSliceAmt(sliceCount) + 3
      );

      // console.log('slice:', slice);

      // Test if the slice is in the [A] format
      if (/\[[A-Z]\]/.test(slice)) {
        // console.log('sliceCount', sliceCount)
        crates[sliceCount].push(slice[1]);
      }
    }
  }

  console.log('crates:', crates);
  return crates;
}

async function processMoves(
  input: readline.Interface,
  crates: string[][]
): Promise<string[][]> {
  const movePattern = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/;

  for await (let line of rl) {
    line = line.trim();

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

      buffer.push(extactedCrate)
    }
    crates[+endCrate - 1].push(...buffer.reverse());
  }

  return crates;
}

async function main() {
  let crates = await extractCrates(rl);
  crates = await processMoves(rl, crates);

  const topOfEach = crates.map(c => c.at(-1)).join('');
  console.log('After processing crates:', topOfEach);
}

if (require.main === module) {
  main();
}
