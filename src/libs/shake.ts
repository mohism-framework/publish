import { existsSync, readdirSync, rmdirSync, statSync, unlinkSync } from 'fs';

const files: Array<string> = [
  '.yarn-integrity',
  'LICENSE',
  'license',
  '.travis.yml',
  'README.md',
  'readme.md',
  'ReadMe.md',
  'Makefile',
  '.eslinitrc',
  '.eslinitignore',
  'yarn-metadata.json',
  'test.js',
  'changelog',
  'CHANGELOG',
  'changelog.md',
  'CHANGELOG.md',
];

const directory: Array<string> = [
  'example',
  'examples',
  'test',
  'tests',
  'doc',
  'docs',
  'coverage',
  '.idea',
  '.git',
  'man',
];

function scan(p: string) {
  if (statSync(p).isDirectory()) {
    const name: string = p.split('/').pop() as string;

    if (directory.includes(name)) {
      forceDelete(p);
      return;
    }
    const ls = readdirSync(p);

    for (const k of ls) {
      scan(`${p}/${k}`);
    }
  } else {
    const name: string = p.split('/').pop() as string;
    if (files.includes(name)) {
      forceDelete(p);
    }
  }
}

function forceDelete(p: string) {
  if (statSync(p).isDirectory()) {
    let ls = readdirSync(p);
    for (const k of ls) {
      forceDelete(`${p}/${k}`);
    }
    rmdirSync(p);
  } else {
    unlinkSync(p);
  }
}

export default (dir: string): any => {
  if (!existsSync(dir)) {
    return null;
  }
  return scan(dir);
};