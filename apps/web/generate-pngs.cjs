const sharp = require('sharp');
const fs = require('fs');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="96" fill="#0F9D58"/>
  <text x="256" y="340" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="240" text-anchor="middle" fill="white">IP</text>
</svg>`;

async function generate() {
  await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icon-192x192.png');
  await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icon-512x512.png');
  console.log('Icons generated successfully.');
}

generate();
