import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cryptoRandomString from 'crypto-random-string';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Generate a random nonce
const nonce = cryptoRandomString({ length: 32, type: 'url-safe' });

// Read the netlify.toml template
const netlifyPath = path.join(projectRoot, 'netlify.toml');
let netlifyContent = fs.readFileSync(netlifyPath, 'utf8');

// Update CSP in netlify.toml
const cspPolicy = `
  default-src 'self' https://hwqanehwtpxfwokmhnpz.supabase.co https://*.netlify.app;
  script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com;
  style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com;
  img-src 'self' data: https://*.unsplash.com https://*.supabase.co https://www.google-analytics.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://hwqanehwtpxfwokmhnpz.supabase.co https://www.google-analytics.com;
  frame-ancestors 'none';
`.replace(/\n\s+/g, ' ').trim();

netlifyContent = netlifyContent.replace(
  /Content-Security-Policy = ".*"/,
  `Content-Security-Policy = "${cspPolicy}"`
);

// Write updated netlify.toml
fs.writeFileSync(netlifyPath, netlifyContent);

// Read the index.html template
const indexPath = path.join(projectRoot, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Add nonce to script and style tags
indexContent = indexContent.replace(
  /<script/g,
  `<script nonce="${nonce}"`
);
indexContent = indexContent.replace(
  /<link rel="stylesheet"/g,
  `<link rel="stylesheet" nonce="${nonce}"`
);

// Write updated index.html
fs.writeFileSync(indexPath, indexContent);

console.log('CSP nonces generated and applied successfully');