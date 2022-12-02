#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
  char *str;
  int score;
} GamePossibility;

enum YourShapes {
  ROCK = 1,
  PAPER = 2,
  SCISSORS = 3,
};

enum Scoring { 
  LOSS = 0,
  DRAW = 3,
  WIN = 6
};

char *chomp(char *in) {
  const int len = strlen(in);
  if (in[len - 1] == '\n')
    in[len - 1] = 0;
  return in;
}

int main() {
  char buf[BUFSIZ];

  GamePossibility possiblities[] = {
    {"A X", SCISSORS + LOSS},
    {"A Y", ROCK + DRAW},
    {"A Z", PAPER + WIN},

    {"B X", ROCK + LOSS},
    {"B Y", PAPER + DRAW},
    {"B Z", SCISSORS + WIN},

    {"C X", PAPER + LOSS},
    {"C Y", SCISSORS + DRAW},
    {"C Z", ROCK + WIN}
  };

  const int numPossibilities = 9;
  int score = 0;

  while (fgets(buf, BUFSIZ, stdin) != NULL) {
    for (int i = 0; i < numPossibilities; i++) {
      if (strcmp(chomp(buf), possiblities[i].str) == 0) {
        score += possiblities[i].score;
        break;
      }
    }
  }

  printf("Score: %d\n", score);

  return EXIT_SUCCESS;
}