#!/usr/bin/env -S deno run
import { readLines } from 'std/io/buffer.ts';
import * as flags from 'std/flags/mod.ts';
import { bgRed, red } from 'std/fmt/colors.ts';

type Command = {
  name: string;
  arg?: string;
  output: string[];
};

type File = number;
type FileTree = { [name: string]: File | FileTree };

async function* parseCommands() {
  const commands: { [id: number]: Command } = {};
  let commandIdx = 0;

  for await (const line of readLines(Deno.stdin)) {
    const c = commands[commandIdx];
    if (line.startsWith('$ ')) {
      if (c) {
        yield c;
      }

      commandIdx++;
      // Init the next command
      const [name, arg] = line.replace('$ ', '').split(' ');
      commands[commandIdx] = { name, arg, output: [] };
    } else {
      if (!c) {
        throw new Error(`Parsing Error? ${line}`);
      }
      c.output.push(line);
    }
  }

  yield commands[commandIdx];
}

function handle_cd(arg: string, tree: FileTree, treeRoot: FileTree): FileTree {
  // Dir is actually a file. Error State
  if (typeof tree[arg] === 'number') {
    throw new Error('Trying to `cd` into a file.');
  }

  // Actually perform the cd
  if (arg === '/') {
    return treeRoot;
  } else {
    // Dir doesn't exist yet
    if (tree[arg] === undefined) {
      tree[arg] = { '..': tree };
    }

    return tree[arg] as FileTree;
  }
}

function handle_ls(output: string[], tree: FileTree): FileTree {
  for (const line of output) {
    const [dirOrSize, file] = line.split(' ');

    if (dirOrSize === 'dir') {
      // Is a dir, instantiate any dirs
      if (tree[file] === undefined) {
        tree[file] = { '..': tree };
      }
    } else {
      // Is a file
      tree[file] = +dirOrSize;
    }
  }

  // Return the mutated tree.
  return tree;
}

function annotateDirSizes(tree: FileTree): number {
  let currSize = 0;

  for (const name in tree) {
    // Ignore metadata
    if (name.startsWith('__') || name === '..') {
      continue;
    }

    const fileOrDir = tree[name];
    if (typeof fileOrDir === 'number') {
      currSize += fileOrDir;
    } else {
      currSize += annotateDirSizes(fileOrDir);
    }
  }

  tree.__size = currSize;
  return currSize;
}

// @ts-ignore -- It's a generator that returns itself
function* findDirsWithLessThanMinSize(tree: FileTree, size: number) {
  // If the current directory satisfies the requirements, yield it.
  if (tree.__size <= size) {
    yield tree.__size;
  }

  // Loop over all inner directories, yield any that also satisfy the requirements
  for (const name in tree) {
    const fileOrDir = tree[name];

    if (name.startsWith('__') || name === '..') {
      continue;
    } else if (typeof fileOrDir === 'number') {
      continue;
    }

    yield* findDirsWithLessThanMinSize(fileOrDir, size);
  }
}

async function main() {
  const fileTree: FileTree = {};
  let treePtr = fileTree;

  // Step 1: Build the file tree by processing commands
  for await (const command of parseCommands()) {
    if (command.name === 'cd') {
      treePtr = handle_cd(command.arg as string, treePtr, fileTree);
    } else if (command.name === 'ls') {
      treePtr = handle_ls(command.output, treePtr);
    } else {
      throw new Error(
        `Unexpected Command: ${command.name} ${command.arg} ${command.output}`,
      );
    }
  }

  // Step 2: Annotate the tree with the size of each directory.
  annotateDirSizes(fileTree);

  // Step 3: Find dirs with size <= 100000, add up all their sizes.
  const dirs = findDirsWithLessThanMinSize(fileTree, 100000);
  let sum = 0;
  for (const d of dirs) {
    sum += d;
  }

  console.log('Sum:', sum);
}

if (import.meta.main) {
  const f = flags.parse(Deno.args);
  if (f.part == 1) {
    main();
  } else if (f.part == 2) {
    main();
  } else {
    console.error(bgRed('ERROR'), red('No part specified'));
    Deno.exit(1);
  }
}
