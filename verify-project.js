require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'tailwind.config.js',
  'postcss.config.js',
  'next.config.js',
  'middleware.ts',
  'app/page.tsx',
  'app/layout.tsx',
  'app/globals.css',
  'app/api/check/route.js',
  'public/manifest.json',
  'public/icons/icon-192x192.png',
  'public/favicon.ico',
];

const requiredEnv = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'];

const projectRoot = process.cwd();
let hasError = false;

console.log('🔍 Verifying KHAB555 project structure...\n');

// Check required files
for (const relPath of requiredFiles) {
  const fullPath = path.join(projectRoot, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing: ${relPath}`);
    hasError = true;
  } else {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('// placeholder')) {
      console.error(`⚠️ Placeholder found in: ${relPath}`);
      hasError = true;
    } else {
      console.log(`✅ OK: ${relPath}`);
    }
  }
}

// Check required env variables
console.log('\n🔍 Checking environment variables...\n');
require('dotenv').config({ path: '.env.local' }); // ✅ Correct


for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing ENV: ${key}`);
    hasError = true;
  } else {
    console.log(`✅ Present: ${key}`);
  }
}

if (!hasError) {
  console.log('\n🎉 All checks passed. KHAB555 is good to go!');
  process.exit(0);
} else {
  console.warn('\n⚠️ Issues detected. Please resolve the above before continuing.');
  process.exit(1);
}
