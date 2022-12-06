#!/usr/bin/env -S deno run
import { readLines } from "std/io/buffer.ts";
import * as flags from 'std/flags/mod.ts';
import { red, bgRed } from "std/fmt/colors.ts";

enum YourShapes {
  ROCK = 1,
  PAPER = 2,
  SCISSORS = 3,
}

enum Scoring {
  LOSS = 0,
  DRAW = 3,
  WIN = 6,
}

async function main(outcomes: {[id: string]: number}) {
  /**
   * Scoring Rules:
   * Score = (shape_you_picked) + (outcome)
   */

  let score = 0;
  for await (let line of readLines(Deno.stdin)) {
    line = line.trim();

    if (line in outcomes) {
      //@ts-ignore -- sigh
      score += outcomes[line];
    } else {
      throw new SyntaxError(`Encountered unexpected line: ${line}`);
    }
  }

  console.log('score:', score);
}

if (import.meta.main) {

  // Since there are only 9 possibilities, we can just hardcode these.
  const part01Outcomes = {
    'A X': YourShapes.ROCK + Scoring.DRAW,
    'A Y': YourShapes.PAPER + Scoring.WIN,
    'A Z': YourShapes.SCISSORS + Scoring.LOSS,

    'B X': YourShapes.ROCK + Scoring.LOSS,
    'B Y': YourShapes.PAPER + Scoring.DRAW,
    'B Z': YourShapes.SCISSORS + Scoring.WIN,

    'C X': YourShapes.ROCK + Scoring.WIN,
    'C Y': YourShapes.PAPER + Scoring.LOSS,
    'C Z': YourShapes.SCISSORS + Scoring.DRAW,
  }

  const part02Outcomes = {
    'A X': YourShapes.SCISSORS + Scoring.LOSS,
    'A Y': YourShapes.ROCK + Scoring.DRAW,
    'A Z': YourShapes.PAPER + Scoring.WIN,

    'B X': YourShapes.ROCK + Scoring.LOSS,
    'B Y': YourShapes.PAPER + Scoring.DRAW,
    'B Z': YourShapes.SCISSORS + Scoring.WIN,

    'C X': YourShapes.PAPER + Scoring.LOSS,
    'C Y': YourShapes.SCISSORS + Scoring.DRAW,
    'C Z': YourShapes.ROCK + Scoring.WIN,
  };

  const f = flags.parse(Deno.args);
  if (f.part == 1) {
    main(part01Outcomes);
  } else if (f.part == 2) {
    main(part02Outcomes);
  } else {
    console.error(bgRed('ERROR'), red('No part specified'));
    Deno.exit(1);
  }
}