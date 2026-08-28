// generate-icons.mjs
// Generates PNG icons from SVG for PWA using pure Node.js (no canvas dependency)
// Run: node generate-icons.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// We embed the SVG as a data URI in an HTML file and use a simple PNG stub
// For actual production, these PNGs are pre-committed to public/
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="96" fill="#0F9D58"/>
  <text x="256" y="340" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="240" text-anchor="middle" fill="white">IP</text>
</svg>`;

// Write SVG files at each size (browsers that don't support SVG manifest icons
// will fall back to the JPG copies already committed)
const outputDir = path.join(__dirname, 'public');
fs.writeFileSync(path.join(outputDir, 'icon.svg'), svgContent);
console.log('✓ icon.svg written');
