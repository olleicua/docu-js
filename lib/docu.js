#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = resolve(__dirname, '..');
const babelConfigPath = resolve(packageRoot, 'babel.config.json');

const [_0, _1, inPath, outPath] = process.argv;

if (!inPath || !outPath) {
  console.log('usage: npx docu IN_PATH OUT_PATH');
  process.exit(1);
}

execSync(`npx babel ${inPath} --out-dir ${outPath} --config-file ${babelConfigPath}`, {
  stdio: 'inherit'
});
