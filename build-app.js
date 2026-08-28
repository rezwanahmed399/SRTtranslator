const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'www');

// Create www directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Files to copy to www
const filesToCopy = [
  'index.html',
  'style.css',
  'app.js',
  'sample.srt',
  'test_sample.srt',
  'robots.txt',
  'sitemap.xml',
  'version.json',
  'google56417e4931d45822.html'
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file} -> www/${file}`);
  }
});

console.log('[Build Complete] Web assets packaged into www/ directory successfully.');
