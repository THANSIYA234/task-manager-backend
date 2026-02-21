#!/usr/bin/env node
// Robust start script: try several possible paths for the compiled main.js
// and require the first one found. This helps hosts (like Render) that may
// change working directories between build and runtime.
const fs = require('fs');
const path = require('path');

require('source-map-support/register');

const candidates = [
  path.resolve(__dirname, 'dist', 'main.js'),
  path.resolve(__dirname, 'dist', 'src', 'main.js'),
  path.resolve(__dirname, '..', 'dist', 'main.js'),
  path.resolve(process.cwd(), 'dist', 'main.js'),
  path.resolve(process.cwd(), 'tasks', 'Backend', 'dist', 'main.js'),
];

let entry = null;
for (const c of candidates) {
  if (fs.existsSync(c)) {
    entry = c;
    break;
  }
}

if (!entry) {
  console.error(
    'Could not find compiled entry. Tried:',
    candidates.join('\n  '),
  );
  console.error(
    'Make sure the project was built and the `dist` directory was included in the deploy.',
  );
  process.exit(1);
}

console.log('Starting server using entry:', entry);
require(entry);
