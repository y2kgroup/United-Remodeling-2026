import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Dynamically grab all HTML files in the root
const rootDir = resolve(__dirname);
const files = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));

const buildInput = {};
files.forEach(file => {
  const name = file.replace(/\.html$/, '');
  buildInput[name] = resolve(rootDir, file);
});

export default defineConfig({
  build: {
    rollupOptions: {
      input: buildInput,
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
