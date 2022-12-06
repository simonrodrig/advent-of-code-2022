#!/usr/bin/env -S deno run
import { readLines } from 'std/io/mod.ts';
import * as flags from 'std/flags/mod.ts';
import { bgGreen, bgRed, red } from 'std/fmt/colors.ts';
import { coloredSlice } from 'utils';

async function main(numUniqueChars: number) {
  for await (const line of readLines(Deno.stdin)) {
    const seen = new Set<string>();

    for (const [idx, char] of [...line].entries()) {
      /**
       * I'm abusing the fact that JS sets generally have ordered insertion.
       * probably not the best idea in the world though. If we were using a queue
       * instead, i'd probably just pop front a bunch.
       */
      while (seen.has(char)) {
        seen.delete([...seen][0]);
      }
      seen.add(char);

      // We found our slice!
      if (seen.size == numUniqueChars) {
        console.log(
          `${
            coloredSlice(line, idx - numUniqueChars + 1, idx + 1, bgGreen)
          } | Marker found after ${idx + 1} chars`,
        );
        break;
      }
    }
  }
}

if (import.meta.main) {
  const f = flags.parse(Deno.args);
  if (f.part == 1) {
    main(4);
  } else if (f.part == 2) {
    main(14);
  } else {
    console.error(bgRed('ERROR'), red('No part specified'));
    Deno.exit(1);
  }
}
