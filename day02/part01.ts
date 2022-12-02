import { rl } from '../utils';

enum YourShapes {
  X = 1, // Rock
  Y = 2, // Paper
  Z = 3, // Scissors
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
    'A X': YourShapes.X + Scoring.DRAW,
    'A Y': YourShapes.Y + Scoring.WIN,
    'A Z': YourShapes.Z + Scoring.LOSS,

    'B X': YourShapes.X + Scoring.LOSS,
    'B Y': YourShapes.Y + Scoring.DRAW,
    'B Z': YourShapes.Z + Scoring.WIN,

    'C X': YourShapes.X + Scoring.WIN,
    'C Y': YourShapes.Y + Scoring.LOSS,
    'C Z': YourShapes.Z + Scoring.DRAW,
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
