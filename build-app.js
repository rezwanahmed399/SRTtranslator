const fs = require('fs');
const path = require('path');
const { uploadFile, getR2PublicUrl } = require('./lib/r2');

const destDir = path.join(__dirname, 'www');

// Create www directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Extract current versionName from android/app/build.gradle if available
let currentVersion = '1.6.0';
try {
  const gradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
  if (fs.existsSync(gradlePath)) {
    const gradleContent = fs.readFileSync(gradlePath, 'utf8');
    const match = gradleContent.match(/versionName\s+["']([^"']+)["']/);
    if (match && match[1]) {
      currentVersion = match[1];
    }
  }
} catch (e) {}

const currentApkName = `SubMorph-v${currentVersion.replace(/^v/, "")}.apk`;

// If a new gradle build output exists, copy it to the versioned APK file
const gradleApk = path.join(__dirname, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
if (fs.existsSync(gradleApk)) {
  fs.copyFileSync(gradleApk, path.join(__dirname, currentApkName));
  console.log(`📦 Synced Gradle build output -> ${currentApkName}`);
}

// Clean up all old/previous APK files from root and www (except current active version)
const cleanOldApks = (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.apk') && file !== currentApkName) {
      const filePath = path.join(dir, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Removed old APK: ${file} from ${path.relative(__dirname, dir) || '.'}`);
      } catch (e) {
        console.warn(`Could not delete ${filePath}:`, e.message);
      }
    }
  });
};

cleanOldApks(__dirname);
cleanOldApks(destDir);
cleanOldApks(path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public'));

// Generate fresh build metadata in version.json
const now = new Date();
const r2ApkUrl = getR2PublicUrl(currentApkName);
const r2LatestApkUrl = getR2PublicUrl('SubMorph-latest.apk');

const buildVersion = {
  latestVersion: currentVersion,
  buildTime: now.toISOString(),
  buildTimestamp: now.getTime(),
  buildDateFormatted: now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
  apkFileName: currentApkName,
  apkUrl: r2ApkUrl,
  latestApkUrl: r2LatestApkUrl,
  localApkUrl: `/${currentApkName}`,
  forceUpdate: false
};
fs.writeFileSync(path.join(__dirname, 'version.json'), JSON.stringify(buildVersion, null, 2));

// Update index.html header-apk-btn href to match R2 APK download URL
try {
  const indexHtmlPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    indexHtml = indexHtml.replace(/href=["'](https:\/\/pub-[^"']+\.r2\.dev\/[^"']+|SubMorph-[^"']+\.apk)["']/g, `href="${r2LatestApkUrl}"`);
    indexHtml = indexHtml.replace(/download=["'][^"']+\.apk["']/g, `download="SubMorph-latest.apk"`);
    fs.writeFileSync(indexHtmlPath, indexHtml);
  }
} catch (e) {
  console.warn('Could not patch index.html link:', e.message);
}

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
  currentApkName
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file} -> www/${file}`);
  }
});

// Also create SubMorph-latest.apk in www for generic download links
const latestApkDest = path.join(destDir, 'SubMorph-latest.apk');
const currentApkSrc = path.join(__dirname, currentApkName);
if (fs.existsSync(currentApkSrc)) {
  fs.copyFileSync(currentApkSrc, latestApkDest);
  console.log(`✓ Created www/SubMorph-latest.apk (alias for ${currentApkName})`);
}

// Dedicated Clean Output Folder: D:\SubMorph APK
const dedicatedApkDir = 'D:\\SubMorph APK';
try {
  if (!fs.existsSync(dedicatedApkDir)) {
    fs.mkdirSync(dedicatedApkDir, { recursive: true });
  }
  cleanOldApks(dedicatedApkDir);

  const activeApkSrc = path.join(__dirname, currentApkName);
  if (fs.existsSync(activeApkSrc)) {
    const destDedicatedApk = path.join(dedicatedApkDir, currentApkName);
    fs.copyFileSync(activeApkSrc, destDedicatedApk);
    console.log(`📁 Synced active APK to clean folder -> ${destDedicatedApk}`);

    // Strictly DO NOT save to D:\ root per user rule! Clean any accidental files from D:\ root
    try {
      const dFiles = fs.readdirSync('D:\\');
      dFiles.forEach(f => {
        if (f.startsWith('SubMorph') && f.endsWith('.apk')) {
          fs.unlinkSync(path.join('D:\\', f));
          console.log(`🗑️ Removed ${f} from D:\\ root (per strict user rule)`);
        }
      });
    } catch (err) {}
  }
} catch (e) {
  console.warn(`Could not sync to dedicated APK folder (${dedicatedApkDir}):`, e.message);
}

// Automatically sync latest APK and version.json to Cloudflare R2
async function syncR2() {
  try {
    const activeApkSrc = path.join(__dirname, currentApkName);
    if (fs.existsSync(activeApkSrc)) {
      const apkBuffer = fs.readFileSync(activeApkSrc);
      console.log(`🚀 Uploading ${currentApkName} to Cloudflare R2...`);
      await uploadFile(currentApkName, apkBuffer, 'application/vnd.android.package-archive', `attachment; filename=${currentApkName}`);
      console.log(`✓ Cloudflare R2: ${currentApkName} uploaded (${r2ApkUrl})`);

      await uploadFile('SubMorph-latest.apk', apkBuffer, 'application/vnd.android.package-archive', 'attachment; filename=SubMorph-latest.apk');
      console.log(`✓ Cloudflare R2: SubMorph-latest.apk uploaded (${r2LatestApkUrl})`);
    }

    const versionJsonPath = path.join(__dirname, 'version.json');
    if (fs.existsSync(versionJsonPath)) {
      const verBuf = fs.readFileSync(versionJsonPath);
      await uploadFile('version.json', verBuf, 'application/json; charset=utf-8');
      console.log(`✓ Cloudflare R2: version.json uploaded`);
    }
  } catch (err) {
    console.warn('⚠️ Cloudflare R2 sync warning (will retry on next build):', err.message);
  }
}

syncR2().then(() => {
  console.log(`[Build Complete] Active APK: ${currentApkName}. Cloudflare R2 & local files synced.`);
});
