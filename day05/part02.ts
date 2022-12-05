import { Interface } from 'readline';
import { rl } from '../utils';

async function extractCrates(input: Interface) {
  const lines: string[] = [];
  let crates: string[][] = [];

  // regexes
  const indexPattern = /(\s*\d\s*)+/;
  const cratePattern = /\[[A-Z]\]/;

  // Store all the lines, we'll be going in reverse order
  for await (let line of input) {
    // The line that tells us how many crates there are
    if (indexPattern.test(line)) {
      crates = new Array<string[]>(+(line.trim().at(-1) as string));
    }

    // Acts as a separator between each phase
    else if (line.length == 0) {
      break;
    }

    // Otherwise just push the lines to our array
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

async function processMoves(input: Interface, crates: string[][]) {
  // regexes
  const movePattern = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/;

  for await (let line of input) {
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

      buffer.push(extactedCrate);
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
