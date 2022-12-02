import { rl } from '../utils';

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

async function main() {
  /**
   * Scoring Rules:
   * Score = (shape_you_picked) + (outcome)
   */

  // Since there are only 9 possibilities, we can just hardcode these.
  const possibleOutcomes = {
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

  let score = 0;
  for await (let line of rl) {
    line = line.trim();

    if (line in possibleOutcomes) {
      //@ts-ignore -- sigh
      score += possibleOutcomes[line];
    } else {
      throw new SyntaxError(`Encountered unexpected line: ${line}`);
    }
  }

  console.log('score:', score);
}

if (require.main === module) {
  main();
}
