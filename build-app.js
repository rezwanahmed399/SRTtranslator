const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'www');

// Create www directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Generate fresh build metadata in version.json
const now = new Date();
const buildVersion = {
  latestVersion: "1.2.0",
  buildTime: now.toISOString(),
  buildTimestamp: now.getTime(),
  buildDateFormatted: now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
  apkFileName: "SRTtranslator-latest.apk",
  forceUpdate: false
};
fs.writeFileSync(path.join(__dirname, 'version.json'), JSON.stringify(buildVersion, null, 2));

// Files to copy to www
const filesToCopy = [
  'index.html',
  'style.css',
  'app.js',
  'firebase-config.js',
  'firebase-sync.js',
  'sample.srt',
  'test_sample.srt',
  'robots.txt',
  'sitemap.xml',
  'version.json',
  'google56417e4931d45822.html',
  'download.html',
  'SRTtranslator-latest.apk'
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file} -> www/${file}`);
  }
});

console.log('[Build Complete] Web assets packaged into www/ directory successfully with fresh build timestamp.');

